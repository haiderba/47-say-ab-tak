import { useState } from "react";
import { Building2, Search, ShieldCheck, AlertTriangle, ExternalLink, Printer } from "lucide-react";

export function SecpCompanyVerifier() {
  const [companyName, setCompanyName] = useState("Habib Bank Limited");

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-600">
            <Building2 className="size-3.5" /> SECP eServices Corporate Registry
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            SECP Corporate Registry & Company Fraud Detector
          </h2>
          <p className="mt-1 text-xs text-muted">
            Verify whether builders, overseas recruiting agencies, investment schemes, or private companies are officially registered with SECP.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
        >
          <Printer className="size-4" /> Print B&W Record
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
            Company / Entity Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Premier Developers (Pvt) Ltd"
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3 text-xs font-bold text-fg outline-none focus:border-primary"
          />
        </div>

        <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-xs">Official SECP Company Search Portal</span>
            <a
              href="https://eservices.secp.gov.pk/eServices/NameSearchAction.do"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light shadow-xs"
            >
              Search on SECP Database <ExternalLink className="size-3.5" />
            </a>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Never invest in unauthorized multi-level marketing (MLM), illegal cryptocurrency/forex apps, or unapproved housing societies not holding a registered SECP incorporation certificate.
          </p>
        </div>
      </div>
    </div>
  );
}
