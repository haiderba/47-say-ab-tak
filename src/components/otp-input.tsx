import { useState, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw, Send, ShieldCheck, ArrowRight } from "lucide-react";
import { verifyEmailOtp, sendEmailOtp } from "@/lib/auth/otp";

interface OtpVerificationProps {
  email: string;
  name?: string;
  onSuccess?: () => void;
}

export function OtpVerification({ email, name, onSuccess }: OtpVerificationProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit change
  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    if (!clean) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    // Handle typing multiple digits or single digit
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      chars.forEach((c, i) => {
        if (index + i < 6) nextDigits[index + i] = c;
      });
      setDigits(nextDigits);
      const nextFocus = Math.min(5, index + chars.length);
      inputsRef.current[nextFocus]?.focus();
    } else {
      nextDigits[index] = clean[0];
      setDigits(nextDigits);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const chars = pasted.split("");
      setDigits(chars);
      inputsRef.current[5]?.focus();
    }
  };

  // Submit OTP for verification
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setErrorMsg("Please enter all 6 digits of the code sent to your email.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await verifyEmailOtp({ data: { email, otp } });
      if (res.success) {
        setIsVerified(true);
        setSuccessMsg("Email verified successfully! Activating your Encrypted Vault...");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          else window.location.href = "/tools";
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP via Brevo
  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setErrorMsg(null);
    try {
      await sendEmailOtp({ data: { email, name } });
      setCountdown(60);
      setSuccessMsg("A new 6-digit code has been dispatched via Brevo.");
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend code. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 animate-pulse">
          <CheckCircle2 className="size-10" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-primary">
          Email Verified Successfully!
        </h3>
        <p className="mt-1 text-xs text-muted">
          Your citizen account is verified. Entering Encrypted Document Vault...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      {/* Recipient Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
        <ShieldCheck className="size-3.5 text-accent" />
        <span>Code sent to: <strong className="font-mono text-fg">{email}</strong></span>
      </div>

      <p className="mt-3 text-xs text-muted leading-relaxed">
        Enter the <strong>6-digit verification code</strong> delivered to your email inbox via Brevo:
      </p>

      {/* 6 Digit Input Boxes */}
      <form onSubmit={handleVerify} className="mt-5">
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              autoFocus={i === 0}
              className="size-11 sm:size-12 rounded-xl border-2 border-border bg-bg text-center font-mono text-xl sm:text-2xl font-bold text-primary outline-none transition-all focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          ))}
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-danger font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-primary font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Verification Button */}
        <button
          type="submit"
          disabled={loading || digits.join("").length < 6}
          className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-md disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="size-4 animate-spin" /> Verifying Code...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" /> Verify 6-Digit Code
            </>
          )}
        </button>
      </form>

      {/* Resend Action */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted border-t border-border/80 pt-4">
        <span>Didn't receive code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resending}
          className="font-bold text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
        >
          {resending ? (
            "Sending..."
          ) : countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <>
              <Send className="size-3" /> Resend Code (Brevo)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
