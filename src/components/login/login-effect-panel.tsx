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
    video.play().catch(() => {});
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
