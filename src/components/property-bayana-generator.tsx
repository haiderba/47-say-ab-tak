import { useState } from "react";
import { Building, Copy } from "lucide-react";

export function PropertyBayanaGenerator() {
  const [sellerName, setSellerName] = useState("Chaudhry Riaz Ahmad");
  const [buyerName, setBuyerName] = useState("Sheikh Kamran");
  const [plotNumber, setPlotNumber] = useState("Plot 418, Sector F, DHA Phase 6, Lahore");
  const [totalPrice, setTotalPrice] = useState(38000000);
  const [bayanaPaid, setBayanaPaid] = useState(4000000);
  const [copied, setCopied] = useState(false);

  const text = `PROPERTY BAYANA AGREEMENT (بیعانہ اقرار نامہ)
Seller: ${sellerName}   Buyer: ${buyerName}
Property: ${plotNumber}
Agreed Price: PKR ${totalPrice.toLocaleString()}/-   Bayana Paid: PKR ${bayanaPaid.toLocaleString()}/-

Seller Signature: __________________   Buyer Signature: __________________`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-black text-primary">Property Bayana / Token Agreement (بیعانہ)</h2>
          <p className="mt-1 text-xs text-muted">Legal advance token money receipt with forfeiture terms.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light"
        >
          <Copy className="size-4" /> {copied ? "Copied!" : "Copy Bayana"}
        </button>
      </div>

      <pre className="rounded-xl border border-border bg-surface p-5 text-xs font-mono leading-relaxed text-fg overflow-x-auto whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
