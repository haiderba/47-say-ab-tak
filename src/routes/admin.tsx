import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  FileCheck,
  Fingerprint,
  HardDrive,
  KeyRound,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { getAdminOverview } from "@/lib/vault";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [data, setData] = useState<{
    stats?: { totalUsers: number; totalDocs: number; encryptionStandard: string };
    categories?: { category: string; count: number }[];
    audits?: { id: number; actor_email: string; action: string; details: string; created_at: string }[];
    users?: { id: string; name: string; email: string; createdAt: string; doc_count: number }[];
  }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await getAdminOverview();
      if (res) setData(res);
    } catch (e) {
      console.error("Admin data fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const users = Array.isArray(data?.users) ? data.users : [];
  const audits = Array.isArray(data?.audits) ? data.audits : [];
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  const stats = data?.stats || { totalUsers: 0, totalDocs: 0, encryptionStandard: "AES-256-GCM" };

  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    const q = search.trim().toLowerCase();
    return !q || (u.email && u.email.toLowerCase().includes(q)) || (u.name && u.name.toLowerCase().includes(q));
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Admin Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-danger">
            <ShieldCheck className="size-3.5" /> Administrative Compliance & Vault Auditor
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-primary sm:text-4xl">
            Admin Compliance & Security Portal
          </h1>
          <p className="mt-1 text-xs text-muted">
            Monitor registered citizen accounts, encrypted document counts, and system-wide zero-exfiltration audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-fg hover:bg-bg shadow-sm"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh Data
          </button>
        </div>
      </div>

      {/* ZERO-EXFILTRATION SECURITY BANNER */}
      <div className="mt-6 rounded-2xl border-2 border-danger/30 bg-gradient-to-r from-red-50/50 via-surface to-bg p-5 text-xs text-neutral-900">
        <div className="flex items-center gap-2 font-bold text-danger">
          <Lock className="size-4" /> Zero-Trust Anti-Exfiltration Enforcement
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          In compliance with National Data Protection & Privacy standards, <strong>raw binary file downloads are cryptographically blocked on the frontend for all roles including Administrators</strong>. Administrators may only audit metadata (verification status, category counts, masked IDs, and SHA-256 hashes).
        </p>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Citizens</span>
            <Users className="size-5 text-primary" />
          </div>
          <div className="mt-3 font-display text-4xl font-extrabold text-primary">
            {stats.totalUsers}
          </div>
          <p className="mt-1 text-[11px] text-muted">Active citizen accounts in database</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Encrypted Files in Vault</span>
            <HardDrive className="size-5 text-accent" />
          </div>
          <div className="mt-3 font-display text-4xl font-extrabold text-accent">
            {stats.totalDocs}
          </div>
          <p className="mt-1 text-[11px] text-muted">Sealed with AES-256-GCM cipher</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Security Architecture</span>
            <ShieldCheck className="size-5 text-emerald-600" />
          </div>
          <div className="mt-3 font-display text-xl font-bold text-emerald-700">
            Zero-Trust Vault
          </div>
          <p className="mt-1 text-[11px] text-muted">Frontend exfiltration permanently disabled</p>
        </div>
      </div>

      {/* CATEGORY DISTRIBUTION */}
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Vault Documents Category Breakdown
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <div
              key={c.category}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3.5 py-2 text-xs"
            >
              <span className="font-semibold text-fg">{c.category}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">
                {c.count} files
              </span>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-muted">No documents uploaded yet.</p>
          )}
        </div>
      </div>

      {/* CITIZEN ACCOUNTS AUDIT TABLE */}
      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">
              Citizen Accounts & Vault Storage Audit
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Auditing registered users and their protected document counts.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search citizen by name or email..."
              className="rounded-xl border border-border bg-bg pl-9 pr-4 py-2 text-xs text-fg outline-none focus:border-primary w-64"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Citizen Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Vault Files</th>
                <th className="py-3 px-3">Account Created</th>
                <th className="py-3 px-3 text-right">Data Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-bg/50">
                  <td className="py-3.5 px-3 font-semibold text-fg">{u.name}</td>
                  <td className="py-3.5 px-3 font-mono text-muted">{u.email}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">
                      {u.doc_count} encrypted files
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-muted">
                    {new Date(u.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <ShieldCheck className="size-3.5" /> AES-256 Sealed
                    </span>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No citizen accounts found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM AUDIT TRAIL LOGS */}
      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h3 className="font-display text-lg font-bold text-primary">
          Real-Time Cryptographic Audit Trail
        </h3>
        <p className="text-xs text-muted mt-0.5">
          Immutable server security logs for all document operations and compliance checks.
        </p>

        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
          {audits.map((a) => (
            <div
              key={a.id}
              className="flex flex-col justify-between gap-1 rounded-xl border border-border bg-bg/50 p-3 text-xs sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  {a.action}
                </span>
                <span className="text-fg font-semibold">{a.actor_email}</span>
                <span className="text-muted text-[11px] truncate max-w-xs">{a.details}</span>
              </div>
              <span className="font-mono text-[10px] text-muted shrink-0">
                {new Date(a.created_at).toLocaleString("en-PK")}
              </span>
            </div>
          ))}

          {audits.length === 0 && (
            <p className="py-4 text-center text-xs text-muted">No audit events recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
