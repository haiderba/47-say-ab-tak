import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CategoryIcon } from "@/components/icons";
import { getGuidesByCategory } from "@/lib/content";

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const data = await getGuidesByCategory({ data: params.slug });
    if (!data.category) throw notFound();
    return data;
  },
  component: CategoryPage,
});

function CategoryPage() {
  const data = Route.useLoaderData();
  const category = data?.category;
  const guides = data?.guides ?? [];
  if (!category) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-2xl bg-surface text-primary shadow-card">
          <CategoryIcon name={category.icon} className="size-7" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold text-primary">{category.name}</h1>
          <p className="mt-1 text-muted">{category.description}</p>
        </div>
      </div>
      <div className="grid gap-4">
        {guides.map((g) => (
          <Link
            key={g.slug}
            to="/guides/$slug"
            params={{ slug: g.slug }}
            className="rounded-xl border border-border bg-surface p-6 shadow-card"
          >
            <h2 className="text-xl font-semibold text-primary">{g.title}</h2>
            <p className="mt-2 text-sm text-muted">{g.summary}</p>
            <p className="mt-3 text-xs text-muted">
              {g.processing_time} · {g.difficulty}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
