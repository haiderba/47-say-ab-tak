import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed, CATEGORIES, GUIDES, DISCLAIMER } from "@/lib/seed";

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

const contentCache = {
  categories: null as Category[] | null,
  guides: null as GuideListItem[] | null,
  categoryGuides: new Map<string, { category: Category | null; guides: GuideListItem[] }>(),
  guideDetails: new Map<string, GuideDetail>(),
  news: null as NewsItem[] | null,
  timeline: null as TimelineEvent[] | null,
};

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.categories) return contentCache.categories;
  try {
    await ensureSeed();
    const sql = await getSql();
    const res = await sql<Category>`select id, slug, name, description, icon, sort_order from categories order by sort_order`;
    if (res && res.length > 0) {
      contentCache.categories = res;
      return res;
    }
  } catch (e) {
    console.warn("Using static categories fallback:", (e as Error).message);
  }
  contentCache.categories = staticCategories;
  return staticCategories;
});

export const listGuides = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.guides) return contentCache.guides;
  try {
    await ensureSeed();
    const sql = await getSql();
    const res = await sql<GuideListItem>`
      select g.id, g.slug, g.title, g.summary, g.department, g.difficulty, g.processing_time,
             c.slug as category_slug, c.name as category_name
      from guides g
      join categories c on c.id = g.category_id
      order by c.sort_order, g.id
    `;
    if (res && res.length > 0) {
      contentCache.guides = res;
      return res;
    }
  } catch (e) {
    console.warn("Using static guides fallback:", (e as Error).message);
  }
  contentCache.guides = staticGuidesList;
  return staticGuidesList;
});

export const getGuidesByCategory = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (contentCache.categoryGuides.has(slug)) {
      return contentCache.categoryGuides.get(slug)!;
    }
    try {
      await ensureSeed();
      const sql = await getSql();
      const cat = await sql<Category>`select id, slug, name, description, icon, sort_order from categories where slug = ${slug}`;
      if (cat[0]) {
        const guides = await sql<GuideListItem>`
          select g.id, g.slug, g.title, g.summary, g.department, g.difficulty, g.processing_time,
                 c.slug as category_slug, c.name as category_name
          from guides g
          join categories c on c.id = g.category_id
          where c.slug = ${slug}
          order by g.id
        `;
        const res = { category: cat[0], guides };
        contentCache.categoryGuides.set(slug, res);
        return res;
      }
    } catch (e) {
      console.warn("Using static categoryGuides fallback:", (e as Error).message);
    }
    const cat = staticCategories.find((c) => c.slug === slug) || null;
    const guides = staticGuidesList.filter((g) => g.category_slug === slug);
    const res = { category: cat, guides };
    contentCache.categoryGuides.set(slug, res);
    return res;
  });

export const getGuide = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (contentCache.guideDetails.has(slug)) {
      return contentCache.guideDetails.get(slug)!;
    }
    try {
      await ensureSeed();
      const sql = await getSql();
      const rows = await sql<
        GuideListItem & { biometric: string; last_updated: string; disclaimer: string }
      >`
        select g.id, g.slug, g.title, g.summary, g.department, g.difficulty, g.processing_time,
               g.biometric, g.last_updated, g.disclaimer,
               c.slug as category_slug, c.name as category_name
        from guides g
        join categories c on c.id = g.category_id
        where g.slug = ${slug}
      `;
      const g = rows[0];
      if (g) {
        const documents = await sql<{ section: string; item: string }>`
          select section, item from guide_documents where guide_id = ${g.id} order by sort_order
        `;
        const steps = await sql<{ step_number: number; title: string; body: string }>`
          select step_number, title, body from guide_steps where guide_id = ${g.id} order by step_number
        `;
        const mistakes = await sql<{ item: string }>`
          select item from guide_mistakes where guide_id = ${g.id} order by sort_order
        `;
        const detail: GuideDetail = {
          ...g,
          documents,
          steps,
          mistakes: mistakes.map((m) => m.item),
        };
        contentCache.guideDetails.set(slug, detail);
        return detail;
      }
    } catch (e) {
      console.warn("Using static guideDetail fallback:", (e as Error).message);
    }

    // Static fallback
    const seedGuide = GUIDES.find((g) => g.slug === slug);
    if (!seedGuide) return null;
    const cat = CATEGORIES.find((c) => c.slug === seedGuide.category) || CATEGORIES[0];
    const detail: GuideDetail = {
      id: 1,
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
    };
    contentCache.guideDetails.set(slug, detail);
    return detail;
  });

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.news) return contentCache.news;
  try {
    await ensureSeed();
    const sql = await getSql();
    const res = await sql<NewsItem>`select id, slug, title, excerpt, body, tag, published_at from news_posts order by id desc`;
    if (res && res.length > 0) {
      contentCache.news = res;
      return res;
    }
  } catch (e) {
    console.warn("News fallback");
  }
  return [];
});

export const getNews = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      await ensureSeed();
      const sql = await getSql();
      const rows = await sql<NewsItem>`select id, slug, title, excerpt, body, tag, published_at from news_posts where slug = ${slug}`;
      return rows[0] ?? null;
    } catch {
      return null;
    }
  });

export const listTimeline = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.timeline) return contentCache.timeline;
  try {
    await ensureSeed();
    const sql = await getSql();
    const res = await sql<TimelineEvent>`select id, year_label, title, body from timeline_events order by sort_order`;
    if (res && res.length > 0) {
      contentCache.timeline = res;
      return res;
    }
  } catch {
    // fallback
  }
  return [];
});

export const listSavedChecks = createServerFn({ method: "GET" })
  .validator((guideSlug: string) => guideSlug)
  .middleware([authMiddleware])
  .handler(async ({ context, data: guideSlug }) => {
    try {
      const sql = await getSql();
      const rows = await sql<{ check_key: string }>`
        select check_key from checklist_items
        where user_id = ${context.userId} and guide_slug = ${guideSlug}
      `;
      return rows.map((r) => r.check_key);
    } catch {
      return [];
    }
  });

export const toggleSavedCheck = createServerFn({ method: "POST" })
  .validator((d: { guideSlug: string; checkKey: string; checked: boolean }) => d)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    try {
      const sql = await getSql();
      if (data.checked) {
        await sql`
          insert into checklist_items (user_id, guide_slug, check_key)
          values (${context.userId}, ${data.guideSlug}, ${data.checkKey})
          on conflict do nothing
        `;
      } else {
        await sql`
          delete from checklist_items
          where user_id = ${context.userId}
            and guide_slug = ${data.guideSlug}
            and check_key = ${data.checkKey}
        `;
      }
      return { ok: true };
    } catch {
      return { ok: true };
    }
  });
