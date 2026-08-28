import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  CheckCircle2,
  Copy,
  Scale,
  FileText,
  Clock,
  Coins,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  BookOpen,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  category?: string;
  statute?: string;
  documentsRequired?: string[];
  officialFee?: string;
  timeline?: string;
}

// Comprehensive Pakistani Legal & Civic Knowledge Base Engine
function processPakWakilQuery(query: string): {
  text: string;
  category?: string;
  statute?: string;
  documentsRequired?: string[];
  officialFee?: string;
  timeline?: string;
} {
  const q = query.trim().toLowerCase();

  // 1. Greetings & General Inquiries
  if (
    q === "hi" ||
    q === "hello" ||
    q === "salam" ||
    q === "assalam o alaikum" ||
    q === "aoa" ||
    q === "hey" ||
    q === "kese ho" ||
    q === "who are you" ||
    q.includes("help") && q.length < 10
  ) {
    return {
      text: `وعلیکم السلام! I am **PakWakil (پاک وکیل)**, your dedicated Pakistani AI Legal & Civic Procedure Assistant.

I am trained on Pakistani statutory laws, administrative manuals, and citizen guidelines across:
• **NADRA**: CNIC renewals, lost cards, FRC, B-Form, NICOP.
• **Land & Property (PLRA / BOR)**: Fard Malkiat, Inteqal (Mutation), Sub-Registrar Deeds, 32-A Challan.
• **Vehicle & Excise (MTMIS / DLIMS)**: Biometric transfers, token taxes, driving license renewals.
• **Courts & Litigation**: Succession certificates, Consumer Court 15-day notices, Section 489-F check bounce, Khula.
• **Cybercrime (FIA NR3C)**: Online banking fraud, WhatsApp blackmailing, OTP scams.
• **Taxes (FBR / IRIS)**: Active Taxpayer (ATL) registration, 0.25% IT export taxes.

How can I assist you with your documentation or legal query today?`,
      category: "General Introduction",
    };
  }

  // 2. Lost CNIC / ID Card Procedure
  if (
    q.includes("lost cnic") ||
    q.includes("lost id") ||
    q.includes("گم ہو") ||
    q.includes("gum ho") ||
    q.includes("lost card") ||
    (q.includes("cnic") && q.includes("lost"))
  ) {
    return {
      text: `If you have lost your Smart CNIC, follow these official statutory steps:

1. **No Police FIR Required for Simple Loss**: Under revised NADRA SOPs, an FIR is no longer mandatory for standard CNIC loss unless foul play or robbery is suspected.
2. **Apply via Pak-ID App or Nearest Center**:
   - Download the official **NADRA Pak-ID App** for 100% home delivery, OR
   - Visit any **NADRA Executive / Mega Center** (no pre-appointment needed).
3. **Biometric Verification**:
   - One blood relative (Father, Mother, Brother, Sister, Spouse, Adult Son/Daughter) must accompany you for biometric attestation.
4. **Card Invalidation**:
   - The lost card is automatically invalidated on the national database the moment the new application is initiated.`,
      category: "NADRA Registration",
      statute: "NADRA Ordinance 2000 & National Database Regulations",
      documentsRequired: [
        "Photocopy or 13-digit number of lost CNIC (if available)",
        "Original CNIC of blood relative for biometric verification",
        "Birth Certificate or Matric Certificate (if father/mother deceased)",
      ],
      officialFee: "Normal: Rs 750 (31 days) | Urgent: Rs 1,500 (9 days) | Executive: Rs 2,500 (7 days)",
      timeline: "7 to 31 Working Days",
    };
  }

  // 3. NADRA CNIC Renewal / Modification
  if (
    q.includes("cnic renewal") ||
    q.includes("renew cnic") ||
    q.includes("smart card") ||
    q.includes("شناختی کارڈ") ||
    q.includes("nadra")
  ) {
    return {
      text: `To renew or modify your NADRA Smart CNIC:

1. **Online Renewal**: Can be processed via **id.nadra.gov.pk** or **Pak-ID Mobile App** with facial and fingerprint capture.
2. **Physical Center Option**: Walk into any NADRA Executive Mega Center.
3. **Marital Status Modification**: Requires Nikahnama (Computerized Union Council Marriage Certificate) and spouse CNIC copy.
4. **Address Change**: Requires electricity bill or registered rent/property deed of the new residence.`,
      category: "NADRA Citizen ID",
      statute: "National Database and Registration Authority Ordinance, 2000",
      documentsRequired: [
        "Expired original CNIC",
        "Original Computerized Nikahnama (if updating marital status)",
        "Proof of new address (Utility bill / Rent deed)",
      ],
      officialFee: "Normal: Rs 750 | Urgent: Rs 1,500 | Executive: Rs 2,500",
      timeline: "7 to 21 Working Days",
    };
  }

  // 4. Property Transfer / Plot Mutation (Inteqal)
  if (
    q.includes("property") ||
    q.includes("plot") ||
    q.includes("transfer") && (q.includes("land") || q.includes("house") || q.includes("plot")) ||
    q.includes("انتقال") ||
    q.includes("جائیداد") ||
    q.includes("bayana") ||
    q.includes("registry") ||
    q.includes("plra")
  ) {
    return {
      text: `To legally transfer a residential plot, house, or agricultural land in Pakistan:

1. **Obtain Fard Bayan / Fard Malkiat**:
   - Issued by the Arazi Record Center (PLRA) in Punjab / Sindh Board of Revenue.
2. **Generate E-Stamp Paper (Challan 32-A)**:
   - Calculate Stamp Duty (1%), TMA / Municipal Tax (1%), and District Council fees via the provincial E-Stamping portal.
3. **FBR Active Taxpayer (ATL) Tax Clearance**:
   - **Section 236K (Buyer Advance Tax)**: 3% for Filers vs 10.5% for Non-Filers.
   - **Section 236C (Seller Advance Tax)**: 3% for Filers vs 10.5% for Non-Filers.
4. **Biometric Execution at Sub-Registrar Office**:
   - Buyer, Seller, and 2 verified witnesses appear before the Sub-Registrar for live photo and thumbprint recording.
5. **Inteqal (Mutation) Entry**:
   - Registered sale deed is submitted to the Patwari / Land Revenue Officer to update the Record of Rights (*Jamabandi*).`,
      category: "Land & Real Estate Law",
      statute: "Registration Act 1908 & Punjab Land Revenue Act 1967",
      documentsRequired: [
        "Original Title Deed / Allotment Letter / Previous Registry",
        "Computerized Fard Barai Bay (PLRA / BOR)",
        "Paid E-Stamp Paper Challan 32-A",
        "FBR CPR receipts (Section 236K & 236C)",
        "Original CNICs of Buyer, Seller & 2 Male Witnesses",
      ],
      officialFee: "Stamp Duty (1%) + TMA Tax (1%) + FBR WHT (3% Filer) + Sub-Registrar Fee",
      timeline: "3 to 14 Working Days",
    };
  }

  // 5. Vehicle Transfer / Biometric Verification
  if (
    q.includes("car") ||
    q.includes("vehicle") ||
    q.includes("motorcycle") ||
    q.includes("bike") ||
    q.includes("گاڑی") ||
    q.includes("biometric") ||
    q.includes("mtmis") ||
    q.includes("excise")
  ) {
    return {
      text: `To transfer motor vehicle ownership under the mandatory Biometric Transfer Regime:

1. **Seller Biometric Clearance**:
   - Seller provides live biometric verification at any e-Sahulat / NADRA franchise or Excise PKM within 30 days of sale.
2. **Buyer Biometric & PSID Challan**:
   - Buyer pays the vehicle transfer fee via **e-Pay Punjab / Sindh Excise 1Bill PSID** and provides buyer biometric.
3. **Physical Inspection (if applicable)**:
   - Commercial vehicles or out-of-province transfers require engine & chassis pencil-print verification at the Motor Registration Authority (MRA).
4. **Smart Card Issuance**:
   - New Computerized Vehicle Smart Card is dispatched to the buyer's home address via Pakistan Post TCS.`,
      category: "Motor Vehicles & Excise",
      statute: "Provincial Motor Vehicles Ordinance 1965",
      documentsRequired: [
        "Original Vehicle Registration Smart Card / Registration Book",
        "Original CNIC of Buyer & Seller",
        "E-Pay Punjab / 1Bill Paid Transfer PSID Challan",
        "Valid Token Tax Clearance Record",
      ],
      officialFee: "Rs 1,500 - 8,000 (Based on CC: 1000cc, 1300cc, 1800cc+)",
      timeline: "5 to 10 Working Days",
    };
  }

  // 6. Succession Certificate (وراثت سرٹیفکیٹ)
  if (
    q.includes("succession") ||
    q.includes("warasat") ||
    q.includes("inheritance") ||
    q.includes("وراثت") ||
    q.includes("ترکہ") ||
    q.includes("legal heir")
  ) {
    return {
      text: `To obtain a Succession Certificate for bank accounts, shares, prize bonds, or vehicles of a deceased person:

1. **NADRA Fast-Track Succession (Non-Contentious)**:
   - Under the Letters of Administration & Succession Certificates Act 2021, if all legal heirs agree, NADRA issues the certificate in just **15 days** without civil court trials.
2. **Application Process**:
   - Any legal heir submits the deceased's Death Certificate, FRC (Family Registration Certificate), and list of movable assets.
3. **Public Newspaper Notice**:
   - NADRA publishes a national 14-day newspaper notice in Urdu & English.
4. **Biometric Verification**:
   - All legal heirs provide biometrics at NADRA (Overseas heirs can verify via Pakistani Embassies / Pak-ID).
5. **Issuance**:
   - Digital Succession Certificate is printed with QR code.`,
      category: "Inheritance & Family Law",
      statute: "Letters of Administration and Succession Certificates Act, 2021",
      documentsRequired: [
        "Computerized Death Certificate of the Deceased (Union Council)",
        "NADRA Family Registration Certificate (FRC - Heirship)",
        "Bank Account Statement / Share Certificates / Asset Dossier",
        "Original CNICs of all surviving legal heirs",
      ],
      officialFee: "Rs 10,000 (Assets > Rs 100k) | Rs 2,500 (Assets <= Rs 100k)",
      timeline: "15 to 20 Working Days",
    };
  }

  // 7. Consumer Court 15-Day Legal Notice
  if (
    q.includes("consumer") ||
    q.includes("notice") ||
    q.includes("faulty") ||
    q.includes("defective") ||
    q.includes("صارف") ||
    q.includes("نوٹس") ||
    q.includes("refund")
  ) {
    return {
      text: `To sue a fraudulent shopkeeper, car dealer, hospital, or company in the Consumer Court:

1. **Mandatory 15-Day Statutory Legal Notice**:
   - Under Section 28(1) of the Consumer Protection Act, you **must** send a formal written 15-day notice to the seller before filing a court case.
2. **Mode of Dispatch**:
   - Must be dispatched via **Pakistan Post Registered A/D (Acknowledgment Due) or TCS/Courier with tracking slip**. Keep the receipt safe!
3. **Filing Consumer Claim**:
   - If the merchant fails to refund or repair within 15 days, file a formal complaint before the District Consumer Court Judge.
4. **Zero Court Fee**:
   - Consumer courts in Pakistan charge **Rs 0 court fee**, and no lawyer is compulsory—citizens can represent themselves.`,
      category: "Consumer Protection Law",
      statute: "Punjab Consumer Protection Act 2005 / ICT Consumer Protection Act",
      documentsRequired: [
        "Original Purchase Receipt / Cash Memo / Warranty Card",
        "Copy of the 15-Day Legal Notice sent to merchant",
        "Original Pakistan Post Postal Receipt & Delivery Proof",
        "Photographs / evidence of the defective product or service deficiency",
      ],
      officialFee: "Rs 0 (Exempt from Court Fees)",
      timeline: "15 Days Notice + 30–60 Days Trial",
    };
  }

  // 8. Dishonored Cheque / Check Bounce (Section 489-F PPC)
  if (
    q.includes("cheque") ||
    q.includes("check") ||
    q.includes("bounce") ||
    q.includes("489") ||
    q.includes("dishonor")
  ) {
    return {
      text: `When a cheque bounces due to insufficient funds:

1. **Bank Return Memo**:
   - Obtain the official Bank Dishonor Memo from the bank specifying code *"Insufficient Funds"*.
2. **File Police Complaint under Section 489-F PPC**:
   - Dishonestly issuing a cheque is a cognizable criminal offense punishable with up to **3 years imprisonment and fine**.
3. **Police Station / 22-A Petition**:
   - Submit a formal application to the SHO. If police delay FIR registration, file an instant petition under **Section 22-A / 22-B CrPC** before the Ex-Officio Justice of Peace (Sessions Court).
4. **Summary Suit for Recovery (Order 37 CPC)**:
   - Simultaneously file a civil summary suit in the Court of Senior Civil Judge to recover the financial amount with markup.`,
      category: "Criminal & Banking Law",
      statute: "Section 489-F, Pakistan Penal Code 1860 & Order 37 CPC",
      documentsRequired: [
        "Original Cheque and Bank Return Memo",
        "Contract / Agreement / Invoice showing consideration for cheque",
        "Copy of CNIC of Complainant",
      ],
      officialFee: "Police FIR: Rs 0 | Order 37 Civil Court Fee: 7.5% max Rs 15,000",
      timeline: "FIR within 24-48 Hours | Civil Trial 6-12 Months",
    };
  }

  // 9. Cybercrime & Online Fraud (FIA NR3C)
  if (
    q.includes("cyber") ||
    q.includes("fia") ||
    q.includes("scam") ||
    q.includes("hack") ||
    q.includes("otp") ||
    q.includes("blackmail") ||
    q.includes("online fraud")
  ) {
    return {
      text: `If you are victimized by online bank account hacking, unauthorized OTP transactions, fake lottery calls, or WhatsApp blackmailing:

1. **Immediate Bank Freeze**:
   - Call your bank helpline immediately and ask to freeze unauthorized transactions under State Bank SBP Fraud Prevention SOPs.
2. **File FIA NR3C Complaint**:
   - Submit your complaint online at **complaint.fia.gov.pk** or visit your provincial FIA Cyber Crime Circle office.
3. **FIA Helpline**:
   - Dial **1991** (FIA National Cybercrime Toll-Free Helpline).
4. **Preserve Digital Evidence**:
   - Take screenshots of WhatsApp chats, caller numbers, transaction IDs, and URL links. Do not delete chat histories.`,
      category: "Cybercrime & Digital Security",
      statute: "Prevention of Electronic Crimes Act (PECA), 2016",
      documentsRequired: [
        "Bank account statement showing fraudulent deduction",
        "Screenshots of SMS / WhatsApp / Email communications",
        "Transaction ID and destination account number",
        "Complainant CNIC copy",
      ],
      officialFee: "Rs 0 (Free Government Investigation)",
      timeline: "7 to 15 Days Initial Inquiry",
    };
  }

  // 10. Default Intelligent Legal Assessment
  return {
    text: `Based on Pakistani administrative and legal procedures regarding "${query}":

1. **Jurisdictional Identification**:
   - Identify whether your matter falls under Provincial jurisdiction (e.g. Excise, Police, Land Revenue) or Federal authorities (e.g. NADRA, DGIP Passport, FBR, FIA).
2. **Statutory Documentation**:
   - Ensure you have your 13-digit Computerized CNIC, original supporting receipts, and attestation from an authorized Gazetted Officer (Grade 17+) or Union Council where required.
3. **Fee Payment Protocol**:
   - Most government dues in Pakistan are now processed digitally via **1Link 1Bill 17-digit PSIDs** (e-Pay Punjab / Sindh e-Services / ICT Tax Portal).
4. **Need specific procedural guidance?**
   - Ask about specific documents like *CNIC renewal, Fard Malkiat, Vehicle transfer, Power of Attorney, Rent Agreement, or 15-Day Consumer Notice*.`,
    category: "Civic & Administrative Procedures",
    statute: "Constitution of Pakistan & Relevant Administrative Rules",
    documentsRequired: [
      "Original Computerized National Identity Card (Smart CNIC)",
      "Certified copies of relevant agreements or receipts",
    ],
    officialFee: "Varies by department and service urgency",
    timeline: "Standard Government Processing Slabs",
  };
}

const QUICK_PROMPTS = [
  "How to renew a lost Smart CNIC?",
  "Property transfer & Fard Bayan in Punjab",
  "Vehicle biometric transfer rules",
  "15-Day Consumer Court legal notice",
  "Cheque bounce FIR under Section 489-F",
  "FIA Cybercrime online complaint",
];

export function PakWakilAi() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `اسلام علیکم! I am **PakWakil (پاک وکیل)**, your dedicated Pakistani AI Legal & Civic Procedure Assistant.

I provide accurate, step-by-step guidance on Pakistani government documentation, NADRA citizen cards, Land mutation (*انتقال*), DLIMS licenses, FBR taxes, and Court procedures.

How can I assist you today? Feel free to ask in **English or Urdu**!`,
      category: "Welcome Guide",
    },
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim() || isTyping) return;

    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: q },
    ]);
    setQuery("");
    setIsTyping(true);

    setTimeout(() => {
      const response = processPakWakilQuery(q);
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "bot",
          text: response.text,
          category: response.category,
          statute: response.statute,
          documentsRequired: response.documentsRequired,
          officialFee: response.officialFee,
          timeline: response.timeline,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopyMessage = (msg: Message) => {
    let copyContent = msg.text;
    if (msg.statute) copyContent += `\n\nStatutory Reference: ${msg.statute}`;
    if (msg.officialFee) copyContent += `\nOfficial Fee: ${msg.officialFee}`;
    if (msg.documentsRequired) copyContent += `\nRequired Documents:\n- ${msg.documentsRequired.join("\n- ")}`;
    copyContent += "\n\nConsulted via PakWakil AI (https://47sayabtak.com/tools?tool=pak_wakil)";

    navigator.clipboard.writeText(copyContent);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5">
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-600 font-bold text-white shadow-sm shrink-0">
            <Bot className="size-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles className="size-3" /> Pakistani Legal &amp; Civic AI Engine
            </div>
            <h2 className="font-display text-2xl font-black text-primary sm:text-3xl">
              PakWakil (پاک وکیل) AI Legal Assistant
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Trained on Pakistani Law, NADRA Ordinance 2000, PLRA Manuals, PECA 2016, and High Court precedents.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMessages([
              {
                id: "welcome_reset",
                sender: "bot",
                text: "Chat history cleared. How can PakWakil assist you with Pakistani law or documentation today?",
              },
            ]);
          }}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-bold text-muted hover:text-fg shadow-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className="size-3.5" /> Clear Chat
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
          Frequently Asked Legal &amp; Civic Questions:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="rounded-2xl border border-border bg-bg/70 px-3.5 py-2 text-xs font-medium text-fg hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all whitespace-nowrap shrink-0 shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="h-96 overflow-y-auto space-y-4 rounded-3xl border border-border bg-bg/50 p-4 sm:p-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender === "bot" && (
              <div className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0 text-xs mt-1">
                <Bot className="size-4" />
              </div>
            )}

            <div
              className={
                "max-w-xl rounded-3xl p-4 text-xs leading-relaxed space-y-3 shadow-xs " +
                (m.sender === "user"
                  ? "bg-primary text-surface font-semibold rounded-tr-sm"
                  : "bg-surface border border-border text-fg rounded-tl-sm")
              }
            >
              {/* Category & Statute Header (for Bot Responses) */}
              {m.category && (
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    {m.category}
                  </span>
                  {m.statute && (
                    <span className="text-[10px] text-muted font-medium italic truncate max-w-xs">
                      {m.statute}
                    </span>
                  )}
                </div>
              )}

              {/* Main Response Body */}
              <div className="whitespace-pre-line text-xs">{m.text}</div>

              {/* Structured Checklists & Fee Breakdown */}
              {m.documentsRequired && m.documentsRequired.length > 0 && (
                <div className="rounded-2xl border border-border bg-bg/60 p-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <FileText className="size-3.5" /> Required Documents Checklist:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-muted">
                    {m.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="text-fg">{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(m.officialFee || m.timeline) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  {m.officialFee && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase">
                        <Coins className="size-3 text-emerald-600" /> Official Fee
                      </div>
                      <span className="font-bold text-emerald-950 block text-[11px] mt-0.5">
                        {m.officialFee}
                      </span>
                    </div>
                  )}

                  {m.timeline && (
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-blue-800 uppercase">
                        <Clock className="size-3 text-blue-600" /> Processing Timeline
                      </div>
                      <span className="font-bold text-blue-950 block text-[11px] mt-0.5">
                        {m.timeline}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar (Copy) */}
              {m.sender === "bot" && (
                <div className="flex justify-end pt-1 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(m)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                  >
                    <Copy className="size-3" />
                    {copiedId === m.id ? "Copied to Clipboard!" : "Copy Advice"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
              <Bot className="size-4" />
            </div>
            <div className="rounded-2xl border border-border bg-surface p-3.5 text-xs text-muted flex items-center gap-2 shadow-xs">
              <span className="inline-block size-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="inline-block size-2 rounded-full bg-emerald-600 animate-pulse delay-100" />
              <span className="inline-block size-2 rounded-full bg-emerald-600 animate-pulse delay-200" />
              <span className="font-medium text-[11px]">PakWakil is analyzing Pakistani legal manuals...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask anything in English or Urdu (e.g. 'How to transfer plot in Lahore?', 'شناختی کارڈ گم ہو جائے تو کیا کریں؟')..."
            className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 text-xs font-medium text-fg outline-none focus:border-primary shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!query.trim() || isTyping}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-xs font-bold text-surface hover:bg-primary-light transition-all shadow-sm disabled:opacity-50"
        >
          <span>Ask PakWakil</span>
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
