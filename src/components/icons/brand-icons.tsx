import { cn } from "@/lib/utils";

type IconProps = { className?: string; size?: number };

const iconBox = "themed-icon shrink-0";

export function LogoMark({ className, size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn(iconBox, className)}
      aria-hidden
    >
      <path
        d="M8 22 L24 8 L40 22 V40 H8 Z"
        stroke="var(--icon-brand)"
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="18" y="26" width="12" height="10" stroke="var(--icon-brand)" strokeWidth="2" fill="none" />
      <path d="M22 26 V30 M26 26 V30 M22 30 H26" stroke="var(--icon-brand)" strokeWidth="1.5" />
      <path
        d="M30 34 C34 28 38 26 42 22"
        stroke="var(--icon-brand)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M34 18 C36 14 38 12 42 10 C40 16 38 20 34 24 Z"
        fill="var(--icon-accent-green)"
        stroke="var(--icon-border)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <LogoMark size={36} className="shrink-0" />
      <div className="hidden min-w-0 leading-tight sm:block">
        <span className="block truncate text-sm font-bold text-[var(--icon-brand)]">投稿サポート</span>
        <span className="block truncate text-xs text-muted-foreground">for Gビジネス</span>
      </div>
    </div>
  );
}

export function IconUpload({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={cn(iconBox, className)} aria-hidden>
      <ellipse cx="22" cy="18" rx="14" ry="9" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="2" />
      <path d="M22 24 V14 M18 18 L22 14 L26 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <rect x="26" y="26" width="16" height="20" rx="2" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="2" />
      <rect x="30" y="30" width="8" height="10" fill="white" opacity="0.9" />
    </svg>
  );
}

export function IconAi({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={cn(iconBox, className)} aria-hidden>
      <rect x="10" y="10" width="28" height="28" rx="4" fill="var(--icon-green)" stroke="var(--icon-border)" strokeWidth="2" />
      <text x="24" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">AI</text>
      {[14, 24, 34].map((y) => (
        <g key={y}>
          <line x1="4" y1={y} x2="10" y2={y} stroke="var(--icon-green)" strokeWidth="3" />
          <line x1="38" y1={y} x2="44" y2={y} stroke="var(--icon-green)" strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
}

export function IconEditDoc({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={cn(iconBox, className)} aria-hidden>
      <rect x="10" y="6" width="24" height="32" rx="2" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="2" />
      <line x1="14" y1="14" x2="30" y2="14" stroke="white" strokeWidth="2" />
      <line x1="14" y1="20" x2="26" y2="20" stroke="white" strokeWidth="2" />
      <line x1="14" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" />
      <path d="M28 30 L40 42 L34 44 L26 36 Z" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="2" />
    </svg>
  );
}

export function IconGbp({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={cn(iconBox, className)} aria-hidden>
      <rect x="8" y="14" width="32" height="28" rx="3" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="2" />
      <path d="M8 22 H40" stroke="white" strokeWidth="2" />
      <rect x="12" y="14" width="5" height="8" fill="#5b9fd4" />
      <rect x="19" y="14" width="5" height="8" fill="var(--icon-blue)" />
      <rect x="26" y="14" width="5" height="8" fill="#5b9fd4" />
      <rect x="33" y="14" width="5" height="8" fill="var(--icon-blue)" />
      <text x="34" y="38" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">G</text>
    </svg>
  );
}

export function IconSend({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={cn(iconBox, className)} aria-hidden>
      <path d="M4 16 L28 6 L20 28 L16 18 Z" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="1.5" />
    </svg>
  );
}

export function IconEfficiency({ className, size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={cn(iconBox, className)} aria-hidden>
      <rect x="6" y="22" width="6" height="12" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <rect x="16" y="16" width="6" height="18" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <rect x="26" y="8" width="6" height="26" fill="var(--icon-blue)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <path d="M6 10 L34 4" stroke="var(--icon-blue)" strokeWidth="2.5" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--icon-blue)" />
        </marker>
      </defs>
    </svg>
  );
}

export function IconReviews({ className, size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={cn(iconBox, className)} aria-hidden>
      <ellipse cx="20" cy="18" rx="14" ry="12" fill="var(--icon-green)" stroke="var(--icon-border)" strokeWidth="2" />
      <path d="M10 26 L8 34 L16 28" fill="var(--icon-green)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <polygon points="20,12 22,17 27,17 23,20 25,25 20,22 15,25 17,20 13,17 18,17" fill="white" />
    </svg>
  );
}

export function IconTeam({ className, size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={cn(iconBox, className)} aria-hidden>
      <circle cx="20" cy="14" r="6" fill="var(--icon-purple)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <circle cx="10" cy="18" r="5" fill="var(--icon-purple)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <circle cx="30" cy="18" r="5" fill="var(--icon-purple)" stroke="var(--icon-border)" strokeWidth="1.5" />
      <path d="M8 32 C8 26 14 24 20 24 C26 24 32 26 32 32" fill="var(--icon-purple)" stroke="var(--icon-border)" strokeWidth="1.5" />
    </svg>
  );
}

export function IconSecurity({ className, size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={cn(iconBox, className)} aria-hidden>
      <path d="M20 4 L34 10 V20 C34 28 28 34 20 36 C12 34 6 28 6 20 V10 Z" fill="var(--icon-orange)" stroke="var(--icon-border)" strokeWidth="2" />
      <rect x="16" y="18" width="8" height="10" rx="1" fill="white" />
      <path d="M18 18 V16 C18 14 19 12 20 12 C21 12 22 14 22 16 V18" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function GoogleIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function MailIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7 L12 13 L21 7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function LockIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11 V8 C8 5.5 10 4 12 4 C14 4 16 5.5 16 8 V11" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
