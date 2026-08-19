import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Fingerprint,
  HardDrive,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
  Zap,
} from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient } from "@/lib/auth/client";
import { listUserDocuments, saveUserDocument, deleteUserDocument } from "@/lib/vault";

export function CitizenVault() {
  const { user, isPending } = useCurrentUserState();

  // Auth form state (if not logged in)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Vault documents state
  const [docs, setDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CNIC");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const lastFetchedIdRef = useRef<string | undefined>(undefined);

  const fetchDocs = useCallback((showSpinner = false) => {
    if (showSpinner) setLoadingDocs(true);
    listUserDocuments()
      .then((res) => {
        setDocs(Array.isArray(res) ? res : []);
        setLoadingDocs(false);
      })
      .catch(() => setLoadingDocs(false));
  }, []);

  useEffect(() => {
    const uid = user?.id || "guest";
    if (lastFetchedIdRef.current !== uid) {
      lastFetchedIdRef.current = uid;
      fetchDocs(true);
    }
  }, [user?.id, fetchDocs]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: fullName || email.split("@")[0],
        });
        if (error) throw new Error(error.message || "Sign-up failed");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message || "Sign-in failed");
      }
      window.location.reload();
    } catch (err: any) {
      setAuthError(err.message || "Authentication error");
      setAuthLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedFile({
        name: file.name,
        type: file.type || "application/octet-stream",
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setUploading(true);
    try {
      await saveUserDocument({
        data: {
          title,
          category,
          documentNumber,
          fileName: selectedFile?.name || "document.pdf",
          fileBase64: selectedFile?.base64 || "ENCRYPTED_PLACEHOLDER",
          fileMimeType: selectedFile?.type || "application/pdf",
          issueDate: issueDate || undefined,
          expiryDate: expiryDate || undefined,
          notes: notes || undefined,
        },
      });

      setShowUploadModal(false);
      setTitle("");
      setDocumentNumber("");
      setIssueDate("");
      setExpiryDate("");
      setNotes("");
      setSelectedFile(null);
      fetchDocs();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document from your vault?")) return;
    try {
      await deleteUserDocument({ data: { id } });
      fetchDocs();
    } catch (err) {
      alert("Deletion failed");
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Vault Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Lock className="size-3.5" /> AES-256-GCM Zero-Exfiltration Vault
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Citizen Encrypted Document Vault
          </h2>
          <p className="mt-1 text-xs text-muted">
            Upload, organize, and track your citizen paperwork with hardware-grade AES-256 encryption.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
          >
            <UploadCloud className="size-4" /> Upload Encrypted Document
          </button>
        </div>
      </div>

      {/* Zero-Exfiltration Security Badge */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-bold text-primary">
          <ShieldCheck className="size-4 text-primary" /> Zero-Trust & Anti-Exfiltration Cryptographic Guarantee
        </div>
        <p className="mt-1 text-xs leading-relaxed text-emerald-900">
          All document contents and attachments are encrypted at rest with <strong>AES-256-GCM</strong>. To prevent data leakage and bulk administrative misuse, direct raw binary downloading is strictly disabled across all frontend interfaces — including admin roles.
        </p>
      </div>      {/* Authenticated Citizen Status / Sign-in Prompt */}
      {user ? (
        <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-primary text-accent font-display text-lg font-bold shadow-sm">
              {(user.displayName || user.primaryEmail || "C").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" /> Logged In: {user.displayName || "Verified Citizen"}
              </div>
              <div className="text-xs font-mono text-muted">{user.primaryEmail}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="rounded-xl border border-primary/30 bg-surface px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              My Profile &amp; Password
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-border bg-bg/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display text-sm font-bold text-primary">
              Sync Your Encrypted Documents Across Devices
            </span>
            <p className="mt-1 text-xs text-muted">
              Sign in with your verified citizen account to access your personal encrypted vault.
            </p>
          </div>
          <Link
            to="/login"
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-sm shrink-0"
          >
            Sign In / Register
          </Link>
        </div>
      )}

      {/* Encrypted Documents List */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            Your Stored Documents ({docs.length})
          </h3>
          <button
            type="button"
            onClick={() => fetchDocs(true)}
            className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors"
          >
            <RefreshCw className={`size-3 ${loadingDocs ? "animate-spin text-primary" : ""}`} /> Refresh
          </button>
        </div>

        <div className="mt-4 min-h-[140px]">
          {loadingDocs && docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-bg/20 p-10 text-center text-xs text-muted flex items-center justify-center gap-2">
              <RefreshCw className="size-4 animate-spin text-primary" /> Loading encrypted documents...
            </div>
          ) : docs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-bg/50 p-5 shadow-sm transition-all hover:border-primary/40 hover:bg-surface"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-surface border border-border px-2 py-0.5 text-[10px] font-bold text-accent">
                        {d.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        className="text-muted hover:text-danger p-1 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <h4 className="mt-2 font-display text-base font-bold text-primary">{d.title}</h4>
                    <div className="mt-1 text-xs font-mono text-muted">
                      Doc No: <strong className="text-fg">{d.document_number_masked}</strong>
                    </div>

                    <div className="mt-3 space-y-1 rounded-xl bg-surface p-3 text-[11px] text-muted border border-border/70">
                      <div className="flex justify-between">
                        <span>File Name:</span>
                        <span className="font-semibold text-fg truncate max-w-[120px]">{d.file_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Encryption:</span>
                        <span className="font-bold text-primary">AES-256-GCM ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SHA-256 Integrity:</span>
                        <span className="font-mono text-[10px] text-fg">{d.file_sha256.slice(0, 10)}...</span>
                      </div>
                      {d.expiry_date && (
                        <div className="flex justify-between border-t border-border pt-1 font-semibold">
                          <span>Expiry Date:</span>
                          <span className="text-warn-fg">{d.expiry_date}</span>
                        </div>
                      )}
                    </div>

                    {d.notes && (
                      <p className="mt-2 text-[11px] text-muted italic line-clamp-2">{d.notes}</p>
                    )}
                  </div>

                  <div className="mt-4 border-t border-border pt-3 flex items-center justify-between text-[11px]">
                    <span className="text-muted">Protected at Rest</span>
                    <span className="inline-flex items-center gap-1 font-bold text-primary">
                      <Lock className="size-3" /> Sealed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-bg/30 p-10 text-center text-xs text-muted">
              <UploadCloud className="mx-auto size-8 text-muted/60 mb-2" />
              Your encrypted vault is empty. Click &quot;Upload Encrypted Document&quot; above to save your first citizen file.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Lock className="size-4 text-primary" /> Upload Encrypted Document
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-xs font-semibold text-muted hover:text-fg"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Document Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Smart CNIC / Model Town Plot Fard"
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  >
                    <option value="CNIC">🪪 CNIC / Smart Card</option>
                    <option value="Passport">🛂 Passport (DGIP)</option>
                    <option value="Land Record / Fard">📜 Land Record / Fard / Registry</option>
                    <option value="Driving License">🚗 Driving License (DLIMS)</option>
                    <option value="Rent Agreement">🏠 Rent Agreement (Iqrar Nama)</option>
                    <option value="Tax / NTN">💼 Tax Return / NTN (FBR)</option>
                    <option value="Other">📁 Other Document</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Document Number</label>
                  <input
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="e.g. 35201-1234567-1"
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Attach File / Photo (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-surface"
                />
                {selectedFile && (
                  <p className="mt-1 text-[11px] text-primary font-semibold">
                    ✓ File selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Personal Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Registered with Model Town Sub-Registrar / Token Tax paid till 2027"
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="rounded-xl bg-primary/5 p-3 text-[11px] text-primary leading-relaxed">
                <strong>🔒 Cryptographic Protection:</strong> This file will be encrypted on the server using AES-256-GCM. Raw binary download is permanently restricted to ensure anti-exfiltration compliance.
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-surface hover:bg-primary-light disabled:opacity-50"
                >
                  {uploading ? "Encrypting & Storing..." : "Save to Encrypted Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
