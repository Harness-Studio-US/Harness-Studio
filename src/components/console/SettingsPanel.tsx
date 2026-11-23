import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Database, ShieldCheck, Trash2, X } from "lucide-react";
import { SecurityTab } from "./SecurityTab";
import { formatBytes } from "../../lib/files";
import { cn } from "../../lib/cn";

/** Everything this app keeps in the browser, weighed as UTF-16 like the browser does. */
function harnessStorageBytes(): number {
  let total = 0;
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith("harness-")) continue;
      total += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
  } catch {
    /* storage blocked — report nothing */
  }
  return total * 2;
}

export function SettingsPanel({
  open,
  onClose,
  user,
  onUserChanged,
  onClearHistory,
}: {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onUserChanged?: () => void;
  onClearHistory?: () => void;
}) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [storageBytes, setStorageBytes] = useState(0);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      return;
    }
    if (!rendered) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 190);
    return () => window.clearTimeout(timer);
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [rendered, onClose]);

  useEffect(() => {
    if (!rendered) return;
    setStorageBytes(harnessStorageBytes());
  }, [rendered, cleared]);

  function clearHistory() {
    const confirmed = window.confirm(
      "Delete every chat, draft and project file stored in this browser? This cannot be undone."
    );
    if (!confirmed) return;
    onClearHistory?.();
    setCleared((value) => !value);
  }

  if (!rendered) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex h-full w-full flex-col bg-[#fbfcfe]",
        closing ? "anim-sheet--closing" : "anim-sheet"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <header className="anim-fade-in flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-200 bg-violet-50">
          <ShieldCheck className="h-4 w-4 text-violet-700" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold text-slate-900">Settings</h2>
          <p className="truncate text-[12px] text-slate-500">
            Account security for {user?.email ?? "this workspace"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="press ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-3.5 w-3.5" />
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
          <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                <Database className="h-4 w-4 text-slate-600" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[13.5px] font-semibold text-slate-900">Browser storage</h3>
                <p className="mt-1 text-[12.5px] leading-[1.65] text-slate-600">
                  Chats, drafts and project files are kept in this browser only. They use about{" "}
                  <span className="font-medium text-slate-800">{formatBytes(storageBytes)}</span>.
                  Clearing frees that space and removes the history on this device.
                </p>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="press mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[12px] font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear chat history
                </button>
              </div>
            </div>
          </section>

          <SecurityTab user={user ?? null} onUserChanged={onUserChanged ?? (() => {})} />
        </div>
      </div>
    </div>
  );
}
