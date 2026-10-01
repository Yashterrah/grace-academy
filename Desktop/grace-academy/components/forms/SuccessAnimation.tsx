"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function SuccessAnimation() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.15, 1] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 rounded-full bg-teal-100"
      />
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 1.2, delay: 0.2, repeat: 1 }}
        className="absolute inset-0 rounded-full bg-teal-300"
      />
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 16 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-cream-50"
      >
        <Check className="h-8 w-8" strokeWidth={3} />
      </motion.div>
    </div>
  );
}
