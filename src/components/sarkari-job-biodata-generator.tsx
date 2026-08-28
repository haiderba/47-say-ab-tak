import { Briefcase, Printer } from "lucide-react";

export function SarkariJobBiodataGenerator() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-black text-primary">Sarkari Job Bio-Data Form Drafter</h2>
        <button type="button" onClick={() => window.print()} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface">
          <Printer className="inline size-4 mr-1" /> Print Bio-Data
        </button>
      </div>
    </div>
  );
}
