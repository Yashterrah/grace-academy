import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryItems } from "@/firebase/firestore";
import { SEED_GALLERY } from "@/lib/seed-data";
import { pageSeo } from "@/utils/seo";

export const metadata = pageSeo({
  title: "Gallery",
  description:
    "Photos from recitals, choir practice, exam preparation and classroom sessions at Grace Muigai Music Academy.",
  path: "/gallery",
});

export const revalidate = 3600;

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const galleryItems = items.length > 0 ? items : SEED_GALLERY;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the classroom and the stage"
        description="A look at recitals, choir sessions, exam preparation and everyday lessons from across the academy."
      />

      <Section tone="light">
        <Container>
          <GalleryGrid items={galleryItems} />
        </Container>
      </Section>
    </>
  );
}
