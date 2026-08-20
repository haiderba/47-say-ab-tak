import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Flame, ChevronLeft, ChevronRight, Play, Pause, Radio } from "lucide-react";
import { getAggregatedNews } from "@/lib/news/get-news";
import { NewsArticle } from "@/lib/news/rss.server";

export function NewsTicker() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    getAggregatedNews({ data: "all" })
      .then((res) => {
        if (isMounted && res && res.articles.length > 0) {
          setArticles(res.articles.slice(0, 20));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-run interval (rotates every 3.8s) when not holding or hovered
  useEffect(() => {
    if (articles.length === 0 || isHolding || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [articles.length, isHolding, isHovered]);

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  const handleArticleClick = (e: React.MouseEvent, art: NewsArticle) => {
    e.preventDefault();
    navigate({
      to: "/news",
      search: { story: art.id },
    });
  };

  const toggleHold = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHolding((prev) => !prev);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-30 border-b border-primary/20 bg-[#013516] text-white shadow-sm transition-colors duration-300 select-none"
    >
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-3 sm:px-4 text-xs">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
          </span>
          <span className="flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            <Flame className="size-3 text-yellow-300 animate-pulse" />
            <span>Breaking</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-accent/90">
            <Radio className="size-3" />
            <span>National Wire</span>
          </span>
        </div>

        {/* Middle Headline Cycler with click navigation */}
        <div className="mx-2 sm:mx-4 flex-1 overflow-hidden">
          <div
            onClick={(e) => handleArticleClick(e, currentArticle)}
            title="Click to open full story in newsroom"
            className="group flex cursor-pointer items-center gap-2 truncate transition-all duration-300 hover:text-accent"
          >
            <span className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-accent">
              {currentArticle.site}
            </span>
            <span className="truncate font-medium text-white/95 group-hover:text-yellow-300 group-hover:underline">
              {currentArticle.title}
            </span>
          </div>
        </div>

        {/* Right Controls, Hold Button & Counter */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Hold / Auto-Run Toggle Button */}
          <button
            type="button"
            onClick={toggleHold}
            title={isHolding ? "Click to resume auto-run" : "Click to hold / pause ticker"}
            className={
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all border " +
              (isHolding
                ? "bg-yellow-400 text-black border-yellow-300 shadow-sm"
                : "bg-white/10 hover:bg-white/20 text-white/80 border-white/10")
            }
          >
            {isHolding ? (
              <>
                <Pause className="size-2.5 fill-current" />
                <span>HELD</span>
              </>
            ) : (
              <>
                <Play className="size-2.5 fill-current" />
                <span>AUTO</span>
              </>
            )}
          </button>

          <span className="font-mono text-[10px] text-white/60 hidden sm:inline">
            {currentIndex + 1}/{articles.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)}
            aria-label="Previous headline"
            className="grid size-6 place-items-center rounded hover:bg-white/10 text-white/70 hover:text-white"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % articles.length)}
            aria-label="Next headline"
            className="grid size-6 place-items-center rounded hover:bg-white/10 text-white/70 hover:text-white"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
