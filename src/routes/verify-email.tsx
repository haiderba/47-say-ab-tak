import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { OtpVerification } from "@/components/otp-input";
import { verifyEmailOtp } from "@/lib/auth/otp";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [params, setParams] = useState<{ email: string; otp: string }>({ email: "", otp: "" });
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [autoSuccess, setAutoSuccess] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email") || "";
    const otp = urlParams.get("otp") || urlParams.get("token") || "";
    setParams({ email, otp });

    // Auto verify if both email and OTP/token are in URL
    if (email && otp && otp.length === 6) {
      setAutoVerifying(true);
      verifyEmailOtp({ data: { email, otp } })
        .then(() => {
          setAutoSuccess(true);
          setAutoVerifying(false);
        })
        .catch((err) => {
          setAutoError(err.message || "Invalid or expired verification code.");
          setAutoVerifying(false);
        });
    }
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-3xl border border-border bg-surface p-8 shadow-card text-center">
        {/* Header */}
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Mail className="size-7" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-primary">
          Citizen Email Verification
        </h1>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          Verify your official email address using your 6-digit security code dispatched via Brevo.
        </p>

        {/* Auto verification state */}
        {autoVerifying && (
          <div className="mt-8 py-4">
            <RefreshCw className="mx-auto size-8 text-primary animate-spin" />
            <p className="mt-3 text-xs font-semibold text-primary">Verifying 6-digit code with Brevo...</p>
          </div>
        )}

        {autoSuccess && (
          <div className="mt-8 py-4">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-primary">
              Account Verified Successfully!
            </h3>
            <p className="mt-1 text-xs text-muted">
              Your AES-256 encrypted vault is now unlocked and active.
            </p>
            <div className="mt-6">
              <Link
                to="/tools"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-md"
              >
                Go to Encrypted Document Vault <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Manual OTP Form */}
        {!autoVerifying && !autoSuccess && (
          <div className="mt-6">
            {autoError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-danger font-semibold flex items-center justify-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{autoError}</span>
              </div>
            )}

            <OtpVerification
              email={params.email || "your-email@domain.com"}
              onSuccess={() => {
                window.location.href = "/tools";
              }}
            />

            <div className="mt-6 border-t border-border pt-4 text-center">
              <Link to="/login" className="text-xs font-semibold text-muted hover:text-primary transition-colors">
                ← Back to Citizen Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
