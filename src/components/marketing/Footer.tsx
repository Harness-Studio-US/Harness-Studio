import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Mail } from "lucide-react";
import { Logo } from "../Logo";

const columns = [
  {
    title: "Products",
    links: [
      { label: "Harness Studio AI", to: "/#products" },
      { label: "How it works", to: "/#how-it-works" },
      { label: "Interactive demo", to: "/console" },
      { label: "Product guide", to: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/#company" },
      { label: "Brand & press", to: "/brand" },
      { label: "Get started", to: "/get-started" },
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
    <footer className="border-t border-slate-200 bg-[#f3f3f0]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link to="/" aria-label="Harness Studio home">
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-slate-500">
              Harness Studio is an independent software company. Our first product is an AI
              development app that makes building software feel like a conversation.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/Harness-Studio-US"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
                <ArrowUpRight className="h-3 w-3 text-slate-400" />
              </a>
              <a
                href="mailto:HarnessStudio@Outlook.com"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <Mail className="h-3.5 w-3.5" />
                Contact
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13.5px] text-slate-600 transition hover:text-slate-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.title === "Legal" && (
                  <li>
                    <a
                      href="mailto:HarnessStudio@Outlook.com"
                      className="text-[13.5px] text-slate-600 transition hover:text-slate-950"
                    >
                      Contact
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-slate-300/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-slate-500">
            <span>© {new Date().getFullYear()} Harness Studio</span>
            <span className="hidden h-3 w-px bg-slate-300 sm:block" />
            <span>Official website</span>
          </div>
          <div className="text-[11.5px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Create · Build · Innovate
          </div>
        </div>
      </div>
    </footer>
  );
}
