import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Lock,
  Printer,
  Scale,
  Sparkles,
  Eye,
  X,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

type TemplateType = "loss" | "noc" | "tenant" | "name_correction" | "vehicle_sale";

export function AffidavitGenerator() {
  const [template, setTemplate] = useState<TemplateType>("loss");

  // Common Deponent Details (Defaults to empty for strict verification)
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("Islam");
  const [city, setCity] = useState("Lahore");

  // Specific Template Details
  const [lostDocName, setLostDocName] = useState("Original Smart CNIC Card");
  const [lostLocation, setLostLocation] = useState("Lahore / Public Transit");

  // NOC Details
  const [nocPurpose, setNocPurpose] = useState("Transfer of deceased father's Property / Vehicle");
  const [beneficiaryName, setBeneficiaryName] = useState("");

  // Tenant Details
  const [tenantName, setTenantName] = useState("");
  const [tenantCnic, setTenantCnic] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [advanceDeposit, setAdvanceDeposit] = useState("");
  const [rentedProperty, setRentedProperty] = useState("");

  // Name Correction Details
  const [correctName, setCorrectName] = useState("");
  const [wrongDocName, setWrongDocName] = useState("");

  // Witnesses
  const [witness1, setWitness1] = useState("Witness 1 (CNIC & Signature)");
  const [witness2, setWitness2] = useState("Witness 2 (CNIC & Signature)");

  const [copied, setCopied] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form Validation Check
  const isDeponentFilled = Boolean(
    name.trim() &&
    fatherName.trim() &&
    cnic.trim() &&
    address.trim() &&
    city.trim()
  );

  const fillSampleData = () => {
    setName("Muhammad Ali");
    setFatherName("Tariq Mahmood");
    setCnic("35201-1234567-1");
    setAddress("House No. 12, Street 4, Gulberg III, Lahore");
    setCity("Lahore");
    setLostDocName("Original Computerized National Identity Card (Smart CNIC)");
    setLostLocation("Liberty Market, Gulberg, Lahore");
    setBeneficiaryName("Usman Ali (Brother)");
    setTenantName("Zubair Ahmed");
    setTenantCnic("37405-9876543-1");
    setMonthlyRent("45,000");
    setAdvanceDeposit("100,000");
    setRentedProperty("Upper Portion, House 45-B, Model Town, Lahore");
    setCorrectName("Muhammad Ali Khan");
    setWrongDocName("Matriculation Certificate where name is written as 'M. Ali'");
    setValidationError(null);
  };

  // Generate Formal Pakistani Legal Statement
  const getAffidavitText = () => {
    let specificBody = "";

    if (template === "loss") {
      specificBody = `1. That I am a bona fide citizen of Pakistan and a permanent resident of the above-mentioned address.
2. That my ${lostDocName || "Document"} has been lost / misplaced somewhere at or near ${lostLocation || "the city"} on or about recent days despite best efforts to trace it.
3. That I have not misused or pledged the said document with any bank, financial institution, court, or private person.
4. That I am submitting this affidavit to the competent authority for the issuance of a duplicate / replacement document.
5. That in case the original document is found at any later stage, I undertake to deposit the same immediately with the issuing authority.`;
    } else if (template === "noc") {
      specificBody = `1. That I am the lawful legal heir of the deceased ${fatherName || "[Father Name]"}.
2. That I hereby state on solemn oath that I have NO OBJECTION whatsoever to the ${nocPurpose || "[Purpose]"} in favor of ${beneficiaryName || "[Beneficiary Name]"}.
3. That I have willingly relinquished any claim regarding the aforesaid matter without any coercion, fraud, or undue influence from any quarter.
4. That this No-Objection Certificate shall be binding on me and my legal successors for all legal and official intents and purposes.`;
    } else if (template === "tenant") {
      specificBody = `1. That the Landlord is the absolute and lawful owner of the premises situated at: ${rentedProperty || "[Property Address]"}.
2. That the Landlord has rented the said premises to the Tenant (${tenantName || "[Tenant Name]"}, CNIC: ${tenantCnic || "[CNIC]"}) at an agreed monthly rent of PKR ${monthlyRent || "0"}/- payable in advance by the 5th of each calendar month.
3. That the Tenant has deposited a refundable security advance of PKR ${advanceDeposit || "0"}/- with the Landlord.
4. That the Tenant shall use the premises strictly for residential purposes and shall comply with the Punjab/Sindh Temporary Residents Registration Act.
5. That both parties agree to give one (1) month prior written notice before vacating the premises.`;
    } else if (template === "name_correction") {
      specificBody = `1. That my correct and actual name according to my NADRA record and family lineage is: "${correctName || "[Correct Name]"}".
2. That due to a clerical mistake, my name was mistakenly recorded as "${wrongDocName || "[Wrong Name]"}".
3. That both names belong to one and the same person, i.e., the deponent.
4. That I solemnly declare that "${correctName || "[Correct Name]"}" is my sole authentic name for all educational, official, banking, and travel records.`;
    } else {
      specificBody = `1. That I have sold and delivered the possession of my vehicle to the buyer.
2. That the agreed sale consideration has been received in full and nothing is outstanding.
3. That the buyer has taken delivery of the vehicle along with the original registration book/smart card and file.
4. That the buyer is solely responsible for completing the biometric ownership transfer via the Excise & Taxation Department within 30 days.`;
    }

    return `BEFORE THE OATH COMMISSIONER / NOTARY PUBLIC AT ${city.toUpperCase()}

AFFIDAVIT

I, ${name || "[Full Name]"}, Son/Daughter/Wife of ${fatherName || "[Father/Husband Name]"}, Muslim, adult, holding CNIC No. ${cnic || "[CNIC]"}, resident of ${address || "[Address]"}, do hereby solemnly affirm and declare on oath as under:

${specificBody}

VERIFICATION:
Verified on Oath at ${city} on this ${new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}, that the contents of above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed or falsely stated therein.

DEPONENT: _________________________
Name: ${name || "[Name]"}
CNIC: ${cnic || "[CNIC]"}

WITNESS 1:
Name & CNIC: ${witness1}

WITNESS 2:
Name & CNIC: ${witness2}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getAffidavitText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPreview = () => {
    if (!isDeponentFilled) {
      setValidationError("Please fill in your Full Name, Father/Husband Name, CNIC, and Address before viewing the affidavit.");
      return;
    }
    setValidationError(null);
    setShowMobileModal(true);
  };

  // Render the Stamp Paper Content (Shared between desktop side-view and mobile modal)
  const renderStampPaper = () => (
    <div className="rounded-2xl border-2 border-primary/40 bg-white text-neutral-900 p-5 sm:p-8 shadow-2xl font-serif text-xs leading-relaxed relative print:m-0 print:border-none print:shadow-none">
      {/* E-Stamp Header Bar */}
      <div className="border-b-2 border-neutral-900 pb-3 text-center">
        <div className="text-[10px] font-sans font-bold tracking-widest text-neutral-600 uppercase">
          GOVERNMENT OF PAKISTAN / PROVINCIAL REVENUE AUTHORITY
        </div>
        <div className="mt-1 font-display text-base sm:text-lg font-bold text-neutral-950 tracking-wide">
          E-STAMP PAPER (CHALLAN 32-A)
        </div>
        <div className="mt-1 flex justify-between text-[9px] font-sans text-neutral-600 font-mono">
          <span>Security Code: PK-2026-ESTMP-98421</span>
          <span>Denomination: PKR {template === "tenant" ? "1,200" : "100"}</span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-5 text-center">
        <h4 className="font-sans text-[11px] sm:text-xs font-extrabold uppercase tracking-wider underline text-neutral-900">
          BEFORE THE OATH COMMISSIONER / NOTARY PUBLIC AT {city.toUpperCase()}
        </h4>
        <h3 className="mt-1.5 font-display text-sm sm:text-base font-bold uppercase tracking-widest text-neutral-950">
          AFFIDAVIT (بیان حلفی)
        </h3>
      </div>

      {/* Deponent Line */}
      <p className="mt-4 text-justify leading-relaxed">
        I, <strong>{name || "[Full Name]"}</strong>, Son/Daughter/Wife of <strong>{fatherName || "[Father/Husband Name]"}</strong>, Muslim, adult, holding CNIC No. <strong>{cnic || "[CNIC Number]"}</strong>, resident of <strong>{address || "[Residential Address]"}</strong>, do hereby solemnly affirm and declare on oath as under:
      </p>

      {/* Specific Clauses */}
      <div className="mt-3 space-y-2 text-justify leading-relaxed">
        {template === "loss" && (
          <>
            <p>1. That I am a bona fide citizen of Pakistan and a permanent resident of the above-mentioned address.</p>
            <p>2. That my <strong>{lostDocName || "Document"}</strong> has been lost / misplaced somewhere at or near <strong>{lostLocation || "the area"}</strong> on or about recent days despite best efforts to trace it.</p>
            <p>3. That I have not misused or pledged the said document with any bank, financial institution, court, or private person.</p>
            <p>4. That I am submitting this affidavit to the competent authority for the issuance of a duplicate / replacement document.</p>
            <p>5. That in case the original document is found at any later stage, I undertake to deposit the same immediately with the issuing authority.</p>
          </>
        )}

        {template === "noc" && (
          <>
            <p>1. That I am the lawful legal heir of the deceased {fatherName || "[Father Name]"}.</p>
            <p>2. That I hereby state on solemn oath that I have <strong>NO OBJECTION</strong> whatsoever to the <strong>{nocPurpose || "[Purpose]"}</strong> in favor of <strong>{beneficiaryName || "[Beneficiary Name]"}</strong>.</p>
            <p>3. That I have willingly relinquished any claim regarding the aforesaid matter without any coercion, fraud, or undue influence from any quarter.</p>
            <p>4. That this No-Objection Certificate shall be binding on me and my legal successors for all legal and official intents and purposes.</p>
          </>
        )}

        {template === "tenant" && (
          <>
            <p>1. That the Landlord is the absolute and lawful owner of the premises situated at: <strong>{rentedProperty || "[Property Address]"}</strong>.</p>
            <p>2. That the Landlord has rented the premises to the Tenant (<strong>{tenantName || "[Tenant Name]"}</strong>, CNIC: <strong>{tenantCnic || "[CNIC]"}</strong>) at an agreed monthly rent of <strong>PKR {monthlyRent || "0"}/-</strong> payable in advance.</p>
            <p>3. That the Tenant has deposited a refundable security advance of <strong>PKR {advanceDeposit || "0"}/-</strong> with the Landlord.</p>
            <p>4. That the Tenant shall use the premises strictly for residential purposes and shall comply with the Temporary Residents Registration Act.</p>
            <p>5. That both parties agree to give one (1) month prior written notice before vacating the premises.</p>
          </>
        )}

        {template === "name_correction" && (
          <>
            <p>1. That my correct and actual name according to my NADRA record and family lineage is: "<strong>{correctName || "[Correct Name]"}</strong>".</p>
            <p>2. That due to a clerical mistake, my name was recorded as "<strong>{wrongDocName || "[Wrong Name]"}</strong>".</p>
            <p>3. That both names belong to one and the same person, i.e., the deponent.</p>
            <p>4. That I solemnly declare that "<strong>{correctName || "[Correct Name]"}</strong>" is my sole authentic name for all official records.</p>
          </>
        )}

        {template === "vehicle_sale" && (
          <>
            <p>1. That I have sold and delivered the possession of my vehicle to the buyer.</p>
            <p>2. That the agreed sale consideration has been received in full and nothing is outstanding.</p>
            <p>3. That the buyer has taken delivery of the vehicle along with the original registration book/smart card and file.</p>
            <p>4. That the buyer is solely responsible for completing the biometric ownership transfer via the Excise & Taxation Department within 30 days.</p>
          </>
        )}
      </div>

      {/* Verification */}
      <div className="mt-4 border-t border-neutral-300 pt-2 text-justify italic text-[11px]">
        <strong>VERIFICATION:</strong> Verified on Oath at {city} on this {new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}, that the contents of above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed therein.
      </div>

      {/* Signatures & Seal Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-neutral-300 text-[10px] font-sans">
        <div>
          <div className="h-10 border-b border-dashed border-neutral-400" />
          <div className="mt-1 font-bold">DEPONENT (حلف کنندہ)</div>
          <div>CNIC: {cnic || "_______________"}</div>
        </div>

        <div className="rounded-lg border-2 border-red-800 p-2 text-center text-red-900 bg-red-50/50">
          <div className="font-bold uppercase tracking-wider text-[9px]">ATTESTED BY NOTARY PUBLIC</div>
          <div className="mt-1 text-[8px] text-neutral-600">Oath Commissioner / Advocate High Court</div>
          <div className="mt-2 text-[8px] italic">Sign & Official Red Seal</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl border border-border bg-surface p-4 sm:p-6 md:p-10 shadow-card">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <FileCheck className="size-3.5" /> Legal Instruments &amp; Stamp Paper
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Legal Affidavit &amp; Undertaking Generator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Draft standardized Pakistani legal affidavits ready for printing on PKR 50 / 100 / 1200 E-Stamp Paper.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fillSampleData}
            className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-accent/20 transition-all"
          >
            <Sparkles className="size-3.5 text-accent" /> Sample Data
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-semibold text-fg hover:bg-surface transition-colors"
          >
            {copied ? <CheckCircle2 className="size-3.5 text-primary" /> : <Copy className="size-3.5 text-muted" />}
            {copied ? "Copied" : "Copy Text"}
          </button>
        </div>
      </div>

      {/* TEMPLATE SELECTION TABS */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap rounded-2xl border border-border bg-bg p-2">
        {[
          { id: "loss", label: "📄 Loss of Documents" },
          { id: "noc", label: "🤝 Succession NOC / Dastbardari" },
          { id: "tenant", label: "🏠 Tenant Agreement (PKM)" },
          { id: "name_correction", label: "✏️ Name / DOB Correction" },
          { id: "vehicle_sale", label: "🚗 Vehicle Sale Undertaking" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id as any)}
            className={
              "rounded-xl px-3 py-2 text-xs font-semibold transition-all text-left sm:text-center " +
              (template === t.id
                ? "bg-primary text-surface shadow-md font-bold"
                : "text-muted hover:text-primary")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs font-medium text-amber-900">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* INPUTS FORM */}
        <div className="space-y-5 lg:col-span-6">
          {/* SECTION 1: DEPONENT PARTICULARS */}
          <div className="rounded-2xl border border-border bg-bg/50 p-4 sm:p-5 space-y-4">
            <div className="border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                1. Deponent Particulars
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 font-serif block mt-0.5">
                (حلف کنندہ کے بنیادی کوائف)
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted">Full Legal Name *</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Muhammad Ali"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted">Father / Husband Name *</label>
                <input
                  value={fatherName}
                  onChange={(e) => {
                    setFatherName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Tariq Mahmood"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted">CNIC Number (13 Digits) *</label>
                <input
                  value={cnic}
                  onChange={(e) => {
                    setCnic(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="35201-1234567-1"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted">City / District *</label>
                <input
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. Lahore / Islamabad"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted">Complete Residential Address *</label>
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="House No., Street, Area, City"
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* SECTION 2: TEMPLATE SPECIFIC INPUTS */}
          <div className="rounded-2xl border border-border bg-bg/50 p-4 sm:p-5 space-y-4">
            <div className="border-b border-border/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                2. Specific Subject Matter
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 font-serif block mt-0.5">
                (مندرجات و تفصیلات بیان حلفی)
              </span>
            </div>

            {template === "loss" && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted">Lost Document Title &amp; Details</label>
                  <input
                    value={lostDocName}
                    onChange={(e) => setLostDocName(e.target.value)}
                    placeholder="e.g. Smart CNIC / Matric Sanad / Driving License"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted">Estimated Place / Area of Loss</label>
                  <input
                    value={lostLocation}
                    onChange={(e) => setLostLocation(e.target.value)}
                    placeholder="e.g. Liberty Market, Lahore"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {template === "noc" && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted">Subject / Purpose of NOC</label>
                  <input
                    value={nocPurpose}
                    onChange={(e) => setNocPurpose(e.target.value)}
                    placeholder="e.g. Transfer of deceased father's vehicle LEB-2024"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted">In Favor of (Beneficiary Name &amp; Relation)</label>
                  <input
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    placeholder="e.g. Usman Ali (Brother)"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {template === "tenant" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted">Tenant Full Name</label>
                    <input
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="e.g. Zubair Ahmed"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Tenant CNIC</label>
                    <input
                      value={tenantCnic}
                      onChange={(e) => setTenantCnic(e.target.value)}
                      placeholder="37405-9876543-1"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted">Rented Property Address</label>
                  <input
                    value={rentedProperty}
                    onChange={(e) => setRentedProperty(e.target.value)}
                    placeholder="e.g. Upper Portion, House 45-B, Model Town"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-muted">Monthly Rent (PKR)</label>
                    <input
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      placeholder="e.g. 45,000"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted">Security Advance (PKR)</label>
                    <input
                      value={advanceDeposit}
                      onChange={(e) => setAdvanceDeposit(e.target.value)}
                      placeholder="e.g. 100,000"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {template === "name_correction" && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted">Correct Legal Name</label>
                  <input
                    value={correctName}
                    onChange={(e) => setCorrectName(e.target.value)}
                    placeholder="e.g. Muhammad Ali Khan"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted">Document with Clerical Error</label>
                  <input
                    value={wrongDocName}
                    onChange={(e) => setWrongDocName(e.target.value)}
                    placeholder="e.g. Matric Certificate where name is 'M. Ali'"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {template === "vehicle_sale" && (
              <div className="p-3 rounded-xl bg-surface border border-border text-xs text-muted space-y-1">
                <p className="font-bold text-fg">🚗 Standard Vehicle Sale Delivery Clauses:</p>
                <p>Includes biometric transfer undertaking, full price clearance, and possession handover statement.</p>
              </div>
            )}
          </div>

          {/* ACTION BUTTON (Mobile & Desktop) */}
          <div className="pt-2">
            {isDeponentFilled ? (
              <button
                type="button"
                onClick={handleOpenPreview}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 px-6 text-sm font-bold text-surface hover:bg-primary-light transition-all shadow-lg active:scale-95"
              >
                <Eye className="size-4 text-accent" />
                <span>View &amp; Download Official Stamp Paper</span>
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lock className="size-3.5 text-amber-600" />
                  <span>Affidavit Preview Locked</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
                  Please fill in your <strong>Full Legal Name, Father/Husband Name, CNIC, and Address</strong> above to generate your official stamp paper.
                </p>
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="mt-2 text-xs font-bold text-primary underline hover:text-primary-light"
                >
                  Or click here to load sample demo data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP LIVE STAMP PAPER PREVIEW (Guarded by Information check) */}
        <div className="hidden lg:block lg:col-span-6">
          {isDeponentFilled ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Official Stamp Paper Preview
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-md"
                >
                  <Printer className="size-3.5 text-accent" /> Download / Print PDF
                </button>
              </div>
              {renderStampPaper()}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg/50 p-8 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Lock className="size-8 text-accent" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-primary">
                Affidavit Preview Locked
              </h3>
              <p className="mt-2 text-xs text-muted max-w-sm">
                Fill in your legal details and deponent particulars on the left to unlock and generate your official printable Challan 32-A Stamp Paper.
              </p>
              <button
                type="button"
                onClick={fillSampleData}
                className="mt-4 rounded-xl border border-accent bg-accent/10 px-4 py-2 text-xs font-bold text-primary hover:bg-accent/20 transition-all"
              >
                Load Sample Particulars
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE POP-UP MODAL VIEWER */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col max-h-[92vh] sm:max-h-[85vh] w-full max-w-3xl mx-auto rounded-t-3xl sm:rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-primary">
                  Official Stamp Paper Preview (Challan 32-A)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileModal(false)}
                className="grid size-8 place-items-center rounded-full bg-bg hover:bg-border text-muted hover:text-fg transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable Stamp Paper) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-100">
              {renderStampPaper()}
            </div>

            {/* Modal Sticky Bottom Action Bar */}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-5 py-3.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-4 py-2.5 text-xs font-bold text-fg hover:bg-surface transition-colors"
              >
                {copied ? <CheckCircle2 className="size-3.5 text-primary" /> : <Copy className="size-3.5 text-muted" />}
                <span>{copied ? "Copied" : "Copy Text"}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 px-4 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-md active:scale-95"
              >
                <Printer className="size-4 text-accent" />
                <span>Download / Print PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
