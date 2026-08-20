import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";
import { PwaInstallBanner } from "@/components/pwa-install-banner";
import { MobileNav } from "@/components/mobile-nav";
import { NewsTicker } from "@/components/news-ticker";
import { AdUnit } from "@/components/ads/ad-unit";
import { listCategories, listGuides } from "@/lib/content";
import appCss from "../styles.css?url";

const APP_NAME = "47 Say Ab Tak";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host ? `https://${host}/og.jpg` : undefined;
const xBanner = host
  ? `https://og.grok.me/v1/banner.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}&color=01411C`
  : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "From 1947 till now — clear department-wise guidance on Pakistani government documents, steps, and common mistakes.",
      },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#01411C" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
      ...(xBanner
        ? [
            { property: "x:game:image", content: xBanner },
            { property: "x:game:image:width", content: "1200" },
            { property: "x:game:image:height", content: "264" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://47sayabtak.com/#website",
              "url": "https://47sayabtak.com/",
              "name": "47 Say Ab Tak — Pakistan Citizen Documentation & Governance Portal",
              "description": "Comprehensive legal procedures, step-by-step document issuance guides, verified national news, and historical documentation evolution in Pakistan (1947–2026).",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://47sayabtak.com/guides?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              "inLanguage": ["en-PK", "ur-PK"],
            },
            {
              "@type": "Organization",
              "@id": "https://47sayabtak.com/#organization",
              "name": "47 Say Ab Tak",
              "url": "https://47sayabtak.com/",
              "logo": "https://47sayabtak.com/logo.png",
              "sameAs": [
                "https://github.com/haiderba/47-say-ab-tak",
                "https://twitter.com/47sayabtak",
              ],
            },
          ],
        }),
      },
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6963163931040692",
        crossOrigin: "anonymous",
      },
      {
        children: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }); }`,
      },
    ],
  }),
  component: Root,
});

function Root() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <html lang="en" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg text-fg pb-16 md:pb-0">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <NewsTicker />
            <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
            <MobileNav />
            <CommandPalette
              open={searchOpen}
              setOpen={setSearchOpen}
            />
            <PwaInstallBanner />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

