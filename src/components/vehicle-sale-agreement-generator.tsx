import { useState } from "react";
import { Car, Copy } from "lucide-react";

export function VehicleSaleAgreementGenerator() {
  const [sellerName, setSellerName] = useState("Farhan Ahmed");
  const [buyerName, setBuyerName] = useState("Usman Ali");
  const [vehicleRegNo, setVehicleRegNo] = useState("LEA-22-4591");
  const [vehicleMakeModel, setVehicleMakeModel] = useState("Honda Civic Oriel 2022");
  const [totalPrice, setTotalPrice] = useState(6200000);
  const [copied, setCopied] = useState(false);

  const text = `VEHICLE SALE & DELIVERY RECEIPT (اقرار نامہ بیع گاڑی)
Seller: ${sellerName}   Buyer: ${buyerName}
Vehicle: ${vehicleMakeModel} (Reg: ${vehicleRegNo})
Total Price: PKR ${totalPrice.toLocaleString()}/-

INDEMNITY: The Buyer assumes full civil & criminal responsibility from delivery date.

Seller Signature: __________________   Buyer Signature: __________________`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-black text-primary">Vehicle Sale Agreement (اقرار نامہ بیع گاڑی)</h2>
          <p className="mt-1 text-xs text-muted">Legal indemnity receipt protecting seller prior to biometric transfer.</p>
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
          <Copy className="size-4" /> {copied ? "Copied!" : "Copy Receipt"}
        </button>
      </div>

      <pre className="rounded-xl border border-border bg-surface p-5 text-xs font-mono leading-relaxed text-fg overflow-x-auto whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
