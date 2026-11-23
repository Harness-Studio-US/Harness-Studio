import { assetUrl } from "../lib/assets";
import { cn } from "../lib/cn";

export function LogoMark({ className, alt }: { className?: string; alt?: string }) {
  return (
    <img
      src={assetUrl("/brand/harness-mark.png")}
      alt={alt ?? "Harness Studio monogram"}
      width={512}
      height={458}
      draggable={false}
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}

export function Logo({
  className,
  markClassName,
  textClassName,
  stacked = false,
  showTagline = false,
  tone = "light",
  /* The console brand is "Harness Console"; the site stays "Harness Studio". */
  product = "Studio",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  stacked?: boolean;
  showTagline?: boolean;
  tone?: "light" | "dark";
  product?: string;
}) {
  const onDark = tone === "dark";
  const wordmark = onDark ? "text-white" : "text-slate-900";
  const accent = onDark ? "text-violet-300" : "text-violet-600";
  const tagline = onDark ? "text-zinc-400" : "text-slate-500";
  if (stacked) {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <LogoMark
          className={cn("h-14 w-14", markClassName)}
          alt={`Harness ${product} monogram`}
        />
        <div className="text-center">
          <div className={cn("text-xl font-extrabold leading-tight tracking-tight", wordmark, textClassName)}>
            Harness <span className={accent}>{product}</span>
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
      <LogoMark className={cn("h-8 w-8", markClassName)} alt={`Harness ${product} monogram`} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold tracking-[-0.04em]",
            wordmark,
            textClassName || "text-[18px]"
          )}
        >
          Harness <span className={accent}>{product}</span>
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
