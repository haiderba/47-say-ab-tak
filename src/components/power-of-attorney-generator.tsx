import { useState } from "react";
import { Scale, FileText, Printer, Copy, Check, ShieldCheck, Download, AlertCircle, Eye, CheckCircle2 } from "lucide-react";

type PoaType = "general" | "property_sale" | "court" | "vehicle" | "overseas";

export function PowerOfAttorneyGenerator() {
  const [poaType, setPoaType] = useState<PoaType>("general");

  // Principal (Mokhtar-Dehinda / دہندہ)
  const [principalName, setPrincipalName] = useState("");
  const [principalFather, setPrincipalFather] = useState("");
  const [principalCnic, setPrincipalCnic] = useState("");
  const [principalAddress, setPrincipalAddress] = useState("");
  const [principalCountry, setPrincipalCountry] = useState("Pakistan");

  // Attorney (Mokhtar-Khas / خاص)
  const [attorneyName, setAttorneyName] = useState("");
  const [attorneyFather, setAttorneyFather] = useState("");
  const [attorneyCnic, setAttorneyCnic] = useState("");
  const [attorneyAddress, setAttorneyAddress] = useState("");
  const [attorneyRelation, setAttorneyRelation] = useState("Real Brother / Trusted Kin");

  // Property / Vehicle Particulars
  const [propertyDesc, setPropertyDesc] = useState("House No. 12, Street 4, Block B, DHA Phase 5, Lahore (Total Area 1 Kanal)");
  const [vehicleReg, setVehicleReg] = useState("LEA-2024-5678 (Toyota Corolla, Engine: 1NZ-123456)");

  // Witnesses
  const [witness1, setWitness1] = useState("");
  const [witness1Cnic, setWitness1Cnic] = useState("");
  const [witness2, setWitness2] = useState("");
  const [witness2Cnic, setWitness2Cnic] = useState("");

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const getPoaTitle = () => {
    switch (poaType) {
      case "general": return "GENERAL POWER OF ATTORNEY (مختار نامہ عام)";
      case "property_sale": return "SPECIAL POWER OF ATTORNEY FOR SALE OF IMMOVABLE PROPERTY (مختار نامہ خاص برائے بیع جائیداد)";
      case "court": return "SPECIAL POWER OF ATTORNEY FOR COURT LITIGATION (مختار نامہ خاص برائے پیروی مقدمات)";
      case "vehicle": return "SPECIAL POWER OF ATTORNEY FOR MOTOR VEHICLE TRANSFER (مختار نامہ خاص برائے گاڑی)";
      case "overseas": return "SPECIAL POWER OF ATTORNEY FOR OVERSEAS PAKISTANI (قونصل خانہ / فارن آفس اٹیسٹیشن)";
    }
  };

  const generateLegalText = () => {
    const pName = principalName || "[PRINCIPAL FULL NAME]";
    const pFather = principalFather || "[FATHER / HUSBAND NAME]";
    const pCnic = principalCnic || "[CNIC / NICOP / PASSPORT]";
    const pAddr = principalAddress || "[RESIDENTIAL ADDRESS]";

    const aName = attorneyName || "[ATTORNEY FULL NAME]";
    const aFather = attorneyFather || "[ATTORNEY FATHER NAME]";
    const aCnic = attorneyCnic || "[ATTORNEY CNIC]";
    const aAddr = attorneyAddress || "[ATTORNEY ADDRESS]";

    let specificClauses = "";
    if (poaType === "general") {
      specificClauses = `
1. To manage, superintend, and administer all my properties, businesses, bank accounts, and legal matters throughout Pakistan.
2. To sign, execute, and deliver all contracts, agreements, sale deeds, lease deeds, rent agreements, and receipts.
3. To appear and act in all Government departments including NADRA, PLRA, CDA, LDA, KDA, FBR, Excise & Taxation, and Municipal Corporations.
4. To institute, prosecute, defend, compromise, or withdraw all legal proceedings, suits, appeals, and petitions in all Courts of Law.`;
    } else if (poaType === "property_sale") {
      specificClauses = `
1. To negotiate, finalize the sale, receive consideration amounts, and issue valid receipts for my immovable property described as: "${propertyDesc}".
2. To execute, sign, and present before the Sub-Registrar / Joint Sub-Registrar the registered Sale Deed (بک بیعنامہ), Mutation (انتقال), and E-Stamp Paper.
3. To obtain No Objection Certificates (NOC), Fard Malkiat, Tax clearance certificates, and transfer orders from relevant authorities (LDA/DHA/CDA/PLRA).`;
    } else if (poaType === "court") {
      specificClauses = `
1. To represent me, file plaints, written statements, appeals, revisions, and execution petitions in all Courts of Law (Civil, Sessions, High Court, and Supreme Court of Pakistan).
2. To engage legal counsels (Advocates), sign Vakalatnamas, record statements, deposit and withdraw court fees and decretal amounts.
3. To compromise, enter into arbitration, or refer disputes to mediation on my behalf.`;
    } else if (poaType === "vehicle") {
      specificClauses = `
1. To manage, sell, and transfer ownership of my motor vehicle: "${vehicleReg}".
2. To appear before the Motor Registering Authority / Excise & Taxation Department, submit transfer documents, and complete biometric verification (E-Pay / DLIMS).
3. To receive the full sale consideration and deliver physical possession of the vehicle.`;
    } else {
      specificClauses = `
1. To act on my behalf while I am residing overseas in ${principalCountry}, to manage my inherited properties, legal files, and governmental document renewals in Pakistan.
2. This Power of Attorney is specifically prepared for authentication by the Embassy / High Commission / Consulate General of Pakistan and subsequent counter-attestation by the Ministry of Foreign Affairs (MOFA), Islamabad.`;
    }

    return `
========================================================================
${getPoaTitle()}
========================================================================

KNOW ALL MEN BY THESE PRESENTS, that I, ${pName}, S/O ${pFather}, holding CNIC / Passport No. ${pCnic}, resident of ${pAddr} (hereinafter called the "PRINCIPAL"),

DO HEREBY NOMINATE, CONSTITUTE, AND APPOINT:

Mr./Ms. ${aName}, S/O ${aFather}, holding CNIC No. ${aCnic}, resident of ${aAddr}, my (${attorneyRelation}) (hereinafter called the "ATTORNEY"),

as my true and lawful Attorney in my name and on my behalf to perform and execute all or any of the following acts, deeds, and things:

${specificClauses}

AND I hereby agree and undertake to ratify and confirm whatsoever my said Attorney shall lawfully do or cause to be done in the premises by virtue of these presents.

IN WITNESS WHEREOF, I have hereunto signed and executed this Power of Attorney on this _____ day of _______________, 2026.


______________________________
EXECUTANT / PRINCIPAL SIGNATURE
Name: ${pName}
CNIC: ${pCnic}


WITNESS 1:
Signature: ___________________
Name: ${witness1 || "___________________"}
CNIC: ${witness1Cnic || "___________________"}

WITNESS 2:
Signature: ___________________
Name: ${witness2 || "___________________"}
CNIC: ${witness2Cnic || "___________________"}
========================================================================`;
  };

  const copyToClipboard = () => {
    if (!principalName || !attorneyName) {
      setValidationError("Please fill in Principal Name and Attorney Name before copying.");
      return;
    }
    setValidationError(null);
    navigator.clipboard.writeText(generateLegalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const printDocument = () => {
    if (!principalName || !attorneyName) {
      setValidationError("Please fill in Principal Name and Attorney Name before printing.");
      return;
    }
    setValidationError(null);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`<pre style="font-family: monospace; white-space: pre-wrap; font-size: 13px; line-height: 1.6; padding: 30px;">${generateLegalText()}</pre>`);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  return (
    <div className="space-y-8 rounded-3xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Scale className="size-3.5" /> E-Stamp Judicial & Non-Judicial Drafter
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-primary">
            Power of Attorney (مختار نامہ) Generator
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Generate formal legal text for General & Special Power of Attorney for property registry, court litigation, and MOFA consular attestation.
          </p>
        </div>

        {/* Type Selector */}
        <select
          value={poaType}
          onChange={(e) => setPoaType(e.target.value as any)}
          className="rounded-2xl border-2 border-primary/30 bg-surface px-4 py-2.5 text-xs font-bold text-primary outline-none focus:border-primary shrink-0"
        >
          <option value="general">General POA (مختار نامہ عام)</option>
          <option value="property_sale">Special POA - Property Sale (بیع جائیداد)</option>
          <option value="court">Special POA - Court Litigation (مقدمات)</option>
          <option value="vehicle">Special POA - Vehicle Transfer (گاڑی)</option>
          <option value="overseas">Overseas Pakistani (قونصل خانہ)</option>
        </select>
      </div>

      {/* Form Fields */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-6">
          {/* Principal Details */}
          <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-3">
            <h3 className="font-display font-bold text-primary text-sm">1. Principal / Grantor Details (مختار دہندہ)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted">Full Name *</label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Muhammad Tariq"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">Father / Husband Name *</label>
                <input
                  type="text"
                  value={principalFather}
                  onChange={(e) => setPrincipalFather(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Abdul Rehman"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">CNIC / NICOP / Passport *</label>
                <input
                  type="text"
                  value={principalCnic}
                  onChange={(e) => setPrincipalCnic(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="35202-1234567-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">Country of Residence</label>
                <input
                  type="text"
                  value={principalCountry}
                  onChange={(e) => setPrincipalCountry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Pakistan / UK / UAE"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-muted">Full Residential Address</label>
                <input
                  type="text"
                  value={principalAddress}
                  onChange={(e) => setPrincipalAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="House 15, Street 2, Gulberg III, Lahore"
                />
              </div>
            </div>
          </div>

          {/* Attorney Details */}
          <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-3">
            <h3 className="font-display font-bold text-primary text-sm">2. Appointed Attorney Details (مختار خاص)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted">Attorney Full Name *</label>
                <input
                  type="text"
                  value={attorneyName}
                  onChange={(e) => setAttorneyName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Usman Tariq"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">Father Name *</label>
                <input
                  type="text"
                  value={attorneyFather}
                  onChange={(e) => setAttorneyFather(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Muhammad Tariq"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">Attorney CNIC *</label>
                <input
                  type="text"
                  value={attorneyCnic}
                  onChange={(e) => setAttorneyCnic(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="35202-7654321-3"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted">Relationship</label>
                <input
                  type="text"
                  value={attorneyRelation}
                  onChange={(e) => setAttorneyRelation(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="Son / Real Brother / Trusted Kin"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-muted">Attorney Address</label>
                <input
                  type="text"
                  value={attorneyAddress}
                  onChange={(e) => setAttorneyAddress(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
                  placeholder="House 24, Block D, Model Town, Lahore"
                />
              </div>
            </div>
          </div>

          {/* Conditional Subject Particulars */}
          {poaType === "property_sale" && (
            <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-2">
              <label className="text-xs font-bold text-fg">Property Particulars (خسرہ / کھاتہ / پلاٹ نمبر)</label>
              <textarea
                value={propertyDesc}
                onChange={(e) => setPropertyDesc(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs font-medium text-fg outline-none focus:border-primary"
              />
            </div>
          )}

          {poaType === "vehicle" && (
            <div className="rounded-2xl border border-border/80 bg-bg/40 p-5 space-y-2">
              <label className="text-xs font-bold text-fg">Motor Vehicle Registration & Chassis Details</label>
              <input
                type="text"
                value={vehicleReg}
                onChange={(e) => setVehicleReg(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-fg outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl border border-border/90 bg-bg/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
              <Eye className="size-4" /> Legal Deed Preview
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">e-Stamp Deed Format</span>
          </div>

          {validationError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="max-h-[380px] overflow-y-auto rounded-2xl bg-surface p-4 border border-border/80 shadow-inner font-mono text-[11px] leading-relaxed text-fg whitespace-pre-wrap">
            {generateLegalText()}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface shadow-xs hover:bg-primary-light transition-all"
            >
              {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Legal Draft"}</span>
            </button>
            <button
              type="button"
              onClick={printDocument}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-fg hover:border-primary hover:text-primary transition-all shadow-2xs"
            >
              <Printer className="size-4" />
              <span>Print Deed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
