import { Command } from "cmdk";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Calculator,
  Compass,
  FileCheck,
  FileText,
  History,
  Landmark,
  MapPin,
  Scale,
  Search,
  ShieldAlert,
  X,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { listCategories, listGuides } from "@/lib/content";
import { searchWithRomanUrdu, ROMAN_URDU_DICTIONARY } from "@/lib/roman-urdu-search";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  }) {
  const [search, setSearch] = useState("");
  const [guides, setGuides] = useState<{ slug: string; title: string; category_name: string; summary: string }[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; description: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    if (guides.length > 0) return;
    Promise.all([listGuides(), listCategories()])
      .then(([g, c]) => {
        setGuides(Array.isArray(g) ? g : []);
        setCategories(Array.isArray(c) ? c : []);
      })
      .catch(() => {});
  }, [open, guides.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate({ to: url as any });
  };

  // Resolve Roman Urdu matches dynamically
  const romanUrduResults = useMemo(() => {
    if (!search.trim()) return [];
    return searchWithRomanUrdu(search);
  }, [search]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-fg/40 p-4 pt-20 backdrop-blur-sm sm:pt-24 animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Search" className="flex flex-col">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="mr-3 size-5 shrink-0 text-muted" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search in English, Roman Urdu (e.g. 'gari ka token', 'fard', 'overseas mofa', 'shanakhti card')..."
              className="w-full bg-transparent text-base text-fg placeholder:text-muted outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-bg hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted">
              No results found for "{search}". Try searching in Roman Urdu (e.g. "gari ka token", "bache ka b form", "overseas mofa").
            </Command.Empty>

            {/* Smart Roman Urdu Suggestions */}
            {romanUrduResults.length > 0 && (
              <Command.Group heading="🔍 Roman Urdu Smart Matches (رومن اردو تلاش)" className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                {romanUrduResults.map((item, idx) => (
                  <Command.Item
                    key={idx}
                    value={`${item.title} ${item.keywords.join(" ")}`}
                    onSelect={() => {
                      if (item.targetToolId) {
                        handleSelect(`/tools?tool=${item.targetToolId}`);
                      } else if (item.targetGuideSlug) {
                        handleSelect(`/guides/${item.targetGuideSlug}`);
                      } else {
                        handleSelect("/tools");
                      }
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-emerald-500/10 hover:text-emerald-700 aria-selected:bg-emerald-600 aria-selected:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold block">{item.title}</span>
                        <span className="text-[11px] opacity-75 line-clamp-1">{item.description}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-700 shrink-0 ml-2">
                      {item.badge}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Quick Navigation / Tools */}
            <Command.Group heading="42 Official Citizen Utilities &amp; Verifiers" className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <Command.Item
                value="overseas mofa attestation digital power of attorney poc nicop embassy foreign affairs pardesi"
                onSelect={() => handleSelect("/tools?tool=overseas_mofa")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Globe className="size-4 text-blue-600" />
                  <span className="font-semibold">Overseas Pakistani &amp; MOFA Attestation Portal</span>
                </div>
                <span className="text-xs opacity-75">QR Attestation, PoA &amp; POC</span>
              </Command.Item>

              <Command.Item
                value="psid 1bill epay punjab fbr ict challan verifier payment dues disco"
                onSelect={() => handleSelect("/tools?tool=psid_1bill")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Zap className="size-4 text-emerald-600" />
                  <span className="font-semibold">17-Digit PSID / 1Bill Challan Verifier</span>
                </div>
                <span className="text-xs opacity-75">e-Pay, FBR, ICT Dues</span>
              </Command.Item>

              <Command.Item
                value="pta dirbs imei mobile stolen phone customs tax 8484 tac gari"
                onSelect={() => handleSelect("/tools?tool=pta_imei")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="size-4 text-indigo-600" />
                  <span className="font-semibold">PTA DIRBS 15-Digit IMEI &amp; Tax Inspector</span>
                </div>
                <span className="text-xs opacity-75">Hardware TAC &amp; 2026 Customs Tax</span>
              </Command.Item>

              <Command.Item
                value="mtmis vehicle gari token tax transfer biometric punjab sindh ict kp"
                onSelect={() => handleSelect("/tools?tool=mtmis_vehicle")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Landmark className="size-4 text-blue-600" />
                  <span className="font-semibold">MTMIS 4-Province Vehicle Ownership Hub</span>
                </div>
                <span className="text-xs opacity-75">Punjab, Sindh, ICT &amp; KP</span>
              </Command.Item>

              <Command.Item
                value="fbr active taxpayer atl 9966 ntn withholding tax reduction 236k 231b"
                onSelect={() => handleSelect("/tools?tool=fbr_atl")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="size-4 text-emerald-600" />
                  <span className="font-semibold">FBR Active Taxpayer (ATL) &amp; NTN Verifier</span>
                </div>
                <span className="text-xs opacity-75">RTO Jurisdiction &amp; Tax Benefits</span>
              </Command.Item>

              <Command.Item
                value="solar net metering units payback roi electricity bill slab nepra"
                onSelect={() => handleSelect("/tools?tool=solar")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Zap className="size-4 text-amber-600" />
                  <span className="font-semibold">Solar Net-Metering &amp; Bill Calculator</span>
                </div>
                <span className="text-xs opacity-75">System ROI &amp; NEPRA Slabs</span>
              </Command.Item>
            </Command.Group>

            {/* Department Guides */}
            {guides.length > 0 && (
              <Command.Group heading="Step-by-Step Government Guides" className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                {guides.slice(0, 8).map((guide) => (
                  <Command.Item
                    key={guide.slug}
                    value={`${guide.title} ${guide.category_name} ${guide.summary}`}
                    onSelect={() => handleSelect(`/guides/${guide.slug}`)}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted" />
                      <span className="font-semibold line-clamp-1">{guide.title}</span>
                    </div>
                    <span className="text-xs opacity-75 truncate max-w-[120px]">{guide.category_name}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
