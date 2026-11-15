import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
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

function getSecondaryPagePath(anchor: HTMLAnchorElement): string | null {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (href.startsWith("#") && !href.startsWith("#/")) return null;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;

  let path = url.hash.startsWith("#/")
    ? url.hash.slice(1).split("#")[0].split("?")[0]
    : url.pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (!path || path === "/") return null;
  return path;
}

function ActionLoadingScreen() {
  const location = useLocation();
  const pathnameRef = useRef(location.pathname);
  pathnameRef.current = location.pathname;
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const fadeTimer = useRef<number | undefined>(undefined);
  const removeTimer = useRef<number | undefined>(undefined);

  const clearTimers = () => {
    window.clearTimeout(fadeTimer.current);
    window.clearTimeout(removeTimer.current);
  };

  const show = () => {
    clearTimers();
    setActive(true);
    setLeaving(false);
    fadeTimer.current = window.setTimeout(() => setLeaving(true), 550);
    removeTimer.current = window.setTimeout(() => setActive(false), 850);
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (!(event.target instanceof Element)) return;

      const control = event.target.closest<HTMLElement>(
        ".btn-primary, .btn-ghost, [data-page-loader]"
      );
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      const secondaryPath = anchor ? getSecondaryPagePath(anchor) : null;
      const isSecondaryPageLink = !!secondaryPath && secondaryPath !== pathnameRef.current;

      if (!control && !isSecondaryPageLink) return;
      if (control && pathnameRef.current === "/console") return;
      if ((control ?? anchor)?.closest("[data-no-page-loader]")) return;

      const target = control ?? anchor;
      if (!target) return;
      if (target.getAttribute("aria-disabled") === "true") return;
      if (target instanceof HTMLButtonElement && target.disabled) return;
      if (target instanceof HTMLAnchorElement) {
        if (target.target && target.target !== "_self") return;
        if (target.hasAttribute("download")) return;
      }

      show();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => () => clearTimers(), []);

  return active ? <LoadingScreen leaving={leaving} /> : null;
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
      {!loading && <ActionLoadingScreen />}
    </>
  );
}
