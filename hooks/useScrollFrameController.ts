"use client";

import { useEffect, useMemo, useState } from "react";

type ScrollFrameOptions = {
  totalFrames: number;
  snapStrength?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const snapToFrame = (value: number, snapStrength: number) => {
  const rounded = Math.round(value);
  return value + (rounded - value) * snapStrength;
};

export function useScrollFrameController({
  totalFrames,
  snapStrength = 0.45,
}: ScrollFrameOptions) {
  const [frame, setFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  const maxFrame = useMemo(() => Math.max(totalFrames - 1, 1), [totalFrames]);

  useEffect(() => {
    let animationId = 0;
    let targetFrame = 0;
    let currentFrame = 0;

    const updateTarget = () => {
      const maxScrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const scrollProgress = clamp(window.scrollY / maxScrollable, 0, 1);
      const rawFrame = scrollProgress * maxFrame;
      const snappedFrame = snapToFrame(rawFrame, snapStrength);
      targetFrame = clamp(snappedFrame, 0, maxFrame);
      setProgress(scrollProgress);
    };

    const animate = () => {
      currentFrame += (targetFrame - currentFrame) * 0.18;
      setFrame(Math.round(currentFrame));
      animationId = window.requestAnimationFrame(animate);
    };

    updateTarget();
    animate();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, [maxFrame, snapStrength]);

  return { frame, progress };
}
