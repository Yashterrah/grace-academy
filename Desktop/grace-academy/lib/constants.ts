/**
 * lib/constants.ts
 * Single source of truth for ALL business rules.
 * Change values here and they propagate across the whole site —
 * booking form, fee tables, receipts, admin dashboard, M-Pesa page, etc.
 */

export const SITE = {
  name: "Grace Muigai Music Academy",
  shortName: "GMMA",
  tagline: "Where every learner finds their voice, their rhythm, their grade.",
  description:
    "Online CBC & 8-4-4 music lessons with Tr. Grace Muigai — Grades 4 to 9. Set pieces, folksongs, choral and instrumental music, taught by a trained, experienced high school music teacher in Kenya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tutor-grace.vercel.app",
  locale: "en_KE",
  themeColor: "#0B4F4A",
} as const;

export const TEACHER = {
  name: "Tr. Grace Muigai",
  title: "Music Teacher — CBC & 8-4-4 Curriculum",
  bio: "A trained high school music teacher who prepares candidates for exams in both the 8-4-4 and CBC curricula — covering set pieces, folksongs, KCSE choral music, and instrumental music such as recorders.",
  bioExtended:
    "Tr. Grace Muigai has spent her career inside the high school music classroom — not behind a desk designing courses she's never taught. Across several leading girls' high schools, she has prepared candidates for KCSE music examinations and guided CBC learners through the full grade-by-grade syllabus, from their very first note to festival-ready performance. Grace Muigai Music Academy brings that same classroom rigor online: structured, curriculum-matched, and built around real teaching experience rather than a generic course.",
  philosophy:
    "\"Every learner already has an ear for music — my job is to give it structure, confidence, and a stage.\"",
  highlights: [
    { label: "Curricula taught", value: "CBC & 8-4-4" },
    { label: "Schools served", value: "6+ high schools" },
    { label: "Grade range", value: "Grade 4 – 9" },
  ],
  education: [
    { level: "KCPE", institution: "Kahuhia Primary School" },
    { level: "KCSE", institution: "Kahuhia Girls High School" },
    { level: "Diploma in Education", institution: "Kagumo Teachers' Training College" },
    { level: "Ongoing studies", institution: "Kenyatta University" },
  ],
  experience: [
    { school: "St. Francis Mang'u Girls" },
    { school: "Kangubiri Girls High School" },
    { school: "Giakanja High School" },
    { school: "Birithia Girls High School" },
    { school: "Dr. Kamundia Girls High School" },
    { school: "Wamagana Girls High School", note: "part-time" },
  ] as { school: string; note?: string }[],
  specialties: [
    "Set pieces for Music",
    "Folksongs",
    "KCSE choral music",
    "Instrumental music (e.g. recorders)",
  ],
} as const;

export const CONTACT = {
  phonePrimary: process.env.NEXT_PUBLIC_PHONE_PRIMARY ?? "0702337575",
  phoneSecondary: process.env.NEXT_PUBLIC_PHONE_SECONDARY ?? "0735886920",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "cbc.grace76@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254702337575",
  facebook: "https://www.facebook.com/share/1Qub9b1he3/",
  instagram: "https://www.instagram.com/cbcg_race",
} as const;

export const MPESA = {
  // Confirmed correct Till Number — 4349699 (Buy Goods, business name: Grace)
  tillNumber: process.env.NEXT_PUBLIC_MPESA_TILL_NUMBER ?? "4349699",
  businessName: process.env.NEXT_PUBLIC_MPESA_BUSINESS_NAME ?? "Grace",
  stkPushEnabled: process.env.NEXT_PUBLIC_MPESA_STK_ENABLED === "true",
  paybillInstructions: [
    "Go to M-Pesa on your phone",
    "Select Lipa na M-Pesa",
    "Select Buy Goods and Services",
    `Enter Till Number: ${process.env.NEXT_PUBLIC_MPESA_TILL_NUMBER ?? "4349699"}`,
    "Enter the exact class fee amount",
    "Enter your M-Pesa PIN and confirm",
    "Upload a screenshot of the confirmation message below",
  ],
} as const;

export const TERM = {
  onlineClassesStart: "2026-08-07",
  onlineClassesStartLabel: "7 August",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PRICING
//
// Two pricing tracks per grade:
//   holidayFee   — pay per holiday (one term at a time)
//   bundleFee    — one-time discounted offer covering 3 holidays
//
// Grades 7–9 carry a higher fee because piece recording is included
// in their lessons. This distinction is shown clearly on the courses
// page and in the booking form.
// ─────────────────────────────────────────────────────────────────────────────

export type GradeKey =
  | "grade4"
  | "grade5"
  | "grade6"
  | "grade7"
  | "grade8"
  | "grade9";

export interface GradeSchedule {
  key: GradeKey;
  label: string;
  time: string;
  timeValue: string;
  /** Fee for one holiday (one term) */
  holidayFee: number;
  /** One-time discounted fee covering 3 holidays */
  bundleFee: number;
  /** Computed: how much is saved vs. paying 3 × holidayFee */
  bundleSaving: number;
  /** Legacy alias kept so any code still referencing .fee keeps working */
  fee: number;
  feeLabel: string;
  bundleFeeLabel: string;
  bundleSavingLabel: string;
  day: string;
  /** True for grades where piece recording is included */
  recordingIncluded: boolean;
}

function makeSchedule(
  key: GradeKey,
  label: string,
  time: string,
  timeValue: string,
  holidayFee: number,
  bundleFee: number,
  day: string,
  recordingIncluded = false
): GradeSchedule {
  const bundleSaving = holidayFee * 3 - bundleFee;
  return {
    key,
    label,
    time,
    timeValue,
    holidayFee,
    bundleFee,
    bundleSaving,
    fee: holidayFee, // backward-compat alias
    feeLabel: `KSh ${holidayFee.toLocaleString("en-KE")}`,
    bundleFeeLabel: `KSh ${bundleFee.toLocaleString("en-KE")}`,
    bundleSavingLabel: `KSh ${bundleSaving.toLocaleString("en-KE")}`,
    day,
    recordingIncluded,
  };
}

export const GRADE_SCHEDULE: GradeSchedule[] = [
  makeSchedule("grade4", "Grade 4", "9:00 AM",  "09:00", 2000, 5000,  "Monday – Friday"),
  makeSchedule("grade5", "Grade 5", "10:00 AM", "10:00", 2500, 6000,  "Monday – Friday"),
  makeSchedule("grade6", "Grade 6", "11:00 AM", "11:00", 3000, 8000,  "Monday – Friday"),
  makeSchedule("grade7", "Grade 7", "2:00 PM",  "14:00", 4500, 11000, "Monday – Friday", true),
  makeSchedule("grade8", "Grade 8", "3:00 PM",  "15:00", 4500, 11000, "Monday – Friday", true),
  makeSchedule("grade9", "Grade 9", "4:00 PM",  "16:00", 4500, 11000, "Monday – Friday", true),
];

export const getGradeSchedule = (key: GradeKey | string | undefined) =>
  GRADE_SCHEDULE.find((g) => g.key === key);

// ─────────────────────────────────────────────────────────────────────────────
// ADULT CLASSES
// ─────────────────────────────────────────────────────────────────────────────

export const ADULT_PROGRAM = {
  key: "adult" as const,
  label: "Adult Music Classes",
  tagline: "Exclusive, non-CBC lessons for adult learners",
  sessions: 12,
  fee: 4000,
  feeLabel: "KSh 4,000",
  perSessionLabel: "≈ KSh 333 per session",
  time: "By arrangement",
  day: "Flexible — scheduled directly with Tr. Grace via WhatsApp",
  description:
    "A relaxed, exclusive program for adults learning purely for enjoyment, confidence, or personal goals — no exams, no CBC/8-4-4 syllabus pressure. 12 interactive sessions covering music fundamentals and an instrument or voice of your choice, scheduled around your availability.",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED STUDENT VIDEO (homepage)
//
// Paste the video link into `url` and the homepage section appears
// automatically. While `url` is empty the section stays hidden, so nothing
// looks broken before the video is ready.
//
// Accepted: YouTube (https://youtu.be/XXXX), Vimeo (https://vimeo.com/123456),
// or a direct video file URL (e.g. from Cloudinary).
//
// Only publish a child's performance with the parent's written consent.
// ─────────────────────────────────────────────────────────────────────────────

export const FEATURED_VIDEO = {
  url: "",
  studentName: "Student performance",
  grade: "Grade 8",
  piece: "Set piece",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LINKS = {
  register: "/register",
  book: "/booking",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const FIRESTORE_COLLECTIONS = {
  students: "students",
  bookings: "bookings",
  payments: "payments",
  resources: "resources",
  gallery: "gallery",
  testimonials: "testimonials",
  contactMessages: "contactMessages",
  settings: "settings",
  assessments: "assessments",
  holidayExams: "holidayExams",
  blog: "blog",
} as const;
