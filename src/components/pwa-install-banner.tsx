import { useEffect, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA app mode
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone)
    ) {
      setIsStandalone(true);
      return;
    }

    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : "";
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 rounded-3xl border-2 border-primary/40 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary p-2 shadow-md">
            <img src="/logo.png" alt="47 Say Ab Tak App" className="h-full w-full object-contain" />
          </div>
          <div>
            <h4 className="text-xs font-black text-primary">47 Say Ab Tak Mobile App</h4>
            <p className="text-[11px] text-muted">Install offline citizen vault &amp; real-time news</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isIos ? (
            <div className="flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary">
              <Share className="size-3" /> Add to Home
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-accent hover:bg-primary-light transition-colors shadow-sm"
            >
              <Download className="size-3.5" /> Install App
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowPrompt(false)}
            className="grid size-7 place-items-center rounded-full text-muted hover:bg-bg hover:text-primary transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
