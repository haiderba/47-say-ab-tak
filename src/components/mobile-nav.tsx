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
      badge: true,
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
      className="fixed bottom-0 inset-x-0 z-50 block md:hidden bg-surface/95 border-t border-border/80 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl"
      style={{
        paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              preload="intent"
              className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 outline-none select-none ${
                active ? "text-primary" : "text-muted hover:text-primary"
              }`}
            >
              {/* Active illuminated top line */}
              {active && (
                <span className="absolute -top-1 h-0.5 w-6 rounded-full bg-primary animate-in fade-in duration-200" />
              )}

              <div
                className={`relative grid size-8 place-items-center rounded-xl transition-all ${
                  active
                    ? "bg-primary text-[#ffe066] shadow-sm font-bold scale-105"
                    : "bg-transparent text-muted"
                }`}
              >
                <Icon className="size-4.5" />
                {item.badge && !active && (
                  <span className="absolute top-1 right-1 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  active ? "font-black text-primary" : "font-medium text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
