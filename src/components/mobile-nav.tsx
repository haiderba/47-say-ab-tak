import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  History,
  Home,
  Lock,
  Newspaper,
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
    <nav
      className="fixed bottom-0 inset-x-0 z-50 block md:hidden bg-surface/98 border-t border-border shadow-[0_-8px_25px_rgba(0,0,0,0.1)] backdrop-blur-2xl"
      style={{
        paddingBottom: "max(0.4rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className={`relative flex flex-col items-center justify-center rounded-xl py-1 px-3 transition-all duration-200 ${
                active
                  ? "text-primary font-black scale-105"
                  : "text-muted hover:text-primary font-medium"
              }`}
            >
              {/* Active illuminated top bar */}
              {active && (
                <span className="absolute -top-1.5 h-1 w-6 rounded-full bg-primary" />
              )}

              <div
                className={`grid size-8 place-items-center rounded-xl transition-all ${
                  active
                    ? "bg-primary text-accent shadow-sm"
                    : "bg-transparent text-muted"
                }`}
              >
                <Icon className="size-4.5" />
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  active ? "text-primary font-black" : "text-muted"
                }`}
              >
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
