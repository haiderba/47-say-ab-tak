import { IdCard, Printer } from "lucide-react";

export function PocketEmergencyCard() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-black text-primary">Printable Citizen Emergency Card</h2>
        <button type="button" onClick={() => window.print()} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-surface">
          <Printer className="inline size-4 mr-1" /> Print Card
        </button>
      </div>
    </div>
  );
}
