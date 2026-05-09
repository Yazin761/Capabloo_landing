"use client";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediately reveal if reduced motion or no support
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("anim-in");
      return;
    }

    // If already in view on mount (e.g. hero section), reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add("anim-in"), delay);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("anim-in"), delay);
          obs.unobserve(el);
        }
      },
      {
        threshold: 0,               // fire as soon as 1px enters viewport
        rootMargin: "0px 0px 0px 0px",
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

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
