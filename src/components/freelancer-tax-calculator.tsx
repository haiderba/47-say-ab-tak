import { useState } from "react";
import { Laptop, FileText, Copy } from "lucide-react";
import { LIVE_RATES } from "@/lib/live-rates";

export function FreelancerTaxCalculator() {
  const [usdAmount, setUsdAmount] = useState<number>(2500);
  const [isPsebRegistered, setIsPsebRegistered] = useState<boolean>(true);
  const [clientName, setClientName] = useState<string>("Acme Global Inc.");
  const [serviceDesc, setServiceDesc] = useState<string>("Full Stack Software Engineering");
  const [invoiceCopied, setInvoiceCopied] = useState(false);

  const exchangeRate = LIVE_RATES.currency.usd;
  const pkrGross = usdAmount * exchangeRate;
  const taxRatePct = isPsebRegistered ? 0.25 : 1.0;
  const taxDeductionPkr = (pkrGross * taxRatePct) / 100;
  const netTakeHomePkr = pkrGross - taxDeductionPkr;

  const invoiceText = `COMMERCIAL INVOICE / EXPORT OF IT SERVICES
Invoice No: INV-${Date.now().toString().slice(-6)}
Date: ${new Date().toLocaleDateString('en-GB')}
Service Exporter: Verified Pakistani Freelancer
FBR NTN Status: Registered Active Taxpayer (ATL)

BILLED TO:
Client: ${clientName}
Service: ${serviceDesc}

PAYMENT TERMS:
Gross Amount: $${usdAmount.toLocaleString()} USD
Conversion Rate: Rs ${exchangeRate} PKR
Gross Equivalent: PKR ${pkrGross.toLocaleString()}
FBR Section 154A WHT (${taxRatePct}%): PKR ${taxDeductionPkr.toLocaleString()}
Net Remittance Expected: PKR ${netTakeHomePkr.toLocaleString()}

Purpose Code: 9182 / 9184 (Software Consultancy / IT Enabled Services)`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Laptop className="size-3.5" /> FBR Section 154A & PSEB 0.25% IT Export Regime
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Freelancer & IT Exporter Tax Suite
          </h2>
          <p className="mt-1 text-xs text-muted">
            Calculate exact FBR Section 154A final tax deductions and generate international export invoices for foreign clients.
          </p>
        </div>
        <div className="rounded-2xl bg-bg p-3 border border-border text-right">
          <span className="block text-[10px] font-bold uppercase text-muted">Effective Tax Rate</span>
          <span className="font-mono text-2xl font-extrabold text-blue-600">{taxRatePct}% Final Tax</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Monthly Foreign Remittance ($ USD)
          </label>
          <input
            type="number"
            min={100}
            max={100000}
            step={100}
            value={usdAmount}
            onChange={(e) => setUsdAmount(Math.max(10, Number(e.target.value)))}
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm font-bold text-fg outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            PSEB Registration Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPsebRegistered(true)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (isPsebRegistered ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              PSEB (0.25% Tax)
            </button>
            <button
              type="button"
              onClick={() => setIsPsebRegistered(false)}
              className={"rounded-xl p-2.5 text-left border text-xs font-bold transition-all " + (!isPsebRegistered ? "bg-primary text-surface border-primary" : "bg-bg text-muted border-border")}
            >
              Non-PSEB (1.0% Tax)
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Gross Income in PKR</span>
          <div className="mt-2 font-mono text-2xl font-black text-blue-900">Rs {Math.round(pkrGross).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">FBR 154A WHT</span>
          <div className="mt-2 font-mono text-2xl font-black text-rose-900">Rs {Math.round(taxDeductionPkr).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Net Take-Home PKR</span>
          <div className="mt-2 font-mono text-2xl font-black text-emerald-900">Rs {Math.round(netTakeHomePkr).toLocaleString()}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-xs font-black uppercase tracking-wider text-primary">
            Export Commercial Invoice Drafter
          </h4>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(invoiceText);
              setInvoiceCopied(true);
              setTimeout(() => setInvoiceCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-surface hover:bg-primary-light"
          >
            <Copy className="size-3.5" /> {invoiceCopied ? "Copied!" : "Copy Invoice"}
          </button>
        </div>
        <pre className="rounded-xl border border-border bg-surface p-4 text-[11px] font-mono leading-relaxed text-fg overflow-x-auto whitespace-pre-wrap">
          {invoiceText}
        </pre>
      </div>
    </div>
  );
}
