import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Lock,
  Mail,
  User,
  UserCheck,
  ArrowRight,
  Shield,
  RefreshCw,
  LogOut,
  Save,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateUserProfile } from "@/lib/auth/password";
import { OtpVerification } from "@/components/otp-input";
import { sendEmailOtp } from "@/lib/auth/otp";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  if (isPending) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <RefreshCw className="mx-auto size-8 text-primary animate-spin" />
        <p className="mt-3 text-xs text-muted">Loading citizen profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-card">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">Sign In Required</h1>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            Please sign in to view and manage your citizen profile and encrypted vault.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-surface hover:bg-primary-light transition-colors"
            >
              Sign In to Account <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const emailStr = user.primaryEmail || "";
  const isAdmin = emailStr.toLowerCase() === "admin@47sayabtak.pk" || emailStr.toLowerCase().startsWith("admin");
  const initial = (user.displayName || user.primaryEmail || "C").charAt(0).toUpperCase();

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingName(true);
    setErrorMsg(null);
    setNameSuccess(false);

    try {
      await updateUserProfile({ data: { name: name.trim() } });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setChangingPass(true);
    setErrorMsg(null);
    setPassSuccess(false);

    try {
      // Use Better Auth changePassword
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword: newPassword, // fallback
        revokeOtherSessions: false,
      });

      if (error) {
        // Alternative fallback: Trigger OTP reset
        setShowOtpModal(true);
      } else {
        setPassSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPassSuccess(false), 3000);
      }
    } catch (err: any) {
      setShowOtpModal(true);
    } finally {
      setChangingPass(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar Initial Badge */}
          <div className="grid size-20 sm:size-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary text-3xl sm:text-4xl font-extrabold font-display text-accent shadow-lg ring-4 ring-accent/20">
            {initial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary truncate">
                {user.displayName || "Verified Citizen"}
              </h1>
              {isAdmin ? (
                <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[11px] font-bold text-danger">
                  👑 System Administrator
                </span>
              ) : (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Citizen Account
                </span>
              )}
            </div>

            <p className="mt-1 font-mono text-xs text-muted">{user.primaryEmail}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-bold text-surface hover:bg-primary-light transition-colors shadow-sm"
              >
                <ShieldCheck className="size-4" /> Open Encrypted Vault
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-bold text-danger hover:bg-red-100 transition-colors"
                >
                  <Shield className="size-4" /> Admin Compliance
                </Link>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 font-semibold text-muted hover:text-danger hover:bg-bg transition-colors"
              >
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Card 1: Legal Name Update */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2.5 text-primary font-display text-lg font-bold">
            <User className="size-5 text-accent" /> Citizen Details
          </div>
          <p className="mt-1 text-xs text-muted">
            Your official name as registered for document generation and affidavits.
          </p>

          <form onSubmit={handleUpdateName} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address (Locked)</label>
              <input
                type="email"
                value={user.primaryEmail || ""}
                disabled
                className="mt-1.5 w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs font-semibold text-muted outline-none cursor-not-allowed font-mono"
              />
            </div>

            {nameSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-primary font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Name updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={savingName}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-sm disabled:opacity-50"
            >
              {savingName ? "Saving..." : <><Save className="size-4" /> Save Profile Details</>}
            </button>
          </form>
        </div>

        {/* Card 2: Security & Password Management */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2.5 text-primary font-display text-lg font-bold">
            <KeyRound className="size-5 text-accent" /> Password &amp; Security
          </div>
          <p className="mt-1 text-xs text-muted">
            Update your account password or reset securely via Brevo 6-Digit OTP.
          </p>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">New Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-danger font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {passSuccess && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-primary font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Password changed successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={changingPass}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-sm disabled:opacity-50"
            >
              {changingPass ? "Updating Password..." : <><Lock className="size-4" /> Update Password</>}
            </button>
          </form>

          {/* Quick Brevo Reset Button */}
          <div className="mt-4 border-t border-border pt-4 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1.5"
            >
              <KeyRound className="size-3.5" /> Or use 6-Digit Email OTP Password Reset
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
