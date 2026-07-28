import type { GradeKey } from "@/lib/constants";

export type PaymentStatus = "pending" | "confirmed" | "rejected";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Student {
  id?: string;
  fullName: string;
  age: number;
  grade: GradeKey;
  school: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  county: string;
  notes?: string;
  createdAt: string; // ISO
  reference: string;
}

export interface Booking {
  id?: string;
  studentReference: string;
  studentName: string;
  grade: GradeKey;
  gradeLabel: string;
  time: string;
  day: string;
  fee: number;
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
  proofUrl: string;
  proofFileName: string;
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
  announcement?: string;
}
