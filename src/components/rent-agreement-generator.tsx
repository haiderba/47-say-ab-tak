import { useState } from "react";
import { Scale, Copy } from "lucide-react";

export function RentAgreementGenerator() {
  const [landlordName, setLandlordName] = useState("Muhammad Tariq");
  const [landlordCnic, setLandlordCnic] = useState("35201-1234567-1");
  const [tenantName, setTenantName] = useState("Zahid Hussain");
  const [tenantCnic, setTenantCnic] = useState("35202-7654321-3");
  const [propertyAddress, setPropertyAddress] = useState("House No. 142, Block B, Model Town, Lahore");
  const [monthlyRent, setMonthlyRent] = useState(65000);
  const [securityDeposit, setSecurityDeposit] = useState(130000);
  const [copied, setCopied] = useState(false);

  const deedText = `RESIDENTIAL TENANCY AGREEMENT (کرایہ نامہ برائے رہائش)
Under Punjab Rented Premises Act 2009

Executed on: ${new Date().toLocaleDateString('en-GB')}
LANDLORD: ${landlordName} (CNIC: ${landlordCnic})
TENANT: ${tenantName} (CNIC: ${tenantCnic})
PREMISES: ${propertyAddress}

TERMS:
1. Monthly Rent: PKR ${monthlyRent.toLocaleString()}/- in advance by 5th of each month.
2. Security Deposit: PKR ${securityDeposit.toLocaleString()}/- (Refundable).
3. Police Tenant Registration: Mandatory within 15 days of occupancy.

Landlord Signature: __________________   Tenant Signature: __________________`;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Scale className="size-3.5" /> Legal Deed Drafter for E-Stamp Paper
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Residential Tenancy Agreement (کرایہ نامہ)
          </h2>
          <p className="mt-1 text-xs text-muted">
            Compliant with Punjab Rented Premises Act 2009 & Police Tenant Registration laws.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(deedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light"
        >
          <Copy className="size-4" /> {copied ? "Copied!" : "Copy Rent Agreement"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Landlord Name</label>
          <input
            type="text"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Tenant Name</label>
          <input
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Monthly Rent</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Security Deposit</label>
          <input
            type="number"
            value={securityDeposit}
            onChange={(e) => setSecurityDeposit(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
      </div>

      <pre className="rounded-xl border border-border bg-surface p-5 text-xs font-mono leading-relaxed text-fg overflow-x-auto whitespace-pre-wrap">
        {deedText}
      </pre>
    </div>
  );
}
