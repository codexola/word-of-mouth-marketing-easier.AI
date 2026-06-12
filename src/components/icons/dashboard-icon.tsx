import Image from "next/image";
import { cn } from "@/lib/utils";
import { DashboardSvgIcon, type DashboardIconName } from "./svg-icons";

interface DashboardIconProps {
  name: DashboardIconName;
  alt: string;
  size?: number;
  className?: string;
}

/** SVG brand icons for dashboard — bordered for 2D light/dark theme. */
export function DashboardIcon({ name, alt, size = 48, className }: DashboardIconProps) {
  const box = Math.min(size + 16, 72);
  return (
    <div
      className={cn(
        "dashboard-icon-box flex max-w-full shrink-0 items-center justify-center border-2 border-border bg-card p-1.5 sm:p-2",
        className
      )}
      style={{ width: box, height: box, minWidth: 0 }}
      role="img"
      aria-label={alt}
    >
      <DashboardSvgIcon name={name} size={size} className="text-[var(--icon-brand)]" />
    </div>
  );
}

/** Legacy path map — icons are now SVG components */
export const DASHBOARD_ICONS = {
  upload: "upload",
  ai: "ai",
  edit: "edit",
  gbp: "gbp",
  send: "send",
  efficiency: "efficiency",
  team: "team",
  reviews: "reviews",
  security: "security",
  logo: "/logo.png",
  logoMark: "logo",
  google: "google",
} as const;

export function DashboardLogoImage({ className, alt }: { className?: string; alt: string }) {
  return (
    <Image
      src="/logo.png"
      alt={alt}
      width={80}
      height={80}
      className={className ?? "h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"}
      unoptimized
      priority
    />
  );
}
