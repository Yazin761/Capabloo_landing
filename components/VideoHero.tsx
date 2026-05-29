"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

// Desktop: all-keyframe scrub encode. Mobile: lighter 720p scrub transcode.
const VIDEO_DESKTOP = "/video/hero-scrub-g6-scrub.mp4";
const VIDEO_MOBILE = "/video/hero-scrub-mobile.mp4";

type PerfConfig = {
  pinScrollVh: number;
  progressLerp: number;
  dprMax: number;
  seekThreshold: number;
  preload: "auto" | "metadata";
  isMobile: boolean;
};

const DEFAULT_PERF: PerfConfig = {
  pinScrollVh: 3,
  progressLerp: 0.14,
  dprMax: 2,
  seekThreshold: 0.012,
  preload: "auto",
  isMobile: false,
};

function getPerfConfig(): PerfConfig {
  if (typeof window === "undefined") return DEFAULT_PERF;

  const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  const saveData = window.matchMedia("(prefers-reduced-data: reduce)").matches;

  if (isMobile || saveData) {
    return {
      pinScrollVh: 1.15,
      progressLerp: 0.22,
      dprMax: 1.25,
      seekThreshold: 0.045,
      preload: "metadata",
      isMobile: true,
    };
  }

  return {
    pinScrollVh: 3,
    progressLerp: 0.14,
    dprMax: 2,
    seekThreshold: 0.012,
    preload: "auto",
    isMobile: false,
  };
}

function applyVideoAspect(frame: HTMLElement, video: HTMLVideoElement) {
  const { videoWidth: vw, videoHeight: vh } = video;
  if (vw > 0 && vh > 0) {
    frame.style.setProperty("--vh-video-aspect", `${vw} / ${vh}`);
  }
}

/** Fit full frame in view (letterbox) — avoids cropping scrub content when layout is slightly off. */
function drawContain(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number
) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh || !width || !height) return;

  const videoAspect = vw / vh;
  const canvasAspect = width / height;
  let dw = width;
  let dh = height;
  let dx = 0;
  let dy = 0;

  if (videoAspect > canvasAspect) {
    dh = width / videoAspect;
    dy = (height - dh) / 2;
  } else {
    dw = height * videoAspect;
    dx = (width - dw) / 2;
  }

  ctx.fillStyle = "#F7F4F0";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(video, 0, 0, vw, vh, dx, dy, dw, dh);
}

export function VideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const hasMetadataRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const perfRef = useRef<PerfConfig>(DEFAULT_PERF);
  const visibleRef = useRef(true);

  const [perf, setPerf] = useState<PerfConfig>(() => DEFAULT_PERF);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    targetProgressRef.current = Math.min(Math.max(value, 0), 1);
  });

  useEffect(() => {
    const next = getPerfConfig();
    perfRef.current = next;
    setPerf(next);

    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const onChange = () => {
      const updated = getPerfConfig();
      perfRef.current = updated;
      setPerf(updated);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const bar = progressRef.current;
    const label = labelRef.current;
    if (!section || !frame || !video || !canvas || !bar || !label) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const mobileSrc = VIDEO_MOBILE;
    const desktopSrc = VIDEO_DESKTOP;
    frame.style.removeProperty("--vh-video-aspect");
    video.src = perf.isMobile ? mobileSrc : desktopSrc;
    video.preload = perf.preload;

    let rafId = 0;
    let pendingTime: number | null = null;
    let seeking = false;
    let lastPaintedTime = -1;
    let lastQueuedTime = -1;

    const resizeCanvas = () => {
      const { dprMax } = perfRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      if (!width || !height) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = () => {
      resizeCanvas();
      drawContain(ctx, video, frame.clientWidth, frame.clientHeight);
    };

    const applyUi = (progress: number) => {
      bar.style.transform = `scaleX(${progress})`;
      label.style.opacity = progress > 0.06 ? "0" : "1";
    };

    const queueSeek = (time: number) => {
      if (!hasMetadataRef.current || !Number.isFinite(video.duration)) return;

      const { seekThreshold } = perfRef.current;
      const clamped = Math.min(Math.max(time, 0), Math.max(video.duration - 0.04, 0));

      if (
        Math.abs(clamped - lastQueuedTime) < seekThreshold &&
        Math.abs(clamped - video.currentTime) < seekThreshold
      ) {
        return;
      }

      lastQueuedTime = clamped;
      pendingTime = clamped;
      if (seeking) return;

      seeking = true;
      const next = pendingTime;
      pendingTime = null;

      if (typeof video.fastSeek === "function") {
        video.fastSeek(next);
      } else {
        video.currentTime = next;
      }
    };

    const onSeeked = () => {
      if (Math.abs(video.currentTime - lastPaintedTime) < 0.001) {
        seeking = false;
        if (pendingTime !== null) queueSeek(pendingTime);
        return;
      }

      lastPaintedTime = video.currentTime;
      paint();
      seeking = false;
      if (pendingTime !== null) queueSeek(pendingTime);
    };

    const primeVideo = async () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      try {
        await video.play();
        video.pause();
      } catch {
        // iOS may require a gesture before seeking works.
      }
    };

    const reset = () => {
      hasMetadataRef.current = false;
      lastQueuedTime = -1;
      lastPaintedTime = -1;
      seeking = false;
      pendingTime = null;
    };

    const onLoadedMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      hasMetadataRef.current = true;
      applyVideoAspect(frame, video);
      resizeCanvas();
      queueSeek(targetProgressRef.current * video.duration);
    };

    const render = () => {
      if (visibleRef.current) {
        const { progressLerp } = perfRef.current;
        const target = targetProgressRef.current;
        const current = smoothProgressRef.current;
        const progress = current + (target - current) * progressLerp;
        smoothProgressRef.current = progress;

        applyUi(progress);

        if (hasMetadataRef.current && video.duration > 0) {
          queueSeek(progress * video.duration);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    const unlockSeek = () => {
      void primeVideo();
    };

    const onScroll = () => {
      if (!hasInteractedRef.current) void primeVideo();
    };

    const ro = new ResizeObserver(() => {
      if (hasMetadataRef.current) paint();
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
        if (visibleRef.current && hasMetadataRef.current) paint();
      },
      { rootMargin: "12% 0px" }
    );

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("pointerdown", unlockSeek, { passive: true });
    window.addEventListener("touchstart", unlockSeek, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(frame);
    io.observe(section);
    video.load();

    let navMo: MutationObserver | undefined;
    let removeNavResize: (() => void) | undefined;
    if (!perf.isMobile) {
      const header = document.querySelector<HTMLElement>(".top-nav");
      const syncNavGap = () => {
        const hidden = header?.classList.contains("nav-hidden") ?? false;
        const gap = hidden ? "12px" : "96px";
        section.style.setProperty("--vh-nav-gap", gap);
      };
      syncNavGap();
      navMo =
        header &&
        new MutationObserver(() => {
          syncNavGap();
        });
      navMo?.observe(header, { attributes: true, attributeFilter: ["class"] });
      window.addEventListener("resize", syncNavGap, { passive: true });
      removeNavResize = () => window.removeEventListener("resize", syncNavGap);
    }

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("pointerdown", unlockSeek);
      window.removeEventListener("touchstart", unlockSeek);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
      navMo?.disconnect();
      removeNavResize?.();
      section.style.removeProperty("--vh-nav-gap");
      reset();
    };
  }, [perf]);

  const scrollHeight = perf
    ? `${(1 + perf.pinScrollVh) * 100}svh`
    : `${(1 + DEFAULT_PERF.pinScrollVh) * 100}svh`;

  return (
    <div
      ref={sectionRef}
      className={`vh-wrap${perf.isMobile ? " vh-wrap--mobile" : ""}`}
      style={{ height: scrollHeight }}
    >
      <div className="vh-stage">
        <div ref={frameRef} className="vh-frame">
          <canvas ref={canvasRef} className="vh-canvas" aria-hidden />

          <video
            ref={videoRef}
            className="vh-video vh-video--source"
            muted
            playsInline
            preload={perf.preload}
          />

          <div className="vh-blend" aria-hidden />

          <div className="vh-corner vh-corner--tl vh-corner--desktop" aria-hidden />
          <div className="vh-corner vh-corner--tr vh-corner--desktop" aria-hidden />
          <div className="vh-corner vh-corner--bl vh-corner--desktop" aria-hidden />
          <div className="vh-corner vh-corner--br vh-corner--desktop" aria-hidden />

          <div ref={labelRef} className="vhl">
            <span className="vhl__eyebrow">Capabloo MedTech</span>
            <span className="vhl__hint">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path
                  d="M5 1v8M1 5.5l4 3.5 4-3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Scroll to explore
            </span>
          </div>

          <div className="vh-pb" aria-hidden role="presentation">
            <div ref={progressRef} className="vh-pb__fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
