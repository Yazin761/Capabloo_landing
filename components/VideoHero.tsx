"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;

    const scheduleRefresh = () => {
      requestAnimationFrame(() => {
        if (alive) ScrollTrigger.refresh();
      });
    };

    const run = () => {
      if (!alive) return;
      const section = sectionRef.current;
      const video = videoRef.current;
      const progressBar = progressRef.current;
      const label = labelRef.current;
      if (!section || !video || !progressBar || !label) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        label.classList.remove("video-hero__label--hidden");
        progressBar.style.transform = "scaleX(0)";
        return;
      }

      let hasMetadata = false;
      let targetProgress = 0;
      let smoothProgress = 0;
      let rafId: number | null = null;
      let isMounted = true;

      const updateVisuals = (progress: number) => {
        progressBar.style.transform = `scaleX(${progress})`;
        if (progress > 0.06) label.classList.add("video-hero__label--hidden");
        else label.classList.remove("video-hero__label--hidden");
      };

      const tick = () => {
        if (!isMounted) return;
        smoothProgress += (targetProgress - smoothProgress) * 0.18;

        if (Math.abs(targetProgress - smoothProgress) < 0.00035) {
          smoothProgress = targetProgress;
        }

        updateVisuals(smoothProgress);

        if (hasMetadata && video.duration > 0 && Number.isFinite(video.duration)) {
          const targetTime = smoothProgress * video.duration;
          if (Math.abs(video.currentTime - targetTime) > 0.015) {
            video.currentTime = targetTime;
          }
        }

        rafId = window.requestAnimationFrame(tick);
      };

      const unlockIOSSeek = () => {
        void video.play().then(() => video.pause()).catch(() => {});
        window.removeEventListener("touchstart", unlockIOSSeek);
        window.removeEventListener("pointerdown", unlockIOSSeek);
      };

      const onLoadedMetadata = () => {
        hasMetadata = true;
        video.currentTime = 0;
        scheduleRefresh();
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      window.addEventListener("touchstart", unlockIOSSeek, { passive: true });
      window.addEventListener("pointerdown", unlockIOSSeek, { passive: true });

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: false,
          onUpdate: (self) => {
            targetProgress = clamp01(self.progress);
          },
        });
      }, section);

      scheduleRefresh();
      window.addEventListener("resize", scheduleRefresh);
      void document.fonts?.ready?.then(scheduleRefresh).catch(() => scheduleRefresh());

      rafId = window.requestAnimationFrame(tick);

      return () => {
        isMounted = false;
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        window.removeEventListener("touchstart", unlockIOSSeek);
        window.removeEventListener("pointerdown", unlockIOSSeek);
        window.removeEventListener("resize", scheduleRefresh);
        ctx.revert();
        if (rafId !== null) window.cancelAnimationFrame(rafId);
      };
    };

    let cleanup: (() => void) | undefined;
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!alive) return;
        cleanup = run();
      });
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf1);
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="video-hero">
      <div className="video-hero__sticky">
        <div className="video-hero__frame">
          <video
            ref={videoRef}
            className="video-hero__video"
            src="/video/capabloo-bg.mp4"
            muted
            playsInline
            preload="auto"
          />
          <div ref={labelRef} className="video-hero__label">
            <h3>Capabloo MedTech</h3>
            <p>Scroll to explore</p>
          </div>
          <div className="video-hero__progressTrack" aria-hidden>
            <div ref={progressRef} className="video-hero__progressFill" />
          </div>
        </div>
      </div>
    </section>
  );
}
