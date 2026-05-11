"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "zoom";
}

export function AnimatedSection({
  children, className = "", id, delay = 0, direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("anim-in");
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!isInView) return;
    const t = window.setTimeout(() => el.classList.add("anim-in"), delay);
    return () => window.clearTimeout(t);
  }, [isInView, delay]);

  return (
    <div
      ref={ref}
      id={id}
      className={`anim-base anim-${direction} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
