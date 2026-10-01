import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/firebase/firestore";
import { SITE, GRADE_SCHEDULE } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | ${SITE.name}`,
      description: post.excerpt,
      type: "article",
    },
  };
}

export const revalidate = 3600;

/** Escape text before it is placed inside HTML — post content is never trusted as markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const gradeLabel =
    !post.grade || post.grade === "all"
      ? "All grades"
      : GRADE_SCHEDULE.find((g) => g.key === post.grade)?.label ?? post.grade;

  // Convert the plain-text markdown-style content into basic HTML paragraphs.
  // For a production blog you'd use a proper markdown renderer — this is a
  // lightweight fallback that handles headings (##) and paragraphs.
  const contentHtml = post.content
    .split("\n")
    .map((rawLine) => {
      const line = esc(rawLine);
      if (line.startsWith("## "))
        return `<h2 class="mt-8 mb-3 font-display text-xl text-ink">${line.slice(3)}</h2>`;
      if (line.startsWith("### "))
        return `<h3 class="mt-6 mb-2 font-display text-lg text-ink">${line.slice(4)}</h3>`;
      if (line.startsWith("- "))
        return `<li class="ml-5 list-disc text-ink-soft">${line.slice(2)}</li>`;
      if (line.startsWith("**") && line.endsWith("**"))
        return `<strong>${line.slice(2, -2)}</strong>`;
      if (line.trim() === "") return "<br/>";
      return `<p class="text-ink-soft leading-relaxed">${line}</p>`;
    })
    .join("\n");

  return (
    <>
      <div className="bg-grace-mesh pb-12 pt-32 text-cream-50 sm:pt-40">
        <Container>
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-cream-100/70 hover:text-cream-50"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <Badge tone="teal" className="mb-4">
            {gradeLabel}
          </Badge>
          <h1 className="max-w-2xl font-display text-3xl font-medium sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-cream-100/60">
            By Tr. Grace Muigai ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </Container>
      </div>

      <Section tone="light">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div
              className="prose-sm sm:prose prose-headings:font-display prose-headings:text-ink prose-p:text-ink-soft prose-li:text-ink-soft"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            <div className="mt-12 rounded-xl2 border border-teal-100 bg-teal-50 p-6">
              <p className="font-display text-lg text-ink">
                Ready to start learning?
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Join Grace Muigai Music Academy for structured online music
                lessons — CBC and 8-4-4 curriculum, Grades 4 to 9.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/register" size="sm">
                  Register Now
                </Button>
                <Button href="/courses" variant="secondary" size="sm">
                  View All Courses
                </Button>
              </div>
            </div>

            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
