import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { CATEGORIES, GUIDES, DISCLAIMER, TIMELINE, NEWS } from "@/lib/static-data";

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
};

export type GuideListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  department: string;
  difficulty: string;
  processing_time: string;
  category_slug: string;
  category_name: string;
};

export type GuideDetail = GuideListItem & {
  biometric: string;
  last_updated: string;
  disclaimer: string;
  documents: { section: string; item: string }[];
  steps: { step_number: number; title: string; body: string }[];
  mistakes: string[];
};

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  published_at: string;
};

export type TimelineEvent = {
  id: number;
  year_label: string;
  title: string;
  body: string;
};

// Pre-compiled fast in-memory structures for instant zero-latency page loading (<1ms)
const staticCategories: Category[] = CATEGORIES.map((c, i) => ({
  id: i + 1,
  slug: c.slug,
  name: c.name,
  description: c.description,
  icon: c.icon,
  sort_order: c.sort,
}));

const staticGuidesList: GuideListItem[] = GUIDES.map((g, i) => {
  const cat = CATEGORIES.find((c) => c.slug === g.category) || CATEGORIES[0];
  return {
    id: i + 1,
    slug: g.slug,
    title: g.title,
    summary: g.summary,
    department: g.department,
    difficulty: g.difficulty,
    processing_time: g.processing,
    category_slug: g.category,
    category_name: cat.name,
  };
});

const staticGuidesMap = new Map<string, GuideDetail>();
for (let i = 0; i < GUIDES.length; i++) {
  const seedGuide = GUIDES[i];
  const cat = CATEGORIES.find((c) => c.slug === seedGuide.category) || CATEGORIES[0];
  staticGuidesMap.set(seedGuide.slug, {
    id: i + 1,
    slug: seedGuide.slug,
    title: seedGuide.title,
    summary: seedGuide.summary,
    department: seedGuide.department,
    difficulty: seedGuide.difficulty,
    processing_time: seedGuide.processing,
    category_slug: seedGuide.category,
    category_name: cat.name,
    biometric: seedGuide.biometric,
    last_updated: seedGuide.updated,
    disclaimer: seedGuide.disclaimer || DISCLAIMER,
    documents: seedGuide.docs,
    steps: seedGuide.steps.map((s, idx) => ({ step_number: idx + 1, title: s.title, body: s.body })),
    mistakes: seedGuide.mistakes,
  });
}

const staticTimeline: TimelineEvent[] = TIMELINE.map((t, i) => ({
  id: i + 1,
  year_label: t.year,
  title: t.title,
  body: t.body,
}));

const staticNews: NewsItem[] = NEWS.map((n, i) => ({
  id: i + 1,
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  body: n.body,
  tag: n.tag,
  published_at: n.published_at,
}));

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  return staticCategories;
});

export const listGuides = createServerFn({ method: "GET" }).handler(async () => {
  return staticGuidesList;
});

export const getGuidesByCategory = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const cat = staticCategories.find((c) => c.slug === slug) || null;
    const guides = staticGuidesList.filter((g) => g.category_slug === slug);
    return { category: cat, guides };
  });

export const getGuide = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return staticGuidesMap.get(slug) || null;
  });

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  return staticNews;
});

export const getNews = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return staticNews.find((n) => n.slug === slug) || null;
  });

export const listTimeline = createServerFn({ method: "GET" }).handler(async () => {
  return staticTimeline;
});

export const getSavedChecksForGuide = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((guideSlug: string) => guideSlug)
  .handler(async ({ context, data: guideSlug }) => {
    try {
      const sql = await getSql();
      const rows = await sql<{ item_key: string }>`
        select item_key from saved_checks
        where user_id = ${context.userId} and guide_slug = ${guideSlug}
      `;
      return rows.map((r) => r.item_key);
    } catch {
      return [];
    }
  });

export const listSavedChecks = getSavedChecksForGuide;

export const toggleSavedCheck = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { guideSlug: string; itemKey: string; checked: boolean }) => d)
  .handler(async ({ context, data }) => {
    try {
      const sql = await getSql();
      if (data.checked) {
        await sql`
          insert into saved_checks (user_id, guide_slug, item_key)
          values (${context.userId}, ${data.guideSlug}, ${data.itemKey})
          on conflict do nothing
        `;
      } else {
        await sql`
          delete from saved_checks
          where user_id = ${context.userId} and guide_slug = ${data.guideSlug} and item_key = ${data.itemKey}
        `;
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  });
