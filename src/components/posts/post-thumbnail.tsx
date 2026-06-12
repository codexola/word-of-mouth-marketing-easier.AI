"use client";

import { ImageIcon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type ThumbSize = "xs" | "sm" | "md" | "lg";

const SIZE_PX: Record<ThumbSize, number> = {
  xs: 40,
  sm: 48,
  md: 64,
  lg: 96,
};

interface PostThumbnailProps {
  src?: string | null;
  alt?: string;
  size?: ThumbSize;
  className?: string;
}

export function PostThumbnail({ src, alt = "", size = "sm", className }: PostThumbnailProps) {
  const url = resolveMediaUrl(src);
  const px = SIZE_PX[size];

  if (!url) {
    return (
      <div
        className={cn("dash-thumb dash-thumb--empty d-flex align-items-center justify-content-center", className)}
        style={{ width: px, height: px }}
        aria-hidden
      >
        <ImageIcon size={Math.round(px * 0.38)} className="text-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn("dash-thumb", className)}
      style={{ width: px, height: px }}
    >
      <img src={url} alt={alt} className="dash-thumb__img" loading="lazy" decoding="async" />
    </div>
  );
}

interface PostPhotoProps {
  src?: string | null;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  /** Fill a fixed-size parent (e.g. gallery thumb). */
  fill?: boolean;
}

/** Responsive photo frame — fills container width, crops to aspect ratio. */
export function PostPhoto({ src, alt = "", className, aspectRatio = "1", fill = false }: PostPhotoProps) {
  const url = resolveMediaUrl(src);

  if (!url) {
    return (
      <div
        className={cn(
          "dash-photo dash-photo--empty d-flex align-items-center justify-content-center",
          fill && "dash-photo--fill",
          className
        )}
        style={fill ? undefined : { aspectRatio }}
      >
        <ImageIcon size={28} className="text-muted" />
      </div>
    );
  }

  return (
    <div
      className={cn("dash-photo", fill && "dash-photo--fill", className)}
      style={fill ? undefined : { aspectRatio }}
    >
      <img src={url} alt={alt} className="dash-photo__img" loading="lazy" decoding="async" />
    </div>
  );
}
