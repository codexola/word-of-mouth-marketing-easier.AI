"use client";

interface LoginSeagullButtonProps {
  label: string;
  onClick: () => void;
}

function SeagullIcon() {
  return (
    <svg
      className="login-seagull-btn__icon"
      viewBox="0 0 64 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 26C14 10 28 8 38 14L52 6L46 18L62 20L42 30C30 36 14 34 4 26Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M38 14L52 6L46 18"
        stroke="#dce8f4"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="22" r="1.5" fill="#dce8f4" />
    </svg>
  );
}

export function LoginSeagullButton({ label, onClick }: LoginSeagullButtonProps) {
  return (
    <button type="button" className="login-seagull-btn" onClick={onClick} aria-label={label}>
      <span className="login-seagull-btn__wing" aria-hidden />
      <span className="login-seagull-btn__body">
        <SeagullIcon />
        <span className="login-seagull-btn__label">{label}</span>
      </span>
    </button>
  );
}
