import { cn } from "../lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      role="img"
      aria-label="Harness Studio monogram"
      className={cn("h-8 w-8", className)}
    >
      <defs>
        <linearGradient id="lm-left" x1="68" y1="42" x2="68" y2="214" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4FD8FF" />
          <stop offset="0.45" stopColor="#1D7CF5" />
          <stop offset="1" stopColor="#1E3ECB" />
        </linearGradient>
        <linearGradient id="lm-right" x1="188" y1="42" x2="188" y2="214" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B21D8" />
          <stop offset="0.55" stopColor="#8B2BE8" />
          <stop offset="1" stopColor="#D21BE0" />
        </linearGradient>
        <linearGradient id="lm-ribbon" x1="42" y1="196" x2="226" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38CFFF" />
          <stop offset="0.4" stopColor="#2E8DFB" />
          <stop offset="0.72" stopColor="#6D5BFF" />
          <stop offset="1" stopColor="#C04BFF" />
        </linearGradient>
        <linearGradient id="lm-curl" x1="150" y1="150" x2="222" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7A3BFF" />
          <stop offset="1" stopColor="#B01AE8" />
        </linearGradient>
        <linearGradient id="lm-shine" x1="60" y1="180" x2="196" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="36" y="42" width="64" height="172" rx="16" fill="url(#lm-left)" />
      <rect x="156" y="42" width="64" height="172" rx="16" fill="url(#lm-right)" />
      <path
        d="M211 121c17 27 1 68-38 84-15 6-30 6-42-2"
        stroke="url(#lm-curl)"
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M49 191c38-17 64-45 98-70 26-19 53-17 69 5"
        stroke="url(#lm-ribbon)"
        strokeWidth="32"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M62 181c32-15 56-38 84-59 22-16 45-18 62-4"
        stroke="url(#lm-shine)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
  stacked = false,
  showTagline = false,
  tone = "light",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  stacked?: boolean;
  showTagline?: boolean;
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";
  const wordmark = onDark ? "text-white" : "text-slate-900";
  const accent = onDark ? "text-violet-300" : "text-violet-600";
  const tagline = onDark ? "text-zinc-400" : "text-slate-500";
  if (stacked) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <LogoMark className={cn("h-14 w-14", markClassName)} />
        <div className="text-center">
          <div className={cn("text-xl font-extrabold leading-tight tracking-tight", wordmark, textClassName)}>
            Harness <span className={accent}>Studio</span>
          </div>
          {showTagline && (
            <div className={cn("mt-1.5 text-[9px] font-medium uppercase tracking-[0.34em]", tagline)}>
              Create · Build · Innovate
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8", markClassName)} />
      <div className="flex flex-col leading-none">
        <span className={cn("font-bold tracking-[-0.03em]", wordmark, textClassName || "text-[18px]")}>
          Harness <span className={accent}>Studio</span>
        </span>
        {showTagline && (
          <span className={cn("mt-1 text-[8px] font-medium uppercase tracking-[0.24em]", tagline)}>
            Create · Build · Innovate
          </span>
        )}
      </div>
    </div>
  );
}
