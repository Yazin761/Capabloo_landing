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
    let alive = true;
    let disconnectObs: (() => void) | undefined;

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!alive) return;
        const el = ref.current;
        if (!el) return;

        if (
          !window.IntersectionObserver ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          el.classList.add("anim-in");
          return;
        }

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setTimeout(() => {
            if (alive) el.classList.add("anim-in");
          }, delay);
          return;
        }

        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                if (alive) el.classList.add("anim-in");
              }, delay);
              obs.unobserve(el);
            }
          },
          { threshold: 0, rootMargin: "0px 0px 0px 0px" }
        );
        obs.observe(el);
        disconnectObs = () => obs.disconnect();
      });
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf1);
      disconnectObs?.();
    };
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
