import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

async function encryptData(text: string): Promise<string> {
  const crypto = await import("node:crypto");
  const masterKey = crypto
    .createHash("sha256")
    .update(process.env.VAULT_SECRET_KEY || "pak-citizen-47-vault-encryption-key-2026-secure-salt")
    .digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

function maskDocumentNumber(num: string): string {
  if (!num) return "—";
  const clean = num.trim();
  if (clean.length <= 4) return "****";
  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-*****${parts[1].slice(-2)}-${parts[2]}`;
    }
  }
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}

// 1. SAVE USER ENCRYPTED DOCUMENT
export const saveUserDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      title: string;
      category: string;
      documentNumber: string;
      fileName: string;
      fileBase64: string;
      fileMimeType: string;
      issueDate?: string;
      expiryDate?: string;
      notes?: string;
    }) => d
  )
  .handler(async ({ data, context }) => {
    const crypto = await import("node:crypto");
    const userId = context.userId || "guest-citizen";
    const sql = await getSql();

    // Compute SHA-256 integrity hash
    const fileSha256 = crypto
      .createHash("sha256")
      .update(data.fileBase64 || data.fileName)
      .digest("hex");

    // Encrypt the file payload at rest with AES-256-GCM
    const encryptedData = await encryptData(data.fileBase64 || "NO_BINARY_CONTENT");
    const maskedNumber = maskDocumentNumber(data.documentNumber);
    const fileSize = Math.round((data.fileBase64.length * 3) / 4);

    const rows = await sql<{ id: number }>`
      insert into user_documents (
        user_id, title, category, document_number_masked, encrypted_data,
        file_name, file_size_bytes, file_mime_type, file_sha256,
        issue_date, expiry_date, notes
      ) values (
        ${userId}, ${data.title}, ${data.category}, ${maskedNumber}, ${encryptedData},
        ${data.fileName}, ${fileSize}, ${data.fileMimeType}, ${fileSha256},
        ${data.issueDate || null}, ${data.expiryDate || null}, ${data.notes || null}
      )
      returning id
    `;

    // Write security audit log
    await sql`
      insert into audit_logs (actor_user_id, actor_email, action, target_user_id, details)
      values (
        ${userId}, ${userId}, DOCUMENT_UPLOAD_ENCRYPTED, ${userId},
        ${JSON.stringify({ category: data.category, title: data.title, sha256: fileSha256.slice(0, 12) + "..." })}
      )
    `;

    return { success: true, id: rows[0]?.id };
  });

// 2. LIST USER DOCUMENTS (ZERO-EXFILTRATION: RAW BINARY IS STRIPPED)
export const listUserDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId || "guest-citizen";
    const sql = await getSql();

    const rows = await sql<{
      id: number;
      title: string;
      category: string;
      document_number_masked: string;
      file_name: string;
      file_size_bytes: number;
      file_mime_type: string;
      file_sha256: string;
      issue_date: string | null;
      expiry_date: string | null;
      notes: string | null;
      is_verified: boolean;
      created_at: string;
    }>`
      select
        id, title, category, document_number_masked, file_name,
        file_size_bytes, file_mime_type, file_sha256,
        issue_date, expiry_date, notes, is_verified, created_at::text as created_at
      from user_documents
      where user_id = ${userId}
      order by created_at desc
    `;

    return rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      category: String(r.category),
      document_number_masked: String(r.document_number_masked),
      file_name: String(r.file_name),
      file_size_bytes: Number(r.file_size_bytes),
      file_mime_type: String(r.file_mime_type),
      file_sha256: String(r.file_sha256),
      issue_date: r.issue_date ? String(r.issue_date) : null,
      expiry_date: r.expiry_date ? String(r.expiry_date) : null,
      notes: r.notes ? String(r.notes) : null,
      is_verified: Boolean(r.is_verified),
      created_at: String(r.created_at),
    }));
  });

// 3. DELETE USER DOCUMENT
export const deleteUserDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d)
  .handler(async ({ data, context }) => {
    const userId = context.userId || "guest-citizen";
    const sql = await getSql();

    await sql`
      delete from user_documents
      where id = ${data.id} and user_id = ${userId}
    `;

    return { success: true };
  });

// 4. ADMIN PORTAL OVERVIEW (COMPLIANCE AUDITING WITHOUT FILE EXFILTRATION)
export const getAdminOverview = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();

    // 1. Total Accounts
    const userCountRows = await sql<{ count: number }>`
      select count(*)::int as count from "user"
    `;
    const totalUsers = userCountRows[0]?.count || 0;

    // 2. Total Encrypted Vault Documents
    const docCountRows = await sql<{ count: number }>`
      select count(*)::int as count from user_documents
    `;
    const totalDocs = docCountRows[0]?.count || 0;

    // 3. Categories breakdown
    const catRows = await sql<{ category: string; count: number }>`
      select category, count(*)::int as count
      from user_documents
      group by category
      order by count desc
    `;

    // 4. Recent Audits
    const auditRows = await sql<{
      id: number;
      actor_email: string;
      action: string;
      details: string;
      created_at: string;
    }>`
      select id, actor_email, action, details, created_at::text as created_at
      from audit_logs
      order by created_at desc
      limit 15
    `;

    // 5. Recent User Accounts with masked doc counts
    const userListRows = await sql<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
      doc_count: number;
    }>`
      select
        u.id,
        u.name,
        u.email,
        u."createdAt"::text as "createdAt",
        count(d.id)::int as doc_count
      from "user" u
      left join user_documents d on d.user_id = u.id
      group by u.id, u.name, u.email, u."createdAt"
      order by u."createdAt" desc
      limit 25
    `;

    return {
      stats: {
        totalUsers: Number(totalUsers),
        totalDocs: Number(totalDocs),
        encryptionStandard: "AES-256-GCM (Zero-Exfiltration)",
      },
      categories: catRows.map((c) => ({
        category: String(c.category),
        count: Number(c.count),
      })),
      audits: auditRows.map((a) => ({
        id: Number(a.id),
        actor_email: String(a.actor_email || "system"),
        action: String(a.action || "INFO"),
        details: String(a.details || ""),
        created_at: String(a.created_at || ""),
      })),
      users: userListRows.map((u) => ({
        id: String(u.id),
        name: String(u.name || "Citizen"),
        email: String(u.email || ""),
        createdAt: String(u.createdAt || ""),
        doc_count: Number(u.doc_count || 0),
      })),
    };
  }
);
