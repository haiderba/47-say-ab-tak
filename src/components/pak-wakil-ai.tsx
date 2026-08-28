import { useState } from "react";
import { Bot, Send, Sparkles, User, CheckCircle2 } from "lucide-react";

export function PakWakilAi() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "اسلام علیکم! I am PakWakil (پاک وکیل), your AI Civic & Legal Procedure Assistant. Ask me anything about Pakistani government documents, NADRA CNIC renewal, Land mutation (انتقال جائیداد), DLIMS licenses, or Court procedures!",
    },
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    const userQ = query;
    setQuery("");

    let reply = "Under Pakistani administrative procedures, you need your original CNIC and certified copies. Please verify at the official counter or check our step-by-step guides!";
    if (userQ.toLowerCase().includes("nadra") || userQ.includes("شناختی کارڈ")) {
      reply = "NADRA CNIC renewal can be done 100% online via the Pak-ID app or at any 24/7 Executive Mega Center. Urgent processing takes 9 working days (Fee: Rs 1,500), Executive takes 7 days (Fee: Rs 2,500).";
    } else if (userQ.toLowerCase().includes("property") || userQ.includes("جائیداد") || userQ.includes("انتقال") || userQ.includes("land")) {
      reply = "Property transfer in Punjab/Sindh requires E-Stamping Challan 32-A, FBR Active Taxpayer ATL verification (Section 236K/236C), Fard Bayan from Arazi Record Center (PLRA), and Sub-Registrar biometric endorsement.";
    } else if (userQ.toLowerCase().includes("license") || userQ.includes("ڈرائیونگ لائسنس")) {
      reply = "Driving license renewal via DLIMS requires medical fitness form, 17-digit PSID payment via e-Pay Punjab, and verification at any Police Khidmat Markaz (PKM).";
    } else if (userQ.toLowerCase().includes("passport") || userQ.includes("پاسپورٹ")) {
      reply = "Passport renewal can be tracked online via DGIP Online MRP portal. Executive Passports take 4 working days, Urgent 10 days, Normal 21 days.";
    } else if (userQ.toLowerCase().includes("tax") || userQ.includes("ٹیکس") || userQ.includes("fbr")) {
      reply = "FBR Active Taxpayer Status (ATL) can be verified by sending 'ATL <CNIC>' to 9966. Active filers save up to 66% on property and vehicle advance withholding taxes.";
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQ },
      { sender: "bot", text: reply },
    ]);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="grid size-10 place-items-center rounded-2xl bg-primary font-bold text-accent shadow-sm">
          <Bot className="size-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-black text-primary">PakWakil (پاک وکیل) AI Assistant</h2>
          <p className="text-xs text-muted">Trained on Pakistani Law, NADRA Ordinance, PLRA, and Government Manuals.</p>
        </div>
      </div>

      <div className="h-72 overflow-y-auto space-y-3 rounded-2xl border border-border bg-bg/50 p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            {m.sender === "bot" && <div className="grid size-7 place-items-center rounded-lg bg-primary text-accent shrink-0 text-xs"><Bot className="size-3.5" /></div>}
            <div className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${m.sender === "user" ? "bg-primary text-surface font-medium" : "bg-surface border border-border text-fg shadow-xs"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a legal question (e.g. 'How to transfer plot in Lahore?', 'شناختی کارڈ گم ہو جائے تو کیا کریں؟')..."
          className="flex-1 rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-medium text-fg outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded-2xl bg-primary px-5 py-3 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
