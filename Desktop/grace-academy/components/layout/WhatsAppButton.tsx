"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WHATSAPP_MESSAGES } from "@/utils/whatsapp";

export function WhatsAppButton() {
  return (
    <motion.a
      href={buildWhatsAppLink(WHATSAPP_MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Grace Muigai Music Academy on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
      <MessageCircle className="relative h-7 w-7" fill="white" strokeWidth={0} aria-hidden />
    </motion.a>
  );
}
