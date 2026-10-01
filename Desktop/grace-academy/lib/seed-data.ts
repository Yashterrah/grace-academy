/**
 * lib/seed-data.ts
 * Fallback content shown when Firestore collections are still empty.
 * Replace these with real Firestore documents once you have actual content.
 */
import type { Testimonial, GalleryItem, Resource, BlogPost } from "@/types";

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
  {
    id: "seed-g1",
    title: "Grade 6 Choral Practice",
    imageUrl: "/gallery/choir-1.jpg",
    category: "choir",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-g2",
    title: "Recorder Ensemble Session",
    imageUrl: "/gallery/instrumental-1.jpg",
    category: "classroom",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-g3",
    title: "KCSE Music Festival",
    imageUrl: "/gallery/recital-1.jpg",
    category: "recital",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-g4",
    title: "Set Piece Coaching",
    imageUrl: "/gallery/classroom-1.jpg",
    category: "classroom",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-g5",
    title: "End of Term Recital",
    imageUrl: "/gallery/recital-2.jpg",
    category: "recital",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-g6",
    title: "Folksongs Workshop",
    imageUrl: "/gallery/event-1.jpg",
    category: "event",
    createdAt: new Date().toISOString(),
  },
];

export const SEED_RESOURCES: Resource[] = [
  {
    id: "seed-r1",
    title: "Grade 4 Recorder Fingering Chart",
    description:
      "A printable fingering chart covering all Grade 4 recorder notes — ideal for students just starting out.",
    grade: "grade4",
    // Real publicly accessible PDF via KNEC/KIE resources — replace with Grace's own materials
    fileUrl:
      "https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0065408",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r2",
    title: "KCSE Set Piece Listening Guide",
    description:
      "Notes and listening cues for this year's KCSE set piece. Covers structure, mood, and key performance points.",
    grade: "grade9",
    fileUrl:
      "https://www.knec.ac.ke/syllabuses/music",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r3",
    title: "Folksong Lyrics & Translations",
    description:
      "Lyrics with meaning and pronunciation notes for common CBC folksongs. Useful for all grades.",
    grade: "all",
    fileUrl:
      "https://www.kicd.ac.ke/curriculum/",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r4",
    title: "Choral Warm-Up Routine",
    description:
      "A structured 10-minute vocal warm-up routine to use before every choir practice session.",
    grade: "all",
    fileUrl:
      "https://www.youtube.com/results?search_query=choral+warm+up+routine",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r5",
    title: "Grade 6 Music Theory Revision",
    description:
      "Key music theory concepts for Grade 6 students preparing for term-end assessments.",
    grade: "grade6",
    fileUrl:
      "https://www.musictheory.net/lessons",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-r6",
    title: "CBC Music Curriculum Overview",
    description:
      "A summary of what is covered in CBC music for Grades 4–9, useful for parents and students.",
    grade: "all",
    fileUrl:
      "https://www.kicd.ac.ke/curriculum/",
    fileType: "link",
    createdAt: new Date().toISOString(),
  },
];

/**
 * Starter blog articles shown until real posts exist in the Firestore
 * "blog" collection. Fixed dates keep the pages stable between builds.
 */
export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "seed-blog-1",
    title: "How to Prepare for KCSE Music Paper 1",
    slug: "how-to-prepare-kcse-music-paper-1",
    excerpt:
      "Paper 1 covers theory, listening and set pieces. Here is exactly what to focus on in the weeks before your exam.",
    tags: ["KCSE", "Exam preparation", "Music theory"],
    grade: "grade9",
    readingMinutes: 4,
    published: true,
    publishedAt: "2026-08-01T08:00:00.000Z",
    createdAt: "2026-08-01T08:00:00.000Z",
    updatedAt: "2026-08-01T08:00:00.000Z",
    content: `## What is KCSE Music Paper 1?

Paper 1 is the written part of the KCSE Music examination. It tests music theory, analysis of the set pieces, and aural skills.

## How to prepare

### 1. Master the set pieces early
Start in Term 1. Listen to the recordings repeatedly, then use your teacher's listening guide to pick out the key features of each piece.

### 2. Revise theory one topic at a time
Work through intervals, major and minor scales, time signatures and basic harmony. Past papers are the best revision tool.

### 3. Practise aural questions
Listen to similar music and describe what you hear: tempo, dynamics, instruments and mood.

### 4. Do past papers under timed conditions
Once you know the content, practise against the clock. Many candidates underestimate exam pacing.

At Grace Muigai Music Academy, our Grade 9 lessons target exactly these skills in structured weekly sessions.`,
  },
  {
    id: "seed-blog-2",
    title: "What Instruments Does CBC Grade 5 Music Cover?",
    slug: "instruments-cbc-grade-5-music",
    excerpt:
      "The CBC Grade 5 music curriculum introduces several instruments. Here is what your child will learn.",
    tags: ["CBC", "Recorder", "Grade 5"],
    grade: "grade5",
    readingMinutes: 3,
    published: true,
    publishedAt: "2026-08-08T08:00:00.000Z",
    createdAt: "2026-08-08T08:00:00.000Z",
    updatedAt: "2026-08-08T08:00:00.000Z",
    content: `## CBC Grade 5 Music: Instrument Overview

In Grade 5, learners are introduced to several instruments as part of practical music education. The focus is on building foundations, not performance-level mastery.

### The recorder
The recorder is the main instrument in the lower CBC grades. Grade 5 learners work on:
- Correct posture and hand position
- Basic note fingering
- Simple melodies and exercises
- Breath control

### Percussion
Learners explore rhythm with hand drums, shakers and classroom percussion, building rhythmic accuracy and ensemble awareness.

### Voice
Singing is central to CBC music. Grade 5 learners sing folksongs in unison, use call-and-response songs, and begin simple two-part singing.

### What to expect at home
Your child should practise recorder for about 15 minutes a day. A standard descant recorder from any bookshop is all that is needed.`,
  },
  {
    id: "seed-blog-3",
    title: "Folksongs in the CBC Music Curriculum: A Parent's Guide",
    slug: "folksongs-cbc-curriculum-parents-guide",
    excerpt:
      "Folksongs are not just cultural, they are examined. Here is what your child needs to know and how to help them practise.",
    tags: ["Folksongs", "CBC", "Parents"],
    grade: "all",
    readingMinutes: 3,
    published: true,
    publishedAt: "2026-08-15T08:00:00.000Z",
    createdAt: "2026-08-15T08:00:00.000Z",
    updatedAt: "2026-08-15T08:00:00.000Z",
    content: `## Why folksongs matter in CBC Music

Folksongs make up a significant part of the CBC music curriculum in every grade. They matter for three reasons:
- Cultural education: understanding the meaning behind Kenyan musical traditions
- Practical skill: pronunciation, rhythm and expression
- Assessment: folksong performance is assessed in practical exams

## How to help your child practise at home

You do not need to be a musician to help:
- Listen together to recordings of the folksongs being studied
- Sing together. Even imperfect singing builds memory and confidence
- Ask questions such as "What does this song mean?"

## Lessons at Grace Muigai Music Academy

Folksongs are taught with pronunciation guides, cultural context and performance technique. Parents are welcome to sit in on lessons and learn alongside their children.`,
  },
];
