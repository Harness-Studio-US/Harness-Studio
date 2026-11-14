import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { cn } from "../../lib/cn";
import { initialsFor, providerLabel, useAuth } from "../../lib/auth";

const links = [
  { label: "Product", to: "/#product" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Examples", to: "/#examples" },
  { label: "Guide", to: "/docs" },
  { label: "Brand", to: "/brand" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-slate-200 bg-[#f7f8fb]/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-1 pr-2.5 transition hover:bg-slate-100"
                title={`Signed in with ${providerLabel(user.provider)} · preview session`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 font-mono text-[9px] font-semibold text-slate-800">
                  {initialsFor(user.name)}
                </span>
                <span className="max-w-[92px] truncate text-[12px] font-medium text-slate-700">
                  {user.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:text-slate-900"
            >
              Sign in
            </Link>
          )}
          <Link to="/console" className="btn-primary h-9 px-4 text-[13px]">
            Try the AI
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-[#f7f8fb]/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 font-mono text-[10px] font-semibold text-slate-800">
                  {initialsFor(user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] text-slate-800">{user.name}</div>
                  <div className="text-[9.5px] text-slate-400">
                    {providerLabel(user.provider)} · preview session
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="rounded p-1.5 text-slate-500 hover:text-slate-900"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
            )}
            <Link to="/console" className="btn-primary mt-2 h-10 px-4 text-sm">
              Try the AI
            </Link>
            <LegalLinks className="mt-3 px-3" />
          </nav>
        </div>
      )}
    </header>
  );
}
