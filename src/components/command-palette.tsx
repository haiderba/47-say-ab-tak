import { Command } from "cmdk";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { listCategories, listGuides } from "@/lib/content";

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
              placeholder="Search guides, 24/7 centers, CNIC, scam alerts, affidavits, fees... (ESC to close)"
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
              No results found for "{search}". Try searching for 24/7 Centers, NADRA, Scams, or Affidavits.
            </Command.Empty>

            {/* Quick Navigation / Tools */}
            <Command.Group heading="Civic Tools & Portals" className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              <Command.Item
                value="centers 24/7 mega locator plra mouza map nadra"
                onSelect={() => handleSelect("/tools")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-emerald-600" />
                  <span className="font-semibold">24/7 Centers & Mouza Locator</span>
                </div>
                <span className="text-xs opacity-75">Nearby NADRA, PLRA, Passport</span>
              </Command.Item>

              <Command.Item
                value="scam radar fraud tout complaint corruption fia"
                onSelect={() => handleSelect("/tools")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="size-4 text-danger" />
                  <span className="font-semibold">Scam Radar & Anti-Corruption</span>
                </div>
                <span className="text-xs opacity-75">Open letter, fake stamp, hotlines</span>
              </Command.Item>

              <Command.Item
                value="calculator fee taxes nadra passport dlims property"
                onSelect={() => handleSelect("/tools")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="size-4 text-accent" />
                  <span className="font-semibold">Fee & Tax Calculator</span>
                </div>
                <span className="text-xs opacity-75">Official government rates</span>
              </Command.Item>

              <Command.Item
                value="affidavit stamp paper generator noc tenant loss agreement"
                onSelect={() => handleSelect("/tools")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <FileCheck className="size-4 text-accent" />
                  <span className="font-semibold">Legal Affidavit & Stamp Generator</span>
                </div>
                <span className="text-xs opacity-75">E-Stamp Paper Printout</span>
              </Command.Item>

              <Command.Item
                value="inheritance faraid shares calculator succession"
                onSelect={() => handleSelect("/tools")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Scale className="size-4 text-accent" />
                  <span className="font-semibold">Inheritance (Faraid) Calculator</span>
                </div>
                <span className="text-xs opacity-75">Islamic Succession Law</span>
              </Command.Item>

              <Command.Item
                value="process map inheritance flowchart succession"
                onSelect={() => handleSelect("/flow")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <Compass className="size-4 text-accent" />
                  <span className="font-semibold">Inheritance Process Map</span>
                </div>
                <span className="text-xs opacity-75">Step-by-step succession flow</span>
              </Command.Item>

              <Command.Item
                value="timeline 1947 history evolution"
                onSelect={() => handleSelect("/timeline")}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
              >
                <div className="flex items-center gap-3">
                  <History className="size-4 text-accent" />
                  <span className="font-semibold">1947 → 2026 Evolution Timeline</span>
                </div>
                <span className="text-xs opacity-75">Historical Documentation</span>
              </Command.Item>
            </Command.Group>

            {/* Government Guides */}
            <Command.Group heading="Official Documentation Guides" className="mt-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              {guides.map((g) => (
                <Command.Item
                  key={g.slug}
                  value={`${g.title} ${g.category_name} ${g.summary}`}
                  onSelect={() => handleSelect(`/guides/${g.slug}`)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="size-4 shrink-0 text-primary" />
                    <div className="truncate">
                      <div className="font-semibold">{g.title}</div>
                      <div className="text-xs opacity-70 truncate">{g.summary}</div>
                    </div>
                  </div>
                  <span className="ml-2 shrink-0 rounded-md bg-bg px-2 py-0.5 text-[10px] font-bold text-accent">
                    {g.category_name}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Departments & Categories */}
            <Command.Group heading="Departments & Authorities" className="mt-2 px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
              {categories.map((c) => (
                <Command.Item
                  key={c.slug}
                  value={`${c.name} ${c.description}`}
                  onSelect={() => handleSelect(`/categories/${c.slug}`)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg transition-colors hover:bg-primary/10 hover:text-primary aria-selected:bg-primary aria-selected:text-surface"
                >
                  <div className="flex items-center gap-3">
                    <Landmark className="size-4 text-muted" />
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="text-xs text-muted">Department</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border bg-bg px-4 py-2.5 text-xs text-muted">
            <span>
              Tip: Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono font-bold">↑</kbd> <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono font-bold">↓</kbd> to navigate, <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono font-bold">ENTER</kbd> to select
            </span>
            <span className="font-display font-semibold text-primary">47 Say Ab Tak</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
