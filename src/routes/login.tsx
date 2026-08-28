import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { authClient, GROK_PROVIDERS, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OtpVerification } from "@/components/otp-input";
import { sendEmailOtp } from "@/lib/auth/otp";
import { sendPasswordResetOtp, verifyResetOtpAndSetPassword } from "@/lib/auth/password";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user } = useCurrentUserState();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  // If already logged in, show logged-in state
  if (user) {
    const emailStr = user.primaryEmail || "";
    const isAdmin = emailStr.toLowerCase() === "admin@47sayabtak.pk" || emailStr.toLowerCase().startsWith("admin");

    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-card text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <UserCheck className="size-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">
            Welcome, {user.displayName || "Citizen"}!
          </h1>
          <p className="mt-1 text-xs text-muted font-mono">{user.primaryEmail}</p>

          <div className="mt-6 space-y-3">
            <Link
              to="/tools"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-md"
            >
              Open Encrypted Document Vault <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-primary text-primary py-2.5 text-xs font-bold hover:bg-primary/5 transition-colors"
            >
              <User className="size-4" /> Manage Profile & Password
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-danger/40 bg-red-50 py-2.5 text-xs font-bold text-danger hover:bg-red-100 transition-colors"
              >
                <ShieldCheck className="size-4" /> Open Admin Compliance Portal
              </Link>
            )}

            <button
              type="button"
              onClick={async () => {
                await authClient.signOut();
                window.location.reload();
              }}
              className="w-full rounded-xl border border-border py-2.5 text-xs font-semibold text-muted hover:bg-bg hover:text-danger transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Form Submits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === "signup") {
        // 1. Sign up user
        const { error } = await authClient.signUp.email({
          email: email.trim(),
          password: password,
          name: name.trim() || email.split("@")[0],
        });

        if (error) throw new Error(error.message || "Registration failed. Please check your details.");

        // 2. Dispatch 6-digit OTP code via Brevo
        try {
          await sendEmailOtp({ data: { email: email.trim(), name: name.trim() } });
        } catch {}

        setVerificationPending(true);
        setLoading(false);
      } else if (mode === "signin") {
        // Sign in user
        const { error } = await authClient.signIn.email({
          email: email.trim(),
          password: password,
        });

        if (error) throw new Error(error.message || "Invalid email or password.");

        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          if (email.trim().toLowerCase() === "admin@47sayabtak.pk") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/tools";
          }
        }, 500);
      } else if (mode === "forgot") {
        if (resetStep === 1) {
          // Send 6-digit OTP for password reset
          await sendPasswordResetOtp({ data: { email: email.trim() } });
          setResetStep(2);
          setSuccessMsg("A 6-digit password reset code has been sent to your email via Brevo.");
          setLoading(false);
        } else {
          // Verify OTP & Change Password
          if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters.");
          }
          await verifyResetOtpAndSetPassword({
            data: {
              email: email.trim(),
              otp: resetOtp.trim(),
              newPassword: newPassword,
            },
          });

          // Automatically log in with new password
          await authClient.signIn.email({
            email: email.trim(),
            password: newPassword,
          });

          setSuccessMsg("Password reset successfully! Redirecting...");
          setTimeout(() => {
            window.location.href = "/tools";
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Operation failed. Please check credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-card">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary font-display font-bold text-lg">
            47
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary">
            {verificationPending
              ? "Verify 6-Digit Code"
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Citizen Registration"
              : "Reset Password"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {verificationPending
              ? "Enter the 6-digit security code dispatched to your email via Brevo."
              : mode === "signin"
              ? "Sign in for both citizens and administrators."
              : mode === "signup"
              ? "Create your verified national citizen account."
              : "Reset your account password via Brevo 6-Digit OTP."}
          </p>
        </div>

        {/* 6-DIGIT SIGNUP OTP VERIFICATION VIEW */}
        {verificationPending ? (
          <div>
            <OtpVerification
              email={email.trim()}
              name={name.trim()}
              onSuccess={async () => {
                // Auto sign-in if password available
                if (password) {
                  await authClient.signIn.email({
                    email: email.trim(),
                    password: password,
                  });
                }
                setTimeout(() => {
                  window.location.href = "/tools";
                }, 800);
              }}
            />

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setVerificationPending(false);
                  setMode("signin");
                }}
                className="text-xs font-semibold text-muted hover:text-primary transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Switcher (Only in signin / signup mode) */}
            {mode !== "forgot" && (
              <div className="mt-6 grid grid-cols-2 rounded-2xl border border-border bg-bg p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    mode === "signin" ? "bg-primary text-surface shadow-sm" : "text-muted hover:text-primary"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    mode === "signup" ? "bg-primary text-surface shadow-sm" : "text-muted hover:text-primary"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Legal Name for Sign Up */}
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Full Legal Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3.5 top-2.5 size-4 text-muted" />
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ali Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-2.5 size-4 text-muted" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={mode === "forgot" && resetStep === 2}
                    className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password for Sign In & Sign Up */}
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Password</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setResetStep(1);
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3.5 top-2.5 size-4 text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={mode === "signup" ? "Minimum 8 characters" : "Enter your password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-border bg-bg pl-10 pr-10 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted hover:text-fg"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Step 2: 6-Digit OTP & New Password */}
              {mode === "forgot" && resetStep === 2 && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">
                      6-Digit Brevo Reset Code
                    </label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3.5 top-2.5 size-4 text-accent" />
                      <input
                        type="text"
                        placeholder="e.g. 123456"
                        maxLength={6}
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-2.5 font-mono text-sm font-bold tracking-widest text-primary outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">New Password</label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-2.5 size-4 text-muted" />
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-border bg-bg pl-10 pr-4 py-2.5 text-xs font-semibold text-fg outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}

              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-danger font-semibold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-primary font-semibold flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : mode === "signin" ? (
                  <>
                    <KeyRound className="size-4" /> Sign In
                  </>
                ) : mode === "signup" ? (
                  <>
                    <Sparkles className="size-4" /> Register & Send 6-Digit OTP
                  </>
                ) : resetStep === 1 ? (
                  <>
                    <Send className="size-4" /> Send 6-Digit Reset Code (Brevo)
                  </>
                ) : (
                  <>
                    <Lock className="size-4" /> Reset Password & Sign In
                  </>
                )}
              </button>

              {mode === "forgot" && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setResetStep(1);
                    }}
                    className="text-xs font-semibold text-muted hover:text-primary transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </form>

            {/* Brevo & Vault Security Badge */}
            <div className="mt-8 rounded-2xl border border-border bg-bg/80 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
                <ShieldCheck className="size-4 text-accent" /> Brevo 6-Digit Verified Security
              </div>
              <p className="mt-1 text-[11px] text-muted leading-relaxed">
                All transactional verification emails and password resets are dispatched securely via Brevo. Citizen documents in the vault are sealed with AES-256-GCM encryption.
              </p>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
