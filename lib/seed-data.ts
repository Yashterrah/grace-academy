/**
 * lib/seed-data.ts
 * Fallback content shown when Firestore collections are still empty
 * (e.g. right after deployment, before the admin has added real
 * testimonials/gallery/resources). Structured so it can be copy-pasted
 * straight into Firestore as seed documents once the project is live.
 */
import type { Testimonial, GalleryItem, Resource } from "@/types";

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-1",
    name: "Wanjiru K.",
    role: "Parent, Grade 6 student",
    message:
      "My daughter used to dread her music set piece. After a term with Tr. Grace she performed it confidently at her school's music festival and made it to the zonal round.",
    rating: 5,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Brian M.",
    role: "Grade 9 student",
    message:
      "The online recorder lessons were easy to follow even though we were miles apart. Tr. Grace explains everything step by step and is very patient.",
    rating: 5,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "Njeri W.",
    role: "Parent, Grade 4 student",
    message:
      "Booking a lesson took two minutes and the class time was confirmed instantly. My son looks forward to his 9am lesson every day.",
    rating: 5,
    approved: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    name: "Samuel O.",
    role: "Grade 8 student, KCSE choral music",
    message:
      "Choral music felt impossible until Tr. Grace broke down the harmony parts for us individually. Our group's confidence went up a lot.",
    rating: 4,
    approved: true,
    createdAt: new Date().toISOString(),
  },
];

export const SEED_GALLERY: GalleryItem[] = [
  { id: "seed-g1", title: "Grade 6 choral practice", imageUrl: "/gallery/choir-1.jpg", category: "choir", createdAt: new Date().toISOString() },
  { id: "seed-g2", title: "Recorder ensemble session", imageUrl: "/gallery/instrumental-1.jpg", category: "classroom", createdAt: new Date().toISOString() },
  { id: "seed-g3", title: "KCSE music festival", imageUrl: "/gallery/recital-1.jpg", category: "recital", createdAt: new Date().toISOString() },
  { id: "seed-g4", title: "Set piece coaching", imageUrl: "/gallery/classroom-1.jpg", category: "classroom", createdAt: new Date().toISOString() },
  { id: "seed-g5", title: "End of term recital", imageUrl: "/gallery/recital-2.jpg", category: "recital", createdAt: new Date().toISOString() },
  { id: "seed-g6", title: "Folksongs workshop", imageUrl: "/gallery/event-1.jpg", category: "event", createdAt: new Date().toISOString() },
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: "seed-r1",
    title: "Grade 4 Recorder Fingering Chart",
    description: "A printable fingering chart covering all Grade 4 recorder notes.",
    grade: "grade4",
    fileUrl: "#",
    fileType: "pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r2",
    title: "KCSE Set Piece Listening Guide",
    description: "Notes and listening cues for this year's KCSE set piece.",
    grade: "grade9",
    fileUrl: "#",
    fileType: "pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r3",
    title: "Folksong Lyrics & Translations",
    description: "Lyrics with meaning and pronunciation notes for common folksongs.",
    grade: "all",
    fileUrl: "#",
    fileType: "pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r4",
    title: "Choral Warm-Up Routine (Audio)",
    description: "A 10-minute vocal warm-up track to use before every practice.",
    grade: "all",
    fileUrl: "#",
    fileType: "audio",
    createdAt: new Date().toISOString(),
  },
];
