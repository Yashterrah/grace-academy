import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ResourceFilterGrid } from "@/components/resources/ResourceFilterGrid";
import { getResources } from "@/firebase/firestore";
import { SEED_RESOURCES } from "@/lib/seed-data";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Resource Center",
  description:
    "Free fingering charts, set-piece guides, folksong lyrics and warm-up routines for CBC and 8-4-4 music students, grade by grade.",
  path: "/resources",
});

export const revalidate = 3600;

export default async function ResourcesPage() {
  const items = await getResources();
  const resources = items.length > 0 ? items : SEED_RESOURCES;

  return (
    <>
      <PageHero
        eyebrow="Resource Center"
        title="Practice material for every grade"
        description="Fingering charts, set-piece guides, folksong lyrics and warm-up routines — filter by grade to find what your lesson needs."
      />

      <Section tone="light">
        <Container>
          <ResourceFilterGrid resources={resources} />
        </Container>
      </Section>
    </>
  );
}
