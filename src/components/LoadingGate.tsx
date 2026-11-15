import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { cn } from "../lib/cn";

function LoadingScreen({ leaving }: { leaving: boolean }) {
  useLayoutEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div
      className={cn("site-loader", leaving && "site-loader--leaving")}
      role="status"
      aria-label="Loading Harness Studio"
      aria-live="polite"
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="glow-orb left-1/3 top-1/3 h-72 w-72 bg-violet-300/20" />
      <div className="relative flex flex-col items-center gap-8 px-6">
        <Logo markClassName="h-14 w-14" textClassName="text-[28px]" />
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-slate-200">
          <span className="site-loader__progress block h-full w-1/2 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600" />
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          Create · Build · Innovate
        </p>
      </div>
    </div>
  );
}

export function LoadingGate({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setLeaving(true), 650);
    const removeTimer = window.setTimeout(() => setLoading(false), 1000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {children}
      {loading && <LoadingScreen leaving={leaving} />}
    </>
  );
}
