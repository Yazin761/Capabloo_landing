"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  label: string;
  delay?: number;
}

export function StatCard({ value, label, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(t);
  }, [isInView, delay]);

  return (
    <div ref={ref} className={`stat-card${visible ? " stat-visible" : ""}`}>
      <span className="stat-value">{value}</span>
      <p>{label}</p>
    </div>
  );
}
