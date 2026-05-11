"use client";

import { useEffect, useRef } from "react";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Same mapping as before: section top aligns with viewport top → progress 0 … 1 when section bottom aligns with viewport bottom. */
function scrollProgressForSection(section: HTMLElement): number {
  const vh = window.innerHeight;
  const scrollY = window.scrollY;
  const rect = section.getBoundingClientRect();
  const sectionTop = scrollY + rect.top;
  const sectionH = section.offsetHeight;
  const start = sectionTop;
  const end = sectionTop + sectionH - vh;
  if (end <= start) return 1;
  return clamp01((scrollY - start) / (end - start));
}

export function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    let innerRaf = 0;
    let installAttempts = 0;
    const maxInstallAttempts = 90;

    let isMounted = false;
    let hasMetadata = false;
    let targetProgress = 0;
    let smoothProgress = 0;
    let tickRaf: number | null = null;
    let scrollCoalesce = 0;

    let section: HTMLElement | null = null;
    let video: HTMLVideoElement | null = null;
    let progressBar: HTMLDivElement | null = null;
    let label: HTMLDivElement | null = null;

    const updateVisuals = () => {
      if (!progressBar || !label) return;
      progressBar.style.transform = `scaleX(${smoothProgress})`;
      if (smoothProgress > 0.06) label.classList.add("video-hero__label--hidden");
      else label.classList.remove("video-hero__label--hidden");
    };

    const syncScrollProgress = () => {
      if (!isMounted || !section) return;
      targetProgress = scrollProgressForSection(section);
    };

    const scheduleScrollSync = () => {
      if (scrollCoalesce) return;
      scrollCoalesce = requestAnimationFrame(() => {
        scrollCoalesce = 0;
        syncScrollProgress();
      });
    };

    const tick = () => {
      if (!isMounted) return;
      smoothProgress += (targetProgress - smoothProgress) * 0.18;
      if (Math.abs(targetProgress - smoothProgress) < 0.00035) {
        smoothProgress = targetProgress;
      }
      updateVisuals();
      if (hasMetadata && video && video.duration > 0 && Number.isFinite(video.duration)) {
        const targetTime = smoothProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          video.currentTime = targetTime;
        }
      }
      tickRaf = window.requestAnimationFrame(tick);
    };

    const unlockIOSSeek = () => {
      if (!video) return;
      void video.play().then(() => video.pause()).catch(() => {});
      window.removeEventListener("touchstart", unlockIOSSeek);
      window.removeEventListener("pointerdown", unlockIOSSeek);
    };

    const onLoadedMetadata = () => {
      if (!video) return;
      hasMetadata = true;
      video.currentTime = 0;
      scheduleScrollSync();
    };

    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      scheduleScrollSync();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") scheduleScrollSync();
    };

    const teardown = () => {
      isMounted = false;
      if (tickRaf !== null) {
        window.cancelAnimationFrame(tickRaf);
        tickRaf = null;
      }
      if (scrollCoalesce) {
        cancelAnimationFrame(scrollCoalesce);
        scrollCoalesce = 0;
      }
      if (!video || !progressBar || !label) return;
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("touchstart", unlockIOSSeek);
      window.removeEventListener("pointerdown", unlockIOSSeek);
      window.removeEventListener("scroll", scheduleScrollSync);
      window.removeEventListener("resize", scheduleScrollSync);
      window.removeEventListener("load", scheduleScrollSync);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };

    const tryInstall = () => {
      if (!alive) return;
      section = sectionRef.current;
      video = videoRef.current;
      progressBar = progressRef.current;
      label = labelRef.current;

      if (!section || !video || !progressBar || !label) {
        installAttempts += 1;
        if (installAttempts < maxInstallAttempts) {
          innerRaf = requestAnimationFrame(tryInstall);
        }
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        label.classList.remove("video-hero__label--hidden");
        progressBar.style.transform = "scaleX(0)";
        return;
      }

      isMounted = true;
      hasMetadata = false;
      targetProgress = 0;
      smoothProgress = 0;

      video.addEventListener("loadedmetadata", onLoadedMetadata);
      window.addEventListener("touchstart", unlockIOSSeek, { passive: true });
      window.addEventListener("pointerdown", unlockIOSSeek, { passive: true });
      window.addEventListener("scroll", scheduleScrollSync, { passive: true });
      window.addEventListener("resize", scheduleScrollSync, { passive: true });
      window.addEventListener("load", scheduleScrollSync);
      window.addEventListener("pageshow", onPageShow);
      document.addEventListener("visibilitychange", onVisibility);

      scheduleScrollSync();
      tickRaf = window.requestAnimationFrame(tick);
    };

    innerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(tryInstall);
    });

    return () => {
      alive = false;
      cancelAnimationFrame(innerRaf);
      teardown();
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
