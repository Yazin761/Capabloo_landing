"use client";

import { useEffect, useRef } from "react";

export function ScrollFrameHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renderRafRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const smoothTimeRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let hasMetadata = false;

    const updateTargetTime = () => {
      if (!hasMetadata || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const maxScroll = Math.max(sectionHeight - window.innerHeight, 1);
      const rawProgress = (window.scrollY - sectionTop) / maxScroll;
      const progress = Math.min(Math.max(rawProgress, 0), 1);
      targetTimeRef.current = progress * video.duration;
    };

    const renderLoop = () => {
      const target = targetTimeRef.current;
      const current = smoothTimeRef.current;
      const next = current + (target - current) * 0.22;
      smoothTimeRef.current = next;

      // Only seek when delta is meaningful to avoid decoder thrashing.
      if (Math.abs(video.currentTime - next) > 0.01) {
        video.currentTime = next;
      }

      renderRafRef.current = window.requestAnimationFrame(renderLoop);
    };

    const onScroll = () => {
      updateTargetTime();
    };

    const onLoadedMetadata = () => {
      hasMetadata = true;
      updateTargetTime();
      smoothTimeRef.current = targetTimeRef.current;
      video.currentTime = targetTimeRef.current;
      if (renderRafRef.current === null) {
        renderRafRef.current = window.requestAnimationFrame(renderLoop);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      if (renderRafRef.current !== null) {
        window.cancelAnimationFrame(renderRafRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <div className="hero-media-layer">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            playsInline
            preload="auto"
          >
            <source src="/video/capabloo-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-scroll-hint" aria-hidden>
            <span className="scroll-dot" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  );
}
