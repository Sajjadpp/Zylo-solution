import Link from "next/link";
import { Clock } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { formatDate, readingTime } from "@/lib/utils";
import type { PostDoc } from "@/types";

export function PostCard({ post, priority }: { post: PostDoc; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card/60 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
    >
      <CoverImage
        src={post.coverImage}
        alt={post.title}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        priority={priority}
        className="aspect-[16/9]"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt)}</time>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden /> {readingTime(post.content || post.excerpt)} min read
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        {post.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
