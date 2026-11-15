"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Subtle scroll-triggered fade/slide, plays once. Reduced motion is handled globally by <MotionConfig reducedMotion="user"> (fade only, no slide). */
export function Reveal({ delay = 0, y = 18, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
