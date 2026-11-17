import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "harness-cookie-notice-v1";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // The notice can still be dismissed for this visit if storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie notice"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur sm:flex-row sm:items-center sm:gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-accent-strong">
          <Cookie className="h-4 w-4" aria-hidden />
        </span>

        <div className="min-w-0 flex-1 text-[12.5px] leading-[1.65] text-muted">
          <p>
            <span className="font-semibold text-ink">No tracking cookies.</span>{" "}
            <span className="hidden sm:inline">
              We only use the browser storage needed to run the site, keep your Copilot session
              signed in, and remember this notice. We do not use advertising or tracking cookies,
              and we do not sell your information.
            </span>
            <span className="sm:hidden">
              We only use the storage needed to run the site and keep you signed in.
            </span>
          </p>
          <p className="mt-1">
            By continuing, you agree to our{" "}
            <Link
              to="/terms"
              className="font-medium text-ink underline decoration-[#94A3B8] underline-offset-2 hover:decoration-ink"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-ink underline decoration-[#94A3B8] underline-offset-2 hover:decoration-ink"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={accept}
          className="btn-primary h-9 shrink-0 whitespace-nowrap px-4 text-[12.5px]"
        >
          Agree &amp; continue
        </button>
      </div>
    </aside>
  );
}
