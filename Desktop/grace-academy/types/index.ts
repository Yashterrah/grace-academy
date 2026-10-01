import type { GradeKey } from "@/lib/constants";

export type PaymentStatus = "pending" | "confirmed" | "rejected";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

/**
 * "school" = CBC/8-4-4 students, Grade 4–9, taught on the fixed grade
 * timetable. "adult" = the non-CBC Adult Music Classes package (12
 * sessions, flat fee, flexible scheduling) — see ADULT_PROGRAM in
 * lib/constants.ts. Both share the same Student/Booking shape so the rest
 * of the app (admin views, Firestore rules, etc.) doesn't need to branch.
 */
export type ProgramType = "school" | "adult";

export interface Student {
  id?: string;
  program: ProgramType;
  fullName: string;
  age: number;
  grade?: GradeKey; // only for program === "school"
  school?: string; // only for program === "school"
  parentName: string; // for "adult", this is the learner's own name/phone
  parentPhone: string;
  parentEmail?: string;
  county: string;
  notes?: string;
  progressNotes?: string; // admin-only teacher notes, never shown to parents
  createdAt: string; // ISO
  reference: string;
}

export interface Booking {
  id?: string;
  program: ProgramType;
  studentReference: string;
  studentName: string;
  grade?: GradeKey; // only for program === "school"
  gradeLabel: string; // grade label, or "Adult Music Class (12 sessions)"
  time: string;
  day: string;
  fee: number;
  pricingTrack?: "holiday" | "bundle" | "standard";
  status: BookingStatus;
  createdAt: string;
  reference: string;
}

export interface Payment {
  id?: string;
  bookingReference: string;
  studentName: string;
  amount: number;
  mpesaMessage?: string;
  proofUrl?: string; // present for manual screenshot uploads
  proofFileName?: string;
  method?: "manual" | "stk_push";
  phone?: string; // for STK Push payments
  checkoutRequestId?: string; // Daraja's tracking ID, used by the callback to find this doc
  mpesaReceiptNumber?: string; // filled in by the callback once M-Pesa confirms
  status: PaymentStatus;
  createdAt: string;
  reference: string;
}

export interface Resource {
  id?: string;
  title: string;
  description: string;
  grade: GradeKey | "all";
  fileUrl: string;
  fileType: "pdf" | "audio" | "video" | "link";
  createdAt: string;
}

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  category: "recital" | "classroom" | "exam" | "choir" | "event";
  createdAt: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string; // e.g. "Parent, Grade 6 student" or "Grade 9 student"
  message: string;
  rating: number; // 1-5
  imageUrl?: string;
  approved: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: string;
}

export interface SiteSettings {
  id?: string;
  onlineClassesStart: string;
  enrollmentOpen: boolean;
  announcement: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // simple markdown-style text: ## headings, - bullets, paragraphs
  tags: string[];
  grade?: string; // "all" | "grade4" ...
  readingMinutes: number;
  published: boolean;
  publishedAt: string; // ISO
  createdAt: string;
  updatedAt: string;
}
