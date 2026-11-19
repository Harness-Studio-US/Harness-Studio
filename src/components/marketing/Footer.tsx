import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Mail, Phone } from "lucide-react";
import { Logo } from "../Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Harness Copilot", to: "/#product" },
      { label: "How it works", to: "/#how-it-works" },
      { label: "Open Copilot", to: "/console" },
      { label: "Product guide", to: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/#company" },
      { label: "Brand & press", to: "/brand" },
      { label: "Contact", to: "/get-started" },
      { label: "Questions", to: "/#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms & conditions", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="container-site py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link to="/" aria-label="Harness Studio home">
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.7] text-muted">
              Harness Studio is an independent software company. Our first product, Harness Copilot,
              brings the work of building software closer to the way people naturally explain it.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/Harness-Studio-US"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-medium text-ink transition hover:border-[#a9a193]"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
                <ArrowUpRight className="h-3 w-3 text-muted" />
              </a>
              <a
                href="mailto:message.harness.studio@outlook.com"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-medium text-ink transition hover:border-[#a9a193]"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
              <a
                href="tel:+18203861976"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[12.5px] font-medium text-ink transition hover:border-[#a9a193]"
              >
                <Phone className="h-3.5 w-3.5" />
                +1 (820) 386-1976
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13.5px] text-ink-soft transition hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-slate-300 pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} Harness Studio</span>
            <span className="hidden h-3 w-px bg-[#c8c1b4] sm:block" aria-hidden />
            <span>Independent software company</span>
          </div>
          <span className="font-medium uppercase tracking-[0.16em]">Create · Build · Innovate</span>
        </div>
      </div>
    </footer>
  );
}
