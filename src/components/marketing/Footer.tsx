import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "../Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", to: "/#how-it-works" },
      { label: "Examples", to: "/#examples" },
      { label: "Try the AI", to: "/console" },
      { label: "Guide", to: "/docs" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", to: "/#studio" },
      { label: "Brand assets", to: "/brand" },
      { label: "Questions", to: "/#faq" },
    ],
  },
  {
    title: "The fine print",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Security", to: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#fbfcfe]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link to="/" aria-label="Harness Studio home">
              <Logo stacked={false} />
            </Link>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-slate-500">
              Harness Studio is a development app with an AI teammate. Talk to it on the web. Build
              in the app. Keep the good parts.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Github, label: "GitHub" },
                { icon: Twitter, label: "X" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  title={`${label} — coming soon`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-slate-600 transition hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Harness Studio, Inc.</span>
            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
            <Link to="/privacy" className="transition hover:text-slate-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-slate-700">
              Terms &amp; Conditions
            </Link>
            <a href="mailto:HarnessStudio@Outlook.com" className="transition hover:text-slate-700">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Made for people who build
          </div>
        </div>
      </div>
    </footer>
  );
}
