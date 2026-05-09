"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  label: string;
  delay?: number;
}

export function StatCard({ value, label, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`stat-card${visible ? " stat-visible" : ""}`}>
      <span className="stat-value">{value}</span>
      <p>{label}</p>
    </div>
  );
}
