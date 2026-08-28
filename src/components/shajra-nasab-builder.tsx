import { useState } from "react";
import { GitFork, Users, Plus, Trash2, Printer, ShieldCheck, Download, Copy } from "lucide-react";

interface HeirMember {
  id: string;
  name: string;
  relation: "Wife" | "Husband" | "Son" | "Daughter" | "Father" | "Mother" | "Brother" | "Sister";
  cnic: string;
  isAlive: boolean;
}

export function ShajraNasabBuilder() {
  const [deceasedName, setDeceasedName] = useState("Haji Abdul Rehman");
  const [deceasedCnic, setDeceasedCnic] = useState("35201-1122334-5");
  const [fatherOfDeceased, setFatherOfDeceased] = useState("Chaudhry Ghulam Muhammad");
  const [deathDate, setDeathDate] = useState("15 January 2025");
  const [districtTehsil, setDistrictTehsil] = useState("Tehsil Model Town, District Lahore");
  const [heirs, setHeirs] = useState<HeirMember[]>([
    { id: "1", name: "Zubaida Begum", relation: "Wife", cnic: "35201-2233445-6", isAlive: true },
    { id: "2", name: "Muhammad Aslam", relation: "Son", cnic: "35201-3344556-7", isAlive: true },
    { id: "3", name: "Tariq Mehmood", relation: "Son", cnic: "35201-4455667-8", isAlive: true },
    { id: "4", name: "Fatima Bibi", relation: "Daughter", cnic: "35201-5566778-9", isAlive: true },
  ]);

  const addHeir = () => {
    setHeirs([
      ...heirs,
      {
        id: Date.now().toString(),
        name: "",
        relation: "Son",
        cnic: "",
        isAlive: true,
      },
    ]);
  };

  const removeHeir = (id: string) => {
    setHeirs(heirs.filter((h) => h.id !== id));
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-8 space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <GitFork className="size-3.5" /> Revenue & NADRA Succession Visualizer
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-primary sm:text-3xl">
            Shajra-e-Nasab Family Tree Drafter (شجرہ نسب)
          </h2>
          <p className="mt-1 text-xs text-muted">
            Generates standardized Shajra-e-Nasab for Land Mutation (انتقال وراثت) and NADRA Succession Certificates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-surface hover:bg-primary-light shadow-sm"
        >
          <Printer className="size-4" /> Print Shajra-e-Nasab
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Deceased Name (متوفی)</label>
          <input
            type="text"
            value={deceasedName}
            onChange={(e) => setDeceasedName(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Deceased CNIC</label>
          <input
            type="text"
            value={deceasedCnic}
            onChange={(e) => setDeceasedCnic(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Father of Deceased</label>
          <input
            type="text"
            value={fatherOfDeceased}
            onChange={(e) => setFatherOfDeceased(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Date of Death</label>
          <input
            type="text"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs font-bold text-fg"
          />
        </div>
      </div>

      {/* Heirs Management */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Surviving Legal Heirs ({heirs.length})</h4>
          <button
            type="button"
            onClick={addHeir}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
          >
            <Plus className="size-3.5" /> Add Heir
          </button>
        </div>

        <div className="space-y-2">
          {heirs.map((h, i) => (
            <div key={h.id} className="grid gap-2 sm:grid-cols-4 items-center rounded-xl border border-border bg-bg/40 p-2.5">
              <input
                type="text"
                value={h.name}
                onChange={(e) => {
                  const updated = [...heirs];
                  updated[i].name = e.target.value;
                  setHeirs(updated);
                }}
                placeholder="Heir Full Name"
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg"
              />
              <select
                value={h.relation}
                onChange={(e) => {
                  const updated = [...heirs];
                  updated[i].relation = e.target.value as any;
                  setHeirs(updated);
                }}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg"
              >
                <option value="Wife">Wife (بیوہ)</option>
                <option value="Husband">Husband (شوہر)</option>
                <option value="Son">Son (بیٹا)</option>
                <option value="Daughter">Daughter (بیٹی)</option>
                <option value="Father">Father (والد)</option>
                <option value="Mother">Mother (والدہ)</option>
                <option value="Brother">Brother (بھائی)</option>
                <option value="Sister">Sister (بہن)</option>
              </select>
              <input
                type="text"
                value={h.cnic}
                onChange={(e) => {
                  const updated = [...heirs];
                  updated[i].cnic = e.target.value;
                  setHeirs(updated);
                }}
                placeholder="13-Digit CNIC"
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg"
              />
              <button
                type="button"
                onClick={() => removeHeir(h.id)}
                className="justify-self-end text-rose-500 hover:text-rose-700 p-1"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Chart */}
      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center space-y-4">
        <div className="inline-block rounded-2xl bg-primary px-6 py-3 text-surface font-bold shadow-md">
          <span className="block text-[10px] uppercase tracking-wider text-accent">Deceased (متوفی)</span>
          <span className="text-base font-black">{deceasedName} s/o {fatherOfDeceased}</span>
          <span className="block text-[11px] opacity-90">{deceasedCnic} | Died: {deathDate}</span>
        </div>
        
        <div className="h-6 w-0.5 bg-primary/40 mx-auto"></div>

        <div className="flex flex-wrap justify-center gap-3">
          {heirs.map((h) => (
            <div key={h.id} className="rounded-xl border border-primary/20 bg-surface p-3 text-xs shadow-xs min-w-[140px] text-left">
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                {h.relation}
              </span>
              <span className="font-bold text-fg block mt-1">{h.name || "Unnamed"}</span>
              <span className="text-[10px] text-muted">{h.cnic || "No CNIC"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
