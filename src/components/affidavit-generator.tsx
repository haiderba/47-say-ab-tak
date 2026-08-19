import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Printer,
  Scale,
  Sparkles,
} from "lucide-react";

type TemplateType = "loss" | "noc" | "tenant" | "name_correction" | "vehicle_sale";

export function AffidavitGenerator() {
  const [template, setTemplate] = useState<TemplateType>("loss");

  // Common Deponent Details
  const [name, setName] = useState("Muhammad Ali");
  const [fatherName, setFatherName] = useState("Tariq Mahmood");
  const [cnic, setCnic] = useState("35201-1234567-1");
  const [address, setAddress] = useState("House No. 12, Street 4, Gulberg III, Lahore");
  const [religion, setReligion] = useState("Islam");
  const [city, setCity] = useState("Lahore");

  // Specific Template Details
  const [lostDocName, setLostDocName] = useState("Original Computerized National Identity Card (Smart CNIC)");
  const [lostLocation, setLostLocation] = useState("Liberty Market, Gulberg, Lahore");
  
  // NOC Details
  const [nocPurpose, setNocPurpose] = useState("Transfer of deceased father's Vehicle (Reg: LEB-2024)");
  const [beneficiaryName, setBeneficiaryName] = useState("Usman Ali (Brother)");

  // Tenant Details
  const [tenantName, setTenantName] = useState("Zubair Ahmed");
  const [tenantCnic, setTenantCnic] = useState("37405-9876543-1");
  const [monthlyRent, setMonthlyRent] = useState("45,000");
  const [advanceDeposit, setAdvanceDeposit] = useState("100,000");
  const [rentedProperty, setRentedProperty] = useState("Upper Portion, House 45-B, Model Town, Lahore");

  // Name Correction Details
  const [correctName, setCorrectName] = useState("Muhammad Ali Khan");
  const [wrongDocName, setWrongDocName] = useState("Matriculation Certificate where name is written as 'M. Ali'");

  // Witnesses
  const [witness1, setWitness1] = useState("Ahmad Raza (CNIC: 35202-1112233-1)");
  const [witness2, setWitness2] = useState("Kamran Shah (CNIC: 35201-9988776-3)");

  const [copied, setCopied] = useState(false);

  // Generate Formal Pakistani Legal Statement
  const getAffidavitText = () => {
    let specificBody = "";

    if (template === "loss") {
      specificBody = `1. That I am a bona fide citizen of Pakistan and a permanent resident of the above-mentioned address.
2. That my ${lostDocName} has been lost / misplaced somewhere at or near ${lostLocation} on or about recent days despite best efforts to trace it.
3. That I have not misused or pledged the said document with any bank, financial institution, court, or private person.
4. That I am submitting this affidavit to the competent authority for the issuance of a duplicate / replacement document.
5. That in case the original document is found at any later stage, I undertake to deposit the same immediately with the issuing authority.`;
    } else if (template === "noc") {
      specificBody = `1. That I am the lawful legal heir of the deceased ${fatherName}.
2. That I hereby state on solemn oath that I have NO OBJECTION whatsoever to the ${nocPurpose} in favor of ${beneficiaryName}.
3. That I have willingly relinquished any claim regarding the aforesaid matter without any coercion, fraud, or undue influence from any quarter.
4. That this No-Objection Certificate shall be binding on me and my legal successors for all legal and official intents and purposes.`;
    } else if (template === "tenant") {
      specificBody = `1. That the Landlord is the absolute and lawful owner of the premises situated at: ${rentedProperty}.
2. That the Landlord has rented the said premises to the Tenant (${tenantName}, CNIC: ${tenantCnic}) at a agreed monthly rent of PKR ${monthlyRent}/- payable in advance by the 5th of each calendar month.
3. That the Tenant has deposited a refundable security advance of PKR ${advanceDeposit}/- with the Landlord.
4. That the Tenant shall use the premises strictly for residential purposes and shall not sublet or engage in any unlawful activity in compliance with the Punjab/Sindh Temporary Residents Registration Act.
5. That both parties agree to give one (1) month prior written notice before vacating the premises.`;
    } else if (template === "name_correction") {
      specificBody = `1. That my correct and actual name according to my NADRA record and family lineage is: "${correctName}".
2. That due to a clerical mistake, my name was mistakenly recorded as "${wrongDocName}".
3. That both names belong to one and the same person, i.e., the deponent.
4. That I solemnly declare that "${correctName}" is my sole authentic name for all educational, official, banking, and travel records.`;
    } else {
      specificBody = `1. That I have sold and delivered the possession of my vehicle to the buyer.
2. That the agreed sale consideration has been received in full and nothing is outstanding.
3. That the buyer has taken delivery of the vehicle along with the original registration book/smart card and file.
4. That the buyer is solely responsible for completing the biometric ownership transfer via the Excise & Taxation Department within 30 days.`;
    }

    return `BEFORE THE OATH COMMISSIONER / NOTARY PUBLIC AT ${city.toUpperCase()}

AFFIDAVIT

I, ${name}, Son/Daughter/Wife of ${fatherName}, Muslim, adult, holding CNIC No. ${cnic}, resident of ${address}, do hereby solemnly affirm and declare on oath as under:

${specificBody}

VERIFICATION:
Verified on Oath at ${city} on this ${new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}, that the contents of above affidavit are true and correct to the best of my knowledge and belief and nothing has been concealed or falsely stated therein.

DEPONENT: _________________________
Name: ${name}
CNIC: ${cnic}
Cell: _____________________________

WITNESS 1:
Name & CNIC: ${witness1}
Signature: ________________________

WITNESS 2:
Name & CNIC: ${witness2}
Signature: ________________________`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getAffidavitText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <FileCheck className="size-3.5" /> Legal Instruments & Stamp Paper
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Legal Affidavit & Undertaking Generator
          </h2>
          <p className="mt-1 text-xs text-muted">
            Generate standardized Pakistani affidavits ready for printing on PKR 50 / 100 / 1200 E-Stamp Paper.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-4 py-2 text-xs font-semibold text-fg hover:bg-surface transition-colors"
          >
            {copied ? <CheckCircle2 className="size-3.5 text-primary" /> : <Copy className="size-3.5 text-muted" />}
            {copied ? "Copied to Clipboard" : "Copy Plain Text"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-surface hover:bg-primary-light transition-colors"
          >
            <Printer className="size-3.5" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* TEMPLATE SELECTION TABS */}
      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-border bg-bg p-2">
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
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              template === t.id ? "bg-primary text-surface shadow-md font-bold" : "text-muted hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* INPUTS FORM */}
        <div className="space-y-5 lg:col-span-6">
          <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              1. Deponent Particulars (حلف کنندہ کے کوائف)
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted">Full Legal Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-muted">Father / Husband Name</label>
                <input
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted">CNIC Number</label>
                <input
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-muted">City / District</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted">Complete Residential Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* TEMPLATE SPECIFIC INPUTS */}
          <div className="rounded-2xl border border-border bg-bg/50 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              2. Specific Subject Matters (مندرجات بیان حلفی)
            </h3>

            {template === "loss" && (
              <>
                <div>
                  <label className="text-xs text-muted">Lost Document Title & Details</label>
                  <input
                    value={lostDocName}
                    onChange={(e) => setLostDocName(e.target.value)}
                    placeholder="e.g. Smart CNIC / Matric Sanad / Driving License"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Estimated Place / Area of Loss</label>
                  <input
                    value={lostLocation}
                    onChange={(e) => setLostLocation(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {template === "noc" && (
              <>
                <div>
                  <label className="text-xs text-muted">Subject / Purpose of NOC</label>
                  <input
                    value={nocPurpose}
                    onChange={(e) => setNocPurpose(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">In Favor of (Beneficiary Name & Relation)</label>
                  <input
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            {template === "tenant" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted">Tenant Full Name</label>
                    <input
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted">Tenant CNIC</label>
                    <input
                      value={tenantCnic}
                      onChange={(e) => setTenantCnic(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted">Rented Property Address</label>
                  <input
                    value={rentedProperty}
                    onChange={(e) => setRentedProperty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted">Monthly Rent (PKR)</label>
                    <input
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted">Security Advance (PKR)</label>
                    <input
                      value={advanceDeposit}
                      onChange={(e) => setAdvanceDeposit(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {template === "name_correction" && (
              <>
                <div>
                  <label className="text-xs text-muted">Correct Legal Name</label>
                  <input
                    value={correctName}
                    onChange={(e) => setCorrectName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted">Document with Clerical Error</label>
                  <input
                    value={wrongDocName}
                    onChange={(e) => setWrongDocName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* LIVE STAMP PAPER PREVIEW */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border-2 border-primary/30 bg-white text-neutral-900 p-6 sm:p-8 shadow-xl font-serif text-xs leading-relaxed relative print:m-0 print:border-none print:shadow-none">
            {/* E-Stamp Header Bar */}
            <div className="border-b-2 border-neutral-900 pb-3 text-center">
              <div className="text-[10px] font-sans font-bold tracking-widest text-neutral-600 uppercase">
                GOVERNMENT OF PAKISTAN / PROVINCIAL REVENUE AUTHORITY
              </div>
              <div className="mt-1 font-display text-lg font-bold text-neutral-950">
                E-STAMP PAPER (CHALLAN 32-A)
              </div>
              <div className="mt-1 flex justify-between text-[9px] font-sans text-neutral-500 font-mono">
                <span>Security Code: PK-2026-ESTMP-98421</span>
                <span>Denomination: PKR {template === "tenant" ? "1,200" : "100"}</span>
              </div>
            </div>

            {/* Title */}
            <div className="mt-6 text-center">
              <h4 className="font-sans text-xs font-extrabold uppercase tracking-wider underline">
                BEFORE THE OATH COMMISSIONER / NOTARY PUBLIC AT {city.toUpperCase()}
              </h4>
              <h3 className="mt-2 font-display text-base font-bold uppercase tracking-widest">
                AFFIDAVIT
              </h3>
            </div>

            {/* Deponent Line */}
            <p className="mt-4 text-justify">
              I, <strong>{name}</strong>, Son/Daughter/Wife of <strong>{fatherName}</strong>, Muslim, adult, holding CNIC No. <strong>{cnic}</strong>, resident of <strong>{address}</strong>, do hereby solemnly affirm and declare on oath as under:
            </p>

            {/* Specific Clauses */}
            <div className="mt-3 space-y-2 text-justify">
              {template === "loss" && (
                <>
                  <p>1. That I am a bona fide citizen of Pakistan and a permanent resident of the above-mentioned address.</p>
                  <p>2. That my <strong>{lostDocName}</strong> has been lost / misplaced somewhere at or near <strong>{lostLocation}</strong> on or about recent days despite best efforts to trace it.</p>
                  <p>3. That I have not misused or pledged the said document with any bank, financial institution, court, or private person.</p>
                  <p>4. That I am submitting this affidavit to the competent authority for the issuance of a duplicate / replacement document.</p>
                  <p>5. That in case the original document is found at any later stage, I undertake to deposit the same immediately with the issuing authority.</p>
                </>
              )}

              {template === "noc" && (
                <>
                  <p>1. That I am the lawful legal heir of the deceased {fatherName}.</p>
                  <p>2. That I hereby state on solemn oath that I have <strong>NO OBJECTION</strong> whatsoever to the <strong>{nocPurpose}</strong> in favor of <strong>{beneficiaryName}</strong>.</p>
                  <p>3. That I have willingly relinquished any claim regarding the aforesaid matter without any coercion, fraud, or undue influence from any quarter.</p>
                  <p>4. That this No-Objection Certificate shall be binding on me and my legal successors for all legal and official intents and purposes.</p>
                </>
              )}

              {template === "tenant" && (
                <>
                  <p>1. That the Landlord is the absolute and lawful owner of the premises situated at: <strong>{rentedProperty}</strong>.</p>
                  <p>2. That the Landlord has rented the premises to the Tenant (<strong>{tenantName}</strong>, CNIC: <strong>{tenantCnic}</strong>) at an agreed monthly rent of <strong>PKR {monthlyRent}/-</strong> payable in advance.</p>
                  <p>3. That the Tenant has deposited a refundable security advance of <strong>PKR {advanceDeposit}/-</strong> with the Landlord.</p>
                  <p>4. That the Tenant shall use the premises strictly for residential purposes and shall comply with the Temporary Residents Registration Act.</p>
                  <p>5. That both parties agree to give one (1) month prior written notice before vacating the premises.</p>
                </>
              )}

              {template === "name_correction" && (
                <>
                  <p>1. That my correct and actual name according to my NADRA record and family lineage is: "<strong>{correctName}</strong>".</p>
                  <p>2. That due to a clerical mistake, my name was recorded as "<strong>{wrongDocName}</strong>".</p>
                  <p>3. That both names belong to one and the same person, i.e., the deponent.</p>
                  <p>4. That I solemnly declare that "<strong>{correctName}</strong>" is my sole authentic name for all official records.</p>
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
                <div>CNIC: {cnic}</div>
              </div>

              <div className="rounded-lg border-2 border-red-800 p-2 text-center text-red-900 bg-red-50/50">
                <div className="font-bold uppercase tracking-wider text-[9px]">ATTESTED BY NOTARY PUBLIC</div>
                <div className="mt-1 text-[8px] text-neutral-600">Oath Commissioner / Advocate High Court</div>
                <div className="mt-2 text-[8px] italic">Sign & Official Red Seal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
