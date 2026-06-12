import { cn } from "@/lib/utils";

interface SvgIconProps {
  className?: string;
  size?: number;
}

function IconBase({
  className,
  size = 24,
  children,
  viewBox = "0 0 24 24",
}: SvgIconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconUpload({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M12 3v12M7 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconAi({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path d="M8 15c1.5 1.5 6.5 1.5 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconEdit({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconGbp({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10C7.5 21 4 17 4 12V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function IconSend({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M3 12l18-9-4 18-6-6-8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M11 12l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconEfficiency({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </IconBase>
  );
}

export function IconTeam({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M14 20c0-2 1.5-3.5 3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconReviews({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <path d="M4 5h16v12H8l-4 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconSecurity({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconGoogle({ className, size }: SvgIconProps) {
  return (
    <IconBase className={className} size={size}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconLogo({ className, size = 48 }: SvgIconProps) {
  return (
    <IconBase className={className} size={size} viewBox="0 0 48 48">
      <path d="M8 22 L24 8 L40 22 V40 H8 Z" stroke="currentColor" strokeWidth="2.5" />
      <rect x="18" y="26" width="12" height="10" stroke="currentColor" strokeWidth="2" />
      <path d="M30 34 C34 28 38 26 42 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M34 18 C36 14 38 12 42 10 C40 16 38 20 34 24 Z"
        fill="#4caf50"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </IconBase>
  );
}

export type DashboardIconName =
  | "upload"
  | "ai"
  | "edit"
  | "gbp"
  | "send"
  | "efficiency"
  | "team"
  | "reviews"
  | "security"
  | "google"
  | "logo";

const ICON_MAP: Record<DashboardIconName, React.ComponentType<SvgIconProps>> = {
  upload: IconUpload,
  ai: IconAi,
  edit: IconEdit,
  gbp: IconGbp,
  send: IconSend,
  efficiency: IconEfficiency,
  team: IconTeam,
  reviews: IconReviews,
  security: IconSecurity,
  google: IconGoogle,
  logo: IconLogo,
};

export function DashboardSvgIcon({
  name,
  size = 24,
  className,
}: {
  name: DashboardIconName;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[name];
  return <Icon size={size} className={className} />;
}
