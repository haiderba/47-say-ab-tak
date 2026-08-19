import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-surface/15 font-display text-sm font-bold text-accent shadow-sm">
              47
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-surface">
              Say Ab Tak
            </span>
          </div>
          <p className="text-xs leading-relaxed text-surface/80">
            From Partition 1947 till now — clear, authoritative rules-wise guidance on Pakistani government documentation for every citizen.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface/10 px-3 py-1 text-[11px] font-semibold text-accent">
            <span>🇵🇰 100% Free Public Guide</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-display font-bold text-accent">Major Departments</h4>
          <ul className="space-y-2 text-xs text-surface/80">
            <li>
              <Link to="/categories/$slug" params={{ slug: "nadra" }} className="hover:text-accent transition-colors">
                NADRA (CNIC, FRC & Succession)
              </Link>
            </li>
            <li>
              <Link to="/categories/$slug" params={{ slug: "land" }} className="hover:text-accent transition-colors">
                Land Records (PLRA / Mutation)
              </Link>
            </li>
            <li>
              <Link to="/categories/$slug" params={{ slug: "passport" }} className="hover:text-accent transition-colors">
                Passports & Immigration (DGIP)
              </Link>
            </li>
            <li>
              <Link to="/categories/$slug" params={{ slug: "traffic" }} className="hover:text-accent transition-colors">
                Traffic Police & DLIMS
              </Link>
            </li>
            <li>
              <Link to="/categories/$slug" params={{ slug: "fbr" }} className="hover:text-accent transition-colors">
                FBR & Active Taxpayer (ATL)
              </Link>
            </li>
            <li>
              <Link to="/categories/$slug" params={{ slug: "attestation" }} className="hover:text-accent transition-colors">
                Degree Attestation (HEC / MOFA)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display font-bold text-accent">Civic Tools & Resources</h4>
          <ul className="space-y-2 text-xs text-surface/80">
            <li>
              <Link to="/tools" className="hover:text-accent transition-colors">
                ⚡ Fee & Tax Calculator
              </Link>
            </li>
            <li>
              <Link to="/flow" className="hover:text-accent transition-colors">
                🗺️ Inheritance Process Map
              </Link>
            </li>
            <li>
              <Link to="/timeline" className="hover:text-accent transition-colors">
                📜 1947 → 2026 History Timeline
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-accent transition-colors">
                📋 All 30+ Official Checklists
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-accent transition-colors">
                📰 Latest Regulatory Updates
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display font-bold text-accent">Citizen Notice</h4>
          <p className="text-xs leading-relaxed text-surface/75">
            47 Say Ab Tak provides citizen guidance. Always verify requirements from official government counters and official portals before payment.
          </p>
          <div className="mt-4 rounded-xl border border-surface/15 bg-surface/5 p-3 text-[11px] text-surface/70">
            <strong>Offline Mode Ready:</strong> Install on your device to access checklists with zero mobile signal.
          </div>
        </div>
      </div>

      <div className="border-t border-surface/15 py-6 text-center text-xs text-surface/60">
        © {new Date().getFullYear()} 47 Say Ab Tak. Built with pride for the citizens of Pakistan.
      </div>
    </footer>
  );
}

