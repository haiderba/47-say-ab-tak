import { Link } from "@tanstack/react-router";
import { Calculator, ChevronDown, KeyRound, LogOut, Menu, Search, ShieldCheck, User, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/guides", label: "Guides" },
  { to: "/tools", label: "Tools & Vault" },
  { to: "/flow", label: "Process Map" },
  { to: "/timeline", label: "Timeline" },
  { to: "/news", label: "News" },
];

export function SiteHeader({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isPending } = useCurrentUserState();

  const emailStr = user?.primaryEmail || "";
  const isAdmin = emailStr.toLowerCase() === "admin@47sayabtak.pk" || emailStr.toLowerCase().startsWith("admin");
  const initial = (user?.displayName || user?.primaryEmail || "C").charAt(0).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-accent shadow-sm">
            47
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-primary">
            Say Ab Tak
          </span>
        </Link>

        {/* Public Navigation (No Admin link) */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-bold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-full border border-border bg-bg/80 px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono font-bold text-muted sm:inline-block">
              ⌘K
            </kbd>
          </button>

          {/* User Auth / Profile Avatar Button */}
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-border" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-primary/30 bg-surface p-1 pr-3 hover:border-primary hover:shadow-sm transition-all text-left"
              >
                <div className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-accent shadow-sm">
                  {initial}
                </div>
                <span className="hidden md:inline-block max-w-[100px] truncate text-xs font-semibold text-primary">
                  {user.displayName || "Citizen"}
                </span>
                <ChevronDown className="size-3 text-muted" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl animate-in fade-in zoom-in-95 z-50">
                  <div className="border-b border-border/80 px-3 py-2.5">
                    <div className="text-xs font-bold text-primary truncate">
                      {user.displayName || "Citizen"}
                    </div>
                    <div className="font-mono text-[10px] text-muted truncate">
                      {user.primaryEmail}
                    </div>
                  </div>

                  <div className="mt-1 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-fg hover:bg-bg hover:text-primary transition-colors"
                    >
                      <User className="size-4 text-accent" /> My Citizen Profile
                    </Link>

                    <Link
                      to="/tools"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-fg hover:bg-bg hover:text-primary transition-colors"
                    >
                      <ShieldCheck className="size-4 text-accent" /> Encrypted Vault
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-danger hover:bg-red-50 transition-colors"
                      >
                        👑 Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-fg hover:bg-bg hover:text-primary transition-colors"
                    >
                      <KeyRound className="size-4 text-accent" /> Password Settings
                    </Link>

                    <div className="border-t border-border/80 my-1" />

                    <button
                      type="button"
                      onClick={async () => {
                        setDropdownOpen(false);
                        await authClient.signOut();
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-surface hover:bg-primary-light transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={cn("border-t border-border bg-surface md:hidden", open ? "block" : "hidden")}>
        <nav className="flex flex-col px-4 py-3 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="py-2 text-sm font-medium text-fg hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/profile"
              className="py-2 text-sm font-bold text-primary border-t border-border/80 mt-2 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <User className="size-4 text-accent" /> My Citizen Profile ({user.displayName || "Citizen"})
            </Link>
          ) : (
            <Link
              to="/login"
              className="py-2 text-sm font-bold text-primary border-t border-border/80 mt-2"
              onClick={() => setOpen(false)}
            >
              Sign In to Citizen Account
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
