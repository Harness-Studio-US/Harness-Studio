import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { cn } from "../../lib/cn";

const links = [
  { label: "Products", to: "/#products" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Company", to: "/#company" },
  { label: "Guide", to: "/docs" },
  { label: "Brand", to: "/brand" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          ? "border-slate-900/[0.07] bg-[#f8f8f6]/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/get-started"
            className="text-[13.5px] font-medium text-slate-600 transition hover:text-slate-950"
          >
            Get started
          </Link>
          <Link to="/console" className="btn-primary h-10 px-4 text-[13px]">
            Try the demo
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-300/80 bg-white/60 p-2.5 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-[#f8f8f6]/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2.5 text-[15px] text-slate-700 hover:bg-white hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="mt-2 rounded-lg px-3 py-2.5 text-[15px] text-slate-700 hover:bg-white hover:text-slate-950"
            >
              Get started
            </Link>
            <Link to="/console" className="btn-primary mt-2 h-11 px-4 text-sm">
              Try the demo
            </Link>
            <LegalLinks className="mt-4 px-3" />
          </nav>
        </div>
      )}
    </header>
  );
}
