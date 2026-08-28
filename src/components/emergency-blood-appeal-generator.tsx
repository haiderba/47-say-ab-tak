import { useState } from "react";
import { HeartHandshake, Copy } from "lucide-react";

export function EmergencyBloodAppealGenerator() {
  const [name, setName] = useState("Syed Arham Ali");
  const [blood, setBlood] = useState("O-");
  const [copied, setCopied] = useState(false);

  const text = `🚨 URGENT BLOOD APPEAL: ${blood} needed for ${name}. Rescue 1122 / Edhi 115.`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-black text-rose-600">Urgent Blood Appeal Generator</h2>
        <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-rose-600 text-white rounded-xl px-4 py-2 text-xs font-bold">
          {copied ? "Copied!" : "Copy for WhatsApp"}
        </button>
      </div>
    </div>
  );
}
