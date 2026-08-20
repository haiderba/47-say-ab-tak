export const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  "Breaking News": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop",
  "National": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop",
  "Legal & Courts": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
  "Economy & Trade": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
  "Citizen & Tech": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  "Official Announcement": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
};

export function getCategoryFallbackImage(cat?: string | null): string {
  if (cat && cat in CATEGORY_DEFAULT_IMAGES) {
    return CATEGORY_DEFAULT_IMAGES[cat];
  }
  return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop";
}
