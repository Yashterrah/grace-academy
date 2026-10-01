import { CONTACT } from "@/lib/constants";

/**
 * Build a wa.me deep link that opens WhatsApp with a pre-filled message.
 * Falls back to the academy's primary WhatsApp number when none is supplied.
 */
export function buildWhatsAppLink(message: string, number = CONTACT.whatsappNumber) {
  const cleanNumber = number.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export const WHATSAPP_MESSAGES = {
  general:
    "Hello Tr. Grace! I'd like to find out more about Grace Muigai Music Academy.",
  register: (studentName: string, grade: string) =>
    `Hello Tr. Grace! I'm ${studentName}, I've just registered for ${grade} lessons and would like to confirm my class time.`,
  booking: (grade: string, time: string) =>
    `Hello Tr. Grace! I've booked a ${grade} lesson for ${time}. Kindly confirm my slot.`,
  payment: (reference: string) =>
    `Hello Tr. Grace! I've made my M-Pesa payment (Ref: ${reference}) and uploaded my confirmation on the website. Kindly confirm receipt.`,
};
