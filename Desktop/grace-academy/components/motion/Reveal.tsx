"use client";

import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
  once?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
  once = true,
}: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger container — wrap a list of <Reveal> or motion children to cascade them in. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}
