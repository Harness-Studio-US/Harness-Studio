import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/cn";

export function CopyButton({
  text,
  className,
  tone = "light",
  iconOnly = false,
}: {
  text: string;
  className?: string;
  tone?: "light" | "dark";
  /** Just the glyph, for rows of small message actions. */
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition",
        tone === "dark"
          ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          : "border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900",
        className
      )}
    >
      {copied ? (
        <Check className={cn("h-3 w-3", tone === "dark" ? "text-emerald-400" : "text-emerald-600")} />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {!iconOnly && (copied ? "Copied" : "Copy")}
    </button>
  );
}

export function CodeBlock({
  code,
  lang,
  filename,
  className,
  children,
  copyText,
}: {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
  children?: ReactNode;
  copyText?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/[0.09] bg-[#07090f] shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.025] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]/60" />
          </div>
          <span className="truncate font-mono text-[11px] text-zinc-500">
            {filename ?? (lang ? `snippet.${lang}` : "output")}
          </span>
        </div>
        <CopyButton text={copyText ?? code} className="shrink-0" tone="dark" />
      </div>
      <div className="overflow-x-auto p-3.5">
        {children ?? (
          <pre className="font-mono text-[12px] leading-[1.7] text-zinc-300">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
