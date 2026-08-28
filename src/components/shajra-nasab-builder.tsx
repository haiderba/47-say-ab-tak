import { useState } from "react";
import { GitFork, Printer } from "lucide-react";

export function ShajraNasabBuilder() {
  const [deceasedName, setDeceasedName] = useState("Haji Abdul Rehman");

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-black text-primary">Shajra-e-Nasab Drafter (شجرہ نسب)</h2>
          <p className="text-xs text-muted">Standard Family Tree format for PLRA Land Mutation & Succession.</p>
        </div>
        <button type="button" onClick={() => window.print()} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface">
          <Printer className="inline size-4 mr-1" /> Print Chart
        </button>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center space-y-4">
        <div className="inline-block rounded-2xl bg-primary px-6 py-3 text-surface font-bold">
          Deceased (متوفی): {deceasedName}
        </div>
      </div>
    </div>
  );
}
