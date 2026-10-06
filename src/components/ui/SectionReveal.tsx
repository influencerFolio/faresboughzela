"use client";

import { fadeUp, motionDurations, motionEase, reducedMotionTransition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionReveal({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={
        reduced
          ? reducedMotionTransition
          : { duration: motionDurations.base, ease: motionEase }
      }
    >
      {children}
    </motion.section>
  );
}
