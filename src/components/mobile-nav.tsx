import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  History,
  Home,
  Lock,
  Newspaper,
  Shield,
  Sparkles,
} from "lucide-react";

export function MobileNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const NAV_ITEMS = [
    {
      to: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      to: "/news",
      label: "News",
      icon: Newspaper,
      badge: "Live",
      isActive: pathname.startsWith("/news"),
    },
    {
      to: "/tools",
      label: "Vault",
      icon: Lock,
      isActive: pathname.startsWith("/tools"),
    },
    {
      to: "/timeline",
      label: "Timeline",
      icon: History,
      isActive: pathname.startsWith("/timeline"),
    },
    {
      to: "/guides",
      label: "Guides",
      icon: BookOpen,
      isActive: pathname.startsWith("/guides") || pathname.startsWith("/categories"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block md:hidden border-t border-border/80 bg-surface/95 backdrop-blur-xl shadow-2xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className={`relative flex flex-col items-center justify-center rounded-2xl py-1.5 px-3 transition-all duration-200 ${
                active
                  ? "text-primary font-black scale-105"
                  : "text-muted hover:text-primary font-medium"
              }`}
            >
              {/* Active illuminated indicator */}
              {active && (
                <span className="absolute -top-2 size-1.5 rounded-full bg-accent animate-pulse" />
              )}

              <div
                className={`grid size-9 place-items-center rounded-xl transition-colors ${
                  active
                    ? "bg-primary text-accent shadow-sm"
                    : "bg-transparent text-muted"
                }`}
              >
                <Icon className="size-4.5" />
              </div>

              <span className="mt-0.5 text-[10px] tracking-tight">
                {item.label}
              </span>

              {item.badge && (
                <span className="absolute top-1 right-2 flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
