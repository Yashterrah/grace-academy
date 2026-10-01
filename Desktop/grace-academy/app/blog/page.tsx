import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { listBlogPosts } from "@/firebase/firestore";
import { pageSeo } from "@/utils/seo";
import { Clock, Tag } from "lucide-react";

export const metadata = pageSeo({
  title: "Music Learning Blog",
  description: "Guides on KCSE music preparation, CBC curriculum instruments, folksong techniques and more — from Tr. Grace Muigai.",
  path: "/blog",
});

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await listBlogPosts(true);
  return (
    <>
      <PageHero
        eyebrow="Music Learning Blog"
        title="Guides for students, parents & teachers"
        description="Practical advice on KCSE preparation, CBC curriculum, instruments, and making the most of online music lessons."
      />
      <Section tone="light">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-ink-faint">No articles published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl2 border border-ink/[0.06] bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                          <Tag className="h-3 w-3" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-display text-lg text-ink transition-colors group-hover:text-teal-700">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-faint">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-faint">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} min read · {new Date(post.publishedAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
