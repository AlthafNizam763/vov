"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Vertical offset to animate from (px). */
  y?: number;
  /** Delay before the animation starts (s). */
  delay?: number;
  /** Stagger children that are themselves <Reveal> or motion items. */
  as?: "div" | "section" | "span" | "li" | "article";
};

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  className,
  y = 26,
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, delay, ease: easeOut },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
    >
      {children}
    </MotionTag>
  );
}
