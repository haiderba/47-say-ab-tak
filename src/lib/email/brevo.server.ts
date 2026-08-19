/**
 * Brevo (Sendinblue) Transactional Email Service for 47 Say Ab Tak.
 * Supports both 6-Digit Numeric OTP and 1-Click Verification URLs.
 */

export interface SendVerificationEmailParams {
  toEmail: string;
  toName: string;
  otpCode?: string;
  verifyUrl?: string;
  token?: string;
}

export async function sendBrevoVerificationEmail({
  toEmail,
  toName,
  otpCode,
  verifyUrl,
}: SendVerificationEmailParams): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.SENDINBLUE_API_KEY ||
    "";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "uhaider695@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "47 Say Ab Tak — Citizen Portal";

  const code = otpCode || "472026";
  const digits = code.split("");
  const fallbackUrl = verifyUrl || "http://localhost:8080/verify-email?email=" + encodeURIComponent(toEmail) + "&otp=" + code;

  const digitCells = digits
    .map(
      (d) =>
        "<td style=\"background-color:#01411c;color:#c9a227;font-size:28px;font-weight:900;font-family:monospace;width:44px;height:52px;text-align:center;border-radius:10px;\">" +
        d +
        "</td>"
    )
    .join("");

  const emailHtml =
    "<!DOCTYPE html>" +
    "<html>" +
    "<head><meta charset=\"utf-8\"><title>47 Say Ab Tak Verification Code</title></head>" +
    "<body style=\"margin:0;padding:0;background-color:#f0f4f1;font-family:Arial,sans-serif;color:#14281d;\">" +
    "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f0f4f1;padding:40px 12px;\">" +
    "    <tr><td align=\"center\">" +
    "      <table width=\"100%\" style=\"max-width:580px;background-color:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #d5e2d8;\">" +
    "        <tr><td style=\"background:#01411c;padding:36px 30px;text-align:center;\">" +
    "          <div style=\"display:inline-block;background-color:#c9a227;color:#01411c;font-weight:bold;font-size:14px;padding:6px 18px;border-radius:50px;letter-spacing:1px;\">47 SY AB TAK</div>" +
    "          <h1 style=\"color:#ffffff;margin:16px 0 0 0;font-size:24px;font-weight:800;\">Citizen Verification Code</h1>" +
    "          <p style=\"color:#d5e2d8;margin:6px 0 0 0;font-size:13px;\">Pakistan Citizen Documentation &amp; Governance Portal</p>" +
    "        </td></tr>" +
    "        <tr><td style=\"padding:36px 32px;\">" +
    "          <p style=\"font-size:16px;margin:0 0 14px 0;color:#01411c;font-weight:bold;\">Assalam-o-Alaikum, " +
    (toName || "Citizen") +
    "!</p>" +
    "          <p style=\"font-size:14px;line-height:1.6;color:#3e5647;margin:0 0 24px 0;\">Thank you for creating your account. Enter this <strong>6-digit verification code</strong> on the portal to activate your AES-256 Encrypted Document Vault.</p>" +
    "          <table width=\"100%\" style=\"margin:24px 0;\">" +
    "            <tr><td align=\"center\">" +
    "              <div style=\"background:#f7faf8;border:2px dashed #01411c;border-radius:16px;padding:20px;display:inline-block;text-align:center;\">" +
    "                <div style=\"font-size:11px;font-weight:bold;color:#01411c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;\">Your 6-Digit Verification Code</div>" +
    "                <table cellspacing=\"6\" cellpadding=\"0\" style=\"margin:0 auto;\"><tr>" +
    digitCells +
    "</tr></table>" +
    "                <div style=\"margin-top:12px;font-size:12px;color:#6b8273;font-weight:bold;\">⏱️ Valid for 15 minutes • Single use only</div>" +
    "              </div>" +
    "            </td></tr>" +
    "          </table>" +
    "          <table width=\"100%\" style=\"margin:20px 0;\">" +
    "            <tr><td align=\"center\">" +
    "              <a href=\"" +
    fallbackUrl +
    "\" target=\"_blank\" style=\"background:#01411c;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 34px;border-radius:50px;display:inline-block;\">✓ Or Click Here to Verify Instantly</a>" +
    "            </td></tr>" +
    "          </table>" +
    "          <div style=\"background-color:#f8faf8;border-radius:12px;padding:14px;border:1px solid #e1ebe3;margin-top:16px;\">" +
    "            <p style=\"font-size:11px;color:#6b8273;margin:0 0 6px 0;font-weight:bold;\">Alternative direct link:</p>" +
    "            <a href=\"" +
    fallbackUrl +
    "\" style=\"font-size:11px;color:#01411c;word-break:break-all;\">" +
    fallbackUrl +
    "</a>" +
    "          </div>" +
    "          <p style=\"font-size:11px;color:#889e90;margin-top:20px;line-height:1.5;\">🔒 Never share this 6-digit code with anyone. 47 Say Ab Tak will never ask for your code over the phone or SMS.</p>" +
    "        </td></tr>" +
    "        <tr><td style=\"background-color:#f8faf8;padding:18px 30px;text-align:center;border-top:1px solid #e1ebe3;\">" +
    "          <p style=\"font-size:11px;color:#6b8273;margin:0;\">© 2026 <strong>47 Say Ab Tak</strong> — Sent securely via Brevo Transactional Infrastructure.</p>" +
    "        </td></tr>" +
    "      </table>" +
    "    </td></tr>" +
    "  </table>" +
    "</body>" +
    "</html>";

  if (apiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],
          subject: code + " is your 47 Say Ab Tak Verification Code",
          htmlContent: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Brevo] API Error:", errorData);
      } else {
        const result = await response.json();
        console.log("[Brevo] 6-digit OTP (" + code + ") dispatched to " + toEmail + " (MessageId: " + result.messageId + ")");
        return { success: true, messageId: result.messageId };
      }
    } catch (err) {
      console.error("[Brevo] Failed to send email via API:", err);
    }
  }

  console.log("\n══════════════════════════════════════════════════════════════════════");
  console.log("[Brevo 6-Digit OTP Simulation]");
  console.log("To: " + toName + " <" + toEmail + ">");
  console.log("🔑 6-Digit OTP Code: " + code);
  console.log("🔗 Direct URL: " + fallbackUrl);
  console.log("══════════════════════════════════════════════════════════════════════\n");

  return { success: true, simulated: true };
}

export async function sendBrevoPasswordResetEmail({
  toEmail,
  toName,
  otpCode,
}: {
  toEmail: string;
  toName: string;
  otpCode: string;
}): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const apiKey =
    process.env.BREVO_API_KEY ||
    process.env.SENDINBLUE_API_KEY ||
    "";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "uhaider695@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "47 Say Ab Tak — Citizen Portal";

  const digits = otpCode.split("");
  const digitCells = digits
    .map(
      (d) =>
        "<td style=\"background-color:#01411c;color:#c9a227;font-size:28px;font-weight:900;font-family:monospace;width:44px;height:52px;text-align:center;border-radius:10px;\">" +
        d +
        "</td>"
    )
    .join("");

  const emailHtml =
    "<!DOCTYPE html>" +
    "<html>" +
    "<head><meta charset=\"utf-8\"><title>Reset Your 47 Say Ab Tak Password</title></head>" +
    "<body style=\"margin:0;padding:0;background-color:#f0f4f1;font-family:Arial,sans-serif;color:#14281d;\">" +
    "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0 style=\"background-color:#f0f4f1;padding:40px 12px;\">" +
    "    <tr><td align=\"center\">" +
    "      <table width=\"100%\" style=\"max-width:580px;background-color:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #d5e2d8;\">" +
    "        <tr><td style=\"background:#01411c;padding:36px 30px;text-align:center;\">" +
    "          <div style=\"display:inline-block;background-color:#c9a227;color:#01411c;font-weight:bold;font-size:14px;padding:6px 18px;border-radius:50px;letter-spacing:1px;\">47 SY AB TAK</div>" +
    "          <h1 style=\"color:#ffffff;margin:16px 0 0 0;font-size:24px;font-weight:800;\">Password Reset Code</h1>" +
    "          <p style=\"color:#d5e2d8;margin:6px 0 0 0;font-size:13px;\">Citizen Security &amp; Account Recovery</p>" +
    "        </td></tr>" +
    "        <tr><td style=\"padding:36px 32px;\">" +
    "          <p style=\"font-size:16px;margin:0 0 14px 0;color:#01411c;font-weight:bold;\">Assalam-o-Alaikum, " +
    (toName || "Citizen") +
    "!</p>" +
    "          <p style=\"font-size:14px;line-height:1.6;color:#3e5647;margin:0 0 24px 0;\">We received a request to reset the password for your <strong>47 Say Ab Tak</strong> account. Enter the following <strong>6-digit security code</strong> to proceed:</p>" +
    "          <table width=\"100%\" style=\"margin:24px 0;\">" +
    "            <tr><td align=\"center\">" +
    "              <div style=\"background:#f7faf8;border:2px dashed #01411c;border-radius:16px;padding:20px;display:inline-block;text-align:center;\">" +
    "                <div style=\"font-size:11px;font-weight:bold;color:#01411c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;\">Password Reset Code</div>" +
    "                <table cellspacing=\"6\" cellpadding=\"0\" style=\"margin:0 auto;\"><tr>" +
    digitCells +
    "</tr></table>" +
    "                <div style=\"margin-top:12px;font-size:12px;color:#6b8273;font-weight:bold;\">⏱️ Valid for 15 minutes • Single use only</div>" +
    "              </div>" +
    "            </td></tr>" +
    "          </table>" +
    "          <p style=\"font-size:11px;color:#889e90;margin-top:20px;line-height:1.5;\">🔒 If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>" +
    "        </td></tr>" +
    "        <tr><td style=\"background-color:#f8faf8;padding:18px 30px;text-align:center;border-top:1px solid #e1ebe3;\">" +
    "          <p style=\"font-size:11px;color:#6b8273;margin:0;\">© 2026 <strong>47 Say Ab Tak</strong> — Sent securely via Brevo Transactional Infrastructure.</p>" +
    "        </td></tr>" +
    "      </table>" +
    "    </td></tr>" +
    "  </table>" +
    "</body>" +
    "</html>";

  if (apiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],
          subject: otpCode + " is your 47 Say Ab Tak Password Reset Code",
          htmlContent: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Brevo] API Error:", errorData);
      } else {
        const result = await response.json();
        console.log("[Brevo] Password Reset OTP (" + otpCode + ") dispatched to " + toEmail + " (MessageId: " + result.messageId + ")");
        return { success: true, messageId: result.messageId };
      }
    } catch (err) {
      console.error("[Brevo] Failed to send reset email:", err);
    }
  }

  console.log("\n══════════════════════════════════════════════════════════════════════");
  console.log("[Brevo Password Reset Simulation]");
  console.log("To: " + toName + " <" + toEmail + ">");
  console.log("🔑 6-Digit Reset Code: " + otpCode);
  console.log("══════════════════════════════════════════════════════════════════════\n");

  return { success: true, simulated: true };
}
