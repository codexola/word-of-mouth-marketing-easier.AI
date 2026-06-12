"use client";

import { useRef, useEffect } from "react";

const EFFECT_SRC = "/media/effect.mp4";

interface LoginEffectPanelProps {
  className?: string;
}

export function LoginEffectPanel({ className = "" }: LoginEffectPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    play();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) play();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    const onVisibility = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={`login-effect ${className}`.trim()} aria-hidden>
      <video
        ref={videoRef}
        className="login-effect__video"
        src={EFFECT_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
