import { z } from "zod";

const kenyanPhone = z
  .string()
  .trim()
  .regex(
    /^(?:\+254|0)(7|1)\d{8}$/,
    "Enter a valid Kenyan phone number, e.g. 0712345678"
  );

const gradeEnum = z.enum(
  ["grade4", "grade5", "grade6", "grade7", "grade8", "grade9"],
  { errorMap: () => ({ message: "Please select your grade" }) }
);

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(80, "Full name looks too long"),
  age: z.coerce
    .number({ invalid_type_error: "Enter a valid age" })
    .int()
    .min(5, "Student must be at least 5 years old")
    .max(25, "Please double-check the age entered"),
  grade: gradeEnum,
  school: z.string().trim().min(2, "Enter the student's current school"),
  parentName: z.string().trim().min(3, "Enter parent/guardian full name"),
  parentPhone: kenyanPhone,
  parentEmail: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  county: z.string().trim().min(2, "Enter your county"),
  notes: z.string().trim().max(500, "Keep notes under 500 characters").optional(),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm the details above are accurate",
    }),
  }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const bookingSchema = z.object({
  studentName: z.string().trim().min(3, "Enter the student's full name"),
  studentReference: z
    .string()
    .trim()
    .min(3, "Enter your registration reference (e.g. GMMA-7F3K2)"),
  grade: gradeEnum,
  parentPhone: kenyanPhone,
  preferredStartDate: z.string().min(1, "Choose a preferred start date"),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const paymentUploadSchema = z.object({
  bookingReference: z
    .string()
    .trim()
    .min(3, "Enter your booking reference (e.g. GMMA-9K2P1)"),
  studentName: z.string().trim().min(3, "Enter the student's full name"),
  amount: z.coerce
    .number({ invalid_type_error: "Enter the amount paid" })
    .positive("Amount must be greater than 0"),
  mpesaMessage: z.string().trim().max(300).optional(),
  proof: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, "Upload your M-Pesa confirmation screenshot")
    .refine(
      (files) => !files || (files[0]?.size ?? 0) <= 5 * 1024 * 1024,
      "File must be smaller than 5MB"
    )
    .refine(
      (files) =>
        !files ||
        ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type ?? ""),
      "Only JPG, PNG or WEBP images are accepted"
    ),
});

export type PaymentUploadInput = z.infer<typeof paymentUploadSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: kenyanPhone.optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Enter a subject"),
  message: z.string().trim().min(10, "Message should be at least 10 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
