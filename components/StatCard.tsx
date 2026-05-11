"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  label: string;
  delay?: number;
}

function halfVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleTop = Math.max(0, r.top);
  const visibleBottom = Math.min(vh, r.bottom);
  const visible = Math.max(0, visibleBottom - visibleTop);
  return r.height > 0 && visible / r.height >= 0.5;
}

export function StatCard({ value, label, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    let revealed = false;
    let timeoutId = 0;
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      if (!alive || revealed) return;
      revealed = true;
      timeoutId = window.setTimeout(() => {
        if (alive) setVisible(true);
      }, delay);
    };

    if (!window.IntersectionObserver) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio >= 0.5) {
          reveal();
          obs.unobserve(el);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    obs.observe(el);

    const syncFromLayout = () => {
      if (!alive || revealed) return;
      if (el.className.includes("stat-visible")) return;
      if (halfVisible(el)) reveal();
    };

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(syncFromLayout);
    });

    const onPageShow = (e: PageTransitionEvent) => {
      if (!alive || !e.persisted) return;
      if (el.className.includes("stat-visible")) return;
      revealed = false;
      obs.disconnect();
      obs.observe(el);
      requestAnimationFrame(() => requestAnimationFrame(syncFromLayout));
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      alive = false;
      clearTimeout(timeoutId);
      cancelAnimationFrame(raf1);
      obs.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`stat-card${visible ? " stat-visible" : ""}`}>
      <span className="stat-value">{value}</span>
      <p>{label}</p>
    </div>
  );
}
