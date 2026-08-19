import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  IdCard,
  Plus,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

export type TrackedDoc = {
  id: string;
  title: string;
  category: "CNIC" | "Passport" | "License" | "Vehicle" | "Tax" | "Other";
  holderName: string;
  documentNumber: string;
  expiryDate: string; // YYYY-MM-DD
  notes?: string;
  renewalSlug?: string;
};

const DEFAULT_DOCS: TrackedDoc[] = [
  {
    id: "doc-cnic-self",
    title: "Smart National Identity Card (CNIC)",
    category: "CNIC",
    holderName: "Self",
    documentNumber: "35201-1234567-1",
    expiryDate: "2027-04-15",
    renewalSlug: "cnic",
    notes: "Bank accounts & SIMs freeze if expired.",
  },
  {
    id: "doc-passport-self",
    title: "Machine Readable Passport (MRP)",
    category: "Passport",
    holderName: "Self",
    documentNumber: "PK12345678",
    expiryDate: "2026-11-20",
    renewalSlug: "passport",
    notes: "Requires minimum 6 months validity for international flights.",
  },
  {
    id: "doc-license-self",
    title: "Driving License (Car / Jeep)",
    category: "License",
    holderName: "Self",
    documentNumber: "LHR-DL-9842",
    expiryDate: "2026-09-30",
    renewalSlug: "driving-license",
    notes: "Traffic Police challans apply after expiry.",
  },
  {
    id: "doc-token-car",
    title: "Vehicle Token Tax (Honda City)",
    category: "Vehicle",
    holderName: "Self",
    documentNumber: "LEA-2022",
    expiryDate: "2026-06-30",
    renewalSlug: "vehicle-registration",
    notes: "Excise late surcharge increases by 10% monthly.",
  },
];

function getDaysRemaining(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function DocumentExpiryTracker() {
  const [docs, setDocs] = useState<TrackedDoc[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("citizen_tracked_docs");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_DOCS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TrackedDoc["category"]>("CNIC");
  const [newHolder, setNewHolder] = useState("Self");
  const [newNumber, setNewNumber] = useState("");
  const [newExpiry, setNewExpiry] = useState("");

  const saveDocs = (newDocs: TrackedDoc[]) => {
    setDocs(newDocs);
    try {
      localStorage.setItem("citizen_tracked_docs", JSON.stringify(newDocs));
    } catch {}
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newExpiry) return;

    const newDoc: TrackedDoc = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      holderName: newHolder,
      documentNumber: newNumber || "—",
      expiryDate: newExpiry,
      renewalSlug: newCategory === "CNIC" ? "cnic" : newCategory === "Passport" ? "passport" : newCategory === "License" ? "driving-license" : undefined,
    };

    saveDocs([...docs, newDoc]);
    setShowAddModal(false);
    setNewTitle("");
    setNewNumber("");
    setNewExpiry("");
  };

  const handleDelete = (id: string) => {
    saveDocs(docs.filter((d) => d.id !== id));
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Clock className="size-3.5" /> Personal Document Vault & Alerts
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-primary sm:text-3xl">
            Document Expiry & Penalty Tracker
          </h2>
          <p className="mt-1 text-xs text-muted">
            Track official document validity countdowns to prevent bank account freezing, flight rejections, and traffic fines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-surface hover:bg-primary-light transition-all shadow-sm"
        >
          <Plus className="size-4" /> Add Document to Tracker
        </button>
      </div>

      {/* Grid of Tracked Documents */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {docs.map((doc) => {
          const daysLeft = getDaysRemaining(doc.expiryDate);
          const isExpired = daysLeft <= 0;
          const isUrgent = daysLeft > 0 && daysLeft <= 60;
          const isPassportWarning = doc.category === "Passport" && daysLeft > 0 && daysLeft <= 180;

          return (
            <div
              key={doc.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all ${
                isExpired
                  ? "border-danger/40 bg-red-50/40"
                  : isUrgent || isPassportWarning
                  ? "border-amber-400 bg-amber-50/40"
                  : "border-border bg-bg/60 hover:border-primary/40 hover:bg-surface"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface border border-border px-2 py-0.5 text-[10px] font-bold text-accent">
                      {doc.category}
                    </span>
                    <span className="text-xs font-bold text-muted">For: {doc.holderName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="text-muted hover:text-danger p-1"
                    title="Remove document"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <h3 className="mt-2.5 font-display text-base font-bold text-primary">{doc.title}</h3>
                <div className="mt-1 flex items-center justify-between text-xs text-muted font-mono">
                  <span>No: {doc.documentNumber}</span>
                  <span>Expiry: {doc.expiryDate}</span>
                </div>

                {/* Status Countdown Badge */}
                <div className="mt-4 flex items-center gap-2">
                  {isExpired ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-extrabold text-white animate-pulse">
                      <AlertCircle className="size-3.5" /> EXPIRED ({Math.abs(daysLeft)} days ago)
                    </span>
                  ) : isUrgent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-xs font-extrabold text-white">
                      <AlertTriangle className="size-3.5" /> EXPIRING SOON ({daysLeft} days left)
                    </span>
                  ) : isPassportWarning ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
                      <AlertTriangle className="size-3.5 text-amber-700" /> &lt;6 Months Validity ({daysLeft} days)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="size-3.5 text-emerald-600" /> VALID ({daysLeft} days left)
                    </span>
                  )}
                </div>

                {/* Specific Warnings */}
                {isPassportWarning && !isExpired && (
                  <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-900 leading-relaxed">
                    <strong>Flight Alert:</strong> Most international airlines and foreign immigration authorities require at least <strong>6 months</strong> passport validity for boarding.
                  </p>
                )}

                {doc.notes && (
                  <p className="mt-2 text-[11px] text-muted leading-relaxed">{doc.notes}</p>
                )}
              </div>

              {/* Renewal Action */}
              <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-3">
                {doc.renewalSlug ? (
                  <Link
                    to="/guides/$slug"
                    params={{ slug: doc.renewalSlug }}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    View Renewal Checklist <ArrowRight className="size-3" />
                  </Link>
                ) : (
                  <span className="text-xs text-muted">Official Renewal</span>
                )}

                <Link
                  to="/tools"
                  className="rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-semibold text-fg hover:bg-bg"
                >
                  Estimate Renewal Fee
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Document */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-fg/40 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-primary">Add Document to Tracker</h3>
            <p className="text-xs text-muted mt-1">Track validity and receive advance renewal warnings.</p>

            <form onSubmit={handleAddDoc} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Document Name</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Father's CNIC, Suzuki Alto Token Tax"
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none"
                  >
                    <option value="CNIC">CNIC / ID</option>
                    <option value="Passport">Passport</option>
                    <option value="License">Driving License</option>
                    <option value="Vehicle">Vehicle Token</option>
                    <option value="Tax">FBR Tax Return</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Holder Name</label>
                  <input
                    value={newHolder}
                    onChange={(e) => setNewHolder(e.target.value)}
                    placeholder="Self / Father / Spouse"
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Document / Plate Number</label>
                <input
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="e.g. 35201-... or LEA-2020"
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-mono font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Exact Expiry Date</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg outline-none focus:border-primary"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-muted hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
