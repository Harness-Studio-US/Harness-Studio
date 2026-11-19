import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "violet" | "blue" | "green" | "amber" | "red";
  className?: string;
}) {
  const tones = {
    default: "border-slate-200 bg-slate-100 text-slate-600",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-rose-200 bg-rose-50 text-rose-600",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("flex items-center gap-2", disabled && "cursor-not-allowed opacity-40")}
    >
      <span className="toggle" data-on={checked} />
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  help,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  help?: string;
  disabled?: boolean;
}) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50")}>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[12px] font-medium text-slate-700">{label}</label>
        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {help && <p className="text-[11px] leading-relaxed text-slate-500">{help}</p>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
}: {
  value: T;
  options: Array<{ value: T; label: ReactNode; title?: string }>;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded-md font-medium transition",
            size === "sm" ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-[12px]",
            value === option.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SettingCard({
  title,
  description,
  right,
  children,
  className,
  size = "sm",
}: {
  title?: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: "sm" | "lg";
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white",
        size === "lg" ? "p-5 sm:p-6" : "p-3.5",
        className
      )}
    >
      {(title || right) && (
        <div className={cn("flex items-start justify-between gap-3", size === "lg" ? "mb-4" : "mb-3")}>
          <div>
            {title && (
              <h3
                className={cn(
                  "font-semibold text-slate-900",
                  size === "lg" ? "text-[15.5px]" : "text-[13px]"
                )}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className={cn(
                  "leading-relaxed text-slate-500",
                  size === "lg" ? "mt-1 text-[12.5px]" : "mt-0.5 text-[11px]"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusDot({ status }: { status: number }) {
  const color =
    status < 300
      ? "bg-emerald-400"
      : status < 400
        ? "bg-sky-400"
        : status === 429
          ? "bg-amber-400"
          : "bg-rose-400";
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", color)} />;
}
