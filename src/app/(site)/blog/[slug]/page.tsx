import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CoverImage } from "@/components/ui/CoverImage";
import { Markdown } from "@/components/ui/Markdown";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PostCard } from "@/components/cards/PostCard";
import { DemoButton } from "@/components/booking/DemoButton";
import { FinalCta } from "@/components/home/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPost, getPosts, getSettings } from "@/lib/content";
import { articleLd, buildMetadata, faqLd } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    path: `/blog/${p.slug}`,
    image: p.coverImage,
    type: "article",
    publishedTime: new Date(p.publishedAt).toISOString(),
    modifiedTime: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
    keywords: p.tags,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[articleLd(post), faqLd(post.faqs)]} />
      <PageHeader
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
        eyebrow={post.tags[0]}
        title={post.title}
        description={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span>By {post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDate(post.publishedAt, { dateStyle: "long" })}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {readingTime(post.content)} min read
            </span>
          </div>
        }
      />

      <article className="container max-w-3xl pb-16">
        {post.coverImage && (
          <CoverImage src={post.coverImage} alt={post.title} sizes="(min-width: 768px) 768px, 100vw" priority className="mb-12 aspect-[16/9] rounded-[24px] border border-line" />
        )}
        <p className="mb-10 border-l-2 border-primary pl-5 text-lg leading-relaxed text-ink/90">{post.excerpt}</p>
        <Markdown>{post.content}</Markdown>

        {post.faqs.length > 0 && (
          <section aria-labelledby="post-faq" className="mt-16">
            <h2 id="post-faq" className="text-2xl font-bold">
              Frequently asked questions
            </h2>
            <FaqAccordion faqs={post.faqs} className="mt-6" />
          </section>
        )}

        <div className="mt-14 flex flex-col items-start gap-4 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-card p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">Have a question about your setup?</p>
            <p className="mt-1 text-sm text-muted">Talk to our team in Manama. Free, no obligation.</p>
          </div>
          <DemoButton className="shrink-0">Book a Demo</DemoButton>
        </div>
      </article>

      {more.length > 0 && (
        <section className="pb-12">
          <div className="container">
            <h2 className="text-2xl font-bold">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <FinalCta whatsapp={settings.whatsapp} />
    </>
  );
}
