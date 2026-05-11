"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "zoom";
}

function intersectsViewport(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

export function AnimatedSection({
  children, className = "", id, delay = 0, direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let revealed = false;
    let revealTimeout = 0;
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      if (!alive || revealed) return;
      revealed = true;
      clearTimeout(revealTimeout);
      revealTimeout = window.setTimeout(() => {
        if (alive) el.classList.add("anim-in");
      }, delay);
    };

    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("anim-in");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          obs.unobserve(el);
        }
      },
      { threshold: 0, root: null, rootMargin: "0px" }
    );
    obs.observe(el);

    const syncFromLayout = () => {
      if (!alive || revealed || el.classList.contains("anim-in")) return;
      if (intersectsViewport(el)) reveal();
    };

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(syncFromLayout);
    });

    const onPageShow = (e: PageTransitionEvent) => {
      if (!alive || !e.persisted) return;
      if (el.classList.contains("anim-in")) return;
      revealed = false;
      obs.disconnect();
      obs.observe(el);
      requestAnimationFrame(() => requestAnimationFrame(syncFromLayout));
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      alive = false;
      clearTimeout(revealTimeout);
      cancelAnimationFrame(raf1);
      obs.disconnect();
      window.removeEventListener("pageshow", onPageShow);
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
