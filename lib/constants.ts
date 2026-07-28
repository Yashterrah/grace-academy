/**
 * lib/constants.ts
 * Single source of truth for business rules.
 * Change values here and they propagate across the whole site
 * (booking form, fee tables, receipts, contact links, footer, etc.)
 */

export const SITE = {
  name: "Grace Muigai Music Academy",
  shortName: "GMMA",
  tagline: "Where every learner finds their voice, their rhythm, their grade.",
  description:
    "Online CBC & 8-4-4 music lessons with Tr. Grace Muigai — Grades 4 to 9. Set pieces, folksongs, choral and instrumental music, taught by a trained, experienced high school music teacher in Kenya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gracemuigaimusicacademy.com",
  locale: "en_KE",
  themeColor: "#0B4F4A",
} as const;

export const TEACHER = {
  name: "Tr. Grace Muigai",
  title: "Music Teacher — CBC & 8-4-4 Curriculum",
  bio: "A trained high school music teacher who prepares candidates for exams in both the 8-4-4 and CBC curricula — covering set pieces, folksongs, KCSE choral music, and instrumental music such as recorders.",
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
  tillNumber: process.env.NEXT_PUBLIC_MPESA_TILL_NUMBER ?? "4319699",
  businessName: process.env.NEXT_PUBLIC_MPESA_BUSINESS_NAME ?? "Grace",
  paybillInstructions: [
    "Go to M-Pesa on your phone",
    "Select Lipa na M-Pesa",
    "Select Buy Goods and Services",
    `Enter Till Number: ${process.env.NEXT_PUBLIC_MPESA_TILL_NUMBER ?? "4319699"}`,
    "Enter the exact class fee amount",
    "Enter your M-Pesa PIN and confirm",
    "Upload a screenshot of the confirmation message below",
  ],
} as const;

export const TERM = {
  onlineClassesStart: "2026-08-07",
  onlineClassesStartLabel: "7 August",
} as const;

/**
 * Grade → time → fee mapping. This single array drives:
 * - the booking form (auto-fills time & fee when a grade is picked)
 * - the public fee/timetable table
 * - Firestore documents written on booking
 */
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
  timeValue: string; // 24h sortable value
  fee: number;
  feeLabel: string;
  day: string;
}

export const GRADE_SCHEDULE: GradeSchedule[] = [
  {
    key: "grade4",
    label: "Grade 4",
    time: "9:00 AM",
    timeValue: "09:00",
    fee: 2000,
    feeLabel: "KSh 2,000",
    day: "Monday – Friday",
  },
  {
    key: "grade5",
    label: "Grade 5",
    time: "10:00 AM",
    timeValue: "10:00",
    fee: 2500,
    feeLabel: "KSh 2,500",
    day: "Monday – Friday",
  },
  {
    key: "grade6",
    label: "Grade 6",
    time: "11:00 AM",
    timeValue: "11:00",
    fee: 3000,
    feeLabel: "KSh 3,000",
    day: "Monday – Friday",
  },
  {
    key: "grade7",
    label: "Grade 7",
    time: "2:00 PM",
    timeValue: "14:00",
    fee: 4500,
    feeLabel: "KSh 4,500",
    day: "Monday – Friday",
  },
  {
    key: "grade8",
    label: "Grade 8",
    time: "3:00 PM",
    timeValue: "15:00",
    fee: 4500,
    feeLabel: "KSh 4,500",
    day: "Monday – Friday",
  },
  {
    key: "grade9",
    label: "Grade 9",
    time: "4:00 PM",
    timeValue: "16:00",
    fee: 4500,
    feeLabel: "KSh 4,500",
    day: "Monday – Friday",
  },
];

export const getGradeSchedule = (key: GradeKey | string | undefined) =>
  GRADE_SCHEDULE.find((g) => g.key === key);

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resources", label: "Resources" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;

export const CTA_LINKS = {
  register: "/register",
  book: "/booking",
} as const;

export const FIRESTORE_COLLECTIONS = {
  students: "students",
  bookings: "bookings",
  payments: "payments",
  resources: "resources",
  gallery: "gallery",
  testimonials: "testimonials",
  contactMessages: "contactMessages",
  settings: "settings",
} as const;
