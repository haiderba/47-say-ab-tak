import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureSeed } from "@/lib/seed";

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
  await ensureSeed();
  const sql = await getSql();
  const res = await sql<Category>`select id, slug, name, description, icon, sort_order from categories order by sort_order`;
  contentCache.categories = res;
  return res;
});

export const listGuides = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.guides) return contentCache.guides;
  await ensureSeed();
  const sql = await getSql();
  const res = await sql<GuideListItem>`
    select g.id, g.slug, g.title, g.summary, g.department, g.difficulty, g.processing_time,
           c.slug as category_slug, c.name as category_name
    from guides g
    join categories c on c.id = g.category_id
    order by c.sort_order, g.id
  `;
  contentCache.guides = res;
  return res;
});

export const getGuidesByCategory = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (contentCache.categoryGuides.has(slug)) {
      return contentCache.categoryGuides.get(slug)!;
    }
    await ensureSeed();
    const sql = await getSql();
    const cat = await sql<Category>`select id, slug, name, description, icon, sort_order from categories where slug = ${slug}`;
    if (!cat[0]) {
      const empty = { category: null as Category | null, guides: [] as GuideListItem[] };
      return empty;
    }
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
  });

export const getGuide = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (contentCache.guideDetails.has(slug)) {
      return contentCache.guideDetails.get(slug)!;
    }
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
    if (!g) return null;
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
  });

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.news) return contentCache.news;
  await ensureSeed();
  const sql = await getSql();
  const res = await sql<NewsItem>`select id, slug, title, excerpt, body, tag, published_at from news_posts order by id desc`;
  contentCache.news = res;
  return res;
});

export const getNews = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<NewsItem>`select id, slug, title, excerpt, body, tag, published_at from news_posts where slug = ${slug}`;
    return rows[0] ?? null;
  });

export const listTimeline = createServerFn({ method: "GET" }).handler(async () => {
  if (contentCache.timeline) return contentCache.timeline;
  await ensureSeed();
  const sql = await getSql();
  const res = await sql<TimelineEvent>`select id, year_label, title, body from timeline_events order by sort_order`;
  contentCache.timeline = res;
  return res;
});

export const listSavedChecks = createServerFn({ method: "GET" })
  .validator((guideSlug: string) => guideSlug)
  .middleware([authMiddleware])
  .handler(async ({ context, data: guideSlug }) => {
    const sql = await getSql();
    const rows = await sql<{ item_key: string }>`
      select item_key from saved_checks where user_id = ${context.userId} and guide_slug = ${guideSlug}
    `;
    return rows.map((r) => r.item_key);
  });

export const toggleSavedCheck = createServerFn({ method: "POST" })
  .validator((input: { guideSlug: string; itemKey: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ id: number }>`
      select id from saved_checks
      where user_id = ${context.userId} and guide_slug = ${data.guideSlug} and item_key = ${data.itemKey}
    `;
    if (existing[0]) {
      await sql`delete from saved_checks where id = ${existing[0].id} and user_id = ${context.userId}`;
      return { saved: false };
    }
    await sql`insert into saved_checks (user_id, guide_slug, item_key)
      values (${context.userId}, ${data.guideSlug}, ${data.itemKey})`;
    return { saved: true };
  });
