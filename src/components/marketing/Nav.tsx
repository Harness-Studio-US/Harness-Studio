import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { cn } from "../../lib/cn";

const links = [
  { label: "Product", to: "/#product" },
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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
        "fixed inset-x-0 top-0 z-50 border-b bg-paper/95 backdrop-blur-xl transition-shadow",
        scrolled || open ? "border-line shadow-[0_1px_0_rgba(23,21,15,0.02)]" : "border-transparent"
      )}
    >
      <div className="container-site flex h-[76px] items-center justify-between gap-6">
        <Link to="/" className="shrink-0" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-full px-3 py-2 text-[13.5px] font-medium text-muted transition hover:bg-white/70 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            to="/get-started"
            className="text-[13.5px] font-medium text-muted transition hover:text-ink"
          >
            Contact
          </Link>
          <Link to="/console" className="btn-primary h-10 px-4 text-[13px]">
            Open Copilot
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-line bg-surface p-2.5 text-ink lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="border-b border-line/70 py-3 text-[15px] font-medium text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="border-b border-line/70 py-3 text-[15px] font-medium text-ink"
            >
              Contact
            </Link>
          </nav>
          <Link to="/console" className="btn-primary mt-5 h-11 w-full px-4 text-sm">
            Open Harness Copilot
            <ArrowRight className="h-4 w-4" />
          </Link>
          <LegalLinks className="mt-4" />
        </div>
      )}
    </header>
  );
}
