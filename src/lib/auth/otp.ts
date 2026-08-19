import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { sendBrevoVerificationEmail } from "@/lib/email/brevo.server";

export const sendEmailOtp = createServerFn({ method: "POST" })
  .validator((d: { email: string; name?: string }) => d)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const name = data.name?.trim() || "Citizen";
    const sql = await getSql();
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const recordId = "otp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

    await sql`delete from verification where identifier = ${"otp:" + email}`;
    await sql`insert into verification (id, identifier, value, "expiresAt") values (${recordId}, ${"otp:" + email}, ${otpCode}, ${expiresAt})`;

    const verifyUrl = "http://localhost:8080/verify-email?email=" + encodeURIComponent(email) + "&otp=" + otpCode;
    const emailResult = await sendBrevoVerificationEmail({ toEmail: email, toName: name, otpCode, verifyUrl });
    return { success: true, message: "6-digit code sent via Brevo", simulated: emailResult.simulated };
  });

export const verifyEmailOtp = createServerFn({ method: "POST" })
  .validator((d: { email: string; otp: string }) => d)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const otp = data.otp.trim();
    const sql = await getSql();

    const rows = await sql<{ id: string; value: string; expiresAt: Date | string }>`
      select id, value, "expiresAt" from verification where identifier = ${"otp:" + email} order by "createdAt" desc limit 1
    `;

    if (!rows[0] || rows[0].value !== otp) {
      throw new Error("Invalid 6-digit verification code. Please check your email or request a new code.");
    }
    if (new Date(rows[0].expiresAt).getTime() < Date.now()) {
      throw new Error("Verification code expired (15-minute limit). Please request a new code.");
    }

    await sql`update "user" set "emailVerified" = true where lower(email) = ${email}`;
    await sql`delete from verification where id = ${rows[0].id}`;
    return { success: true, message: "Email verified successfully!" };
  });