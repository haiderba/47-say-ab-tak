import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getNews } from "@/lib/content";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const post = await getNews({ data: params.slug });
    if (!post) throw notFound();
    return { post };
  },
  component: NewsPost,
});

function NewsPost() {
  const { post } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/news" className="text-sm text-primary">
        ← All news
      </Link>
      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <span className="rounded-full bg-surface px-2 py-0.5 font-medium text-primary">{post.tag}</span>
        <time>{post.published_at}</time>
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold text-primary">{post.title}</h1>
      <p className="mt-6 leading-relaxed text-fg">{post.body}</p>
    </article>
  );
}
