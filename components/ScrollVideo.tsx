"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export function ScrollVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const renderRafRef = useRef<number | null>(null);
  const hasMetadataRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    targetProgressRef.current = Math.min(Math.max(value, 0), 1);
  });

  useEffect(() => {
    const video = videoRef.current;
    const progressEl = progressRef.current;
    const textEl = textRef.current;
    if (!video || !progressEl || !textEl) return;

    const render = () => {
      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const next = current + (target - current) * 0.45;
      smoothProgressRef.current = next;

      progressEl.style.width = `${next * 100}%`;
      textEl.classList.toggle("opacity-0", next > 0.05);
      textEl.classList.toggle("opacity-100", next <= 0.05);

      if (hasMetadataRef.current && Number.isFinite(video.duration) && video.duration > 0) {
        const desiredTime = next * video.duration;
        if (Math.abs(video.currentTime - desiredTime) > 0.02) {
          video.currentTime = desiredTime;
        }
      }

      renderRafRef.current = window.requestAnimationFrame(render);
    };

    const onLoadedMetadata = () => {
      hasMetadataRef.current = true;
    };

    const unlockIOSSeek = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      void video.play().then(() => video.pause()).catch(() => {});
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("touchstart", unlockIOSSeek, { passive: true });
    window.addEventListener("pointerdown", unlockIOSSeek, { passive: true });
    renderRafRef.current = window.requestAnimationFrame(render);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("touchstart", unlockIOSSeek);
      window.removeEventListener("pointerdown", unlockIOSSeek);
      if (renderRafRef.current !== null) {
        window.cancelAnimationFrame(renderRafRef.current);
      }
    };
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative w-full h-[400vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black px-4">
        <div className="relative w-full max-w-4xl aspect-video rounded-sm overflow-hidden">
          <video
            ref={videoRef}
            src="/video/capabloo-bg.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <div
            ref={textRef}
            className="pointer-events-none absolute bottom-4 left-4 z-10 text-white transition-opacity duration-200 opacity-100"
          >
            <h3 className="text-lg md:text-xl font-semibold tracking-tight">
              Capabloo MedTech
            </h3>
            <p className="text-xs md:text-sm text-white/80">Scroll to explore</p>
          </div>

          <div
            ref={progressRef}
            className="absolute bottom-0 left-0 h-[3px] bg-[#ff3d00] transition-none"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </section>
  );
}
