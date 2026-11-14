import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronDown, FileText, Mail, ShieldCheck } from "lucide-react";
import { Footer } from "../components/marketing/Footer";
import { Nav } from "../components/marketing/Nav";
import {
  privacyPolicy,
  termsOfService,
  type LegalBlock,
  type LegalDocument,
  type LegalSection,
} from "../data/legal";

const EMAIL = "HarnessStudio@Outlook.com";

function EmailText({ text }: { text: string }) {
  const parts = text.split(EMAIL);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <a
              href={`mailto:${EMAIL}`}
              className="text-violet-700 underline decoration-violet-400/30 underline-offset-2 hover:text-violet-700"
            >
              {EMAIL}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "h3") {
    return (
      <h3 className="pt-2 text-[13.5px] font-semibold text-slate-900">{block.text}</h3>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-slate-600 marker:text-violet-600/70">
        {block.items.map((item) => (
          <li key={item}>
            <EmailText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-[12.5px] leading-[1.85] text-slate-600">
      <EmailText text={block.text} />
    </p>
  );
}

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function TocList({ sections }: { sections: LegalSection[] }) {
  return (
    <nav aria-label="On this page" className="space-y-0.5">
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className="flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-[11px] leading-snug text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <span className="mt-px font-mono text-[9px] text-slate-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{section.title}</span>
        </button>
      ))}
    </nav>
  );
}

function LegalPage({ doc, kind }: { doc: LegalDocument; kind: "privacy" | "terms" }) {
  const other =
    kind === "privacy"
      ? { label: "Terms & Conditions", to: "/terms" }
      : { label: "Privacy Policy", to: "/privacy" };

  useEffect(() => {
    window.document.title = `${doc.title} — Harness Studio`;
  }, [doc.title]);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-800">
      <Nav />
      <main className="relative overflow-hidden pb-24 pt-28">
        <div className="grid-bg absolute inset-x-0 top-0 h-[420px]" />
        <div className="glow-orb left-[8%] top-10 h-64 w-64 bg-violet-300/25" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
              {kind === "privacy" ? (
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
              ) : (
                <FileText className="h-3 w-3 text-violet-600" />
              )}
              {doc.eyebrow}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.035em] text-slate-900 sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
              {doc.summary}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[10.5px] text-slate-500">
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1">
                Effective {doc.effective}
              </span>
              <span className="hidden h-3 w-px bg-slate-200 sm:block" />
              <Link to={other.to} className="hover:text-slate-800">
                Also read {other.label} →
              </Link>
            </div>
          </div>

          <details className="group mt-8 rounded-xl border border-slate-200 bg-white lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-[11.5px] font-medium text-slate-700 [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-slate-200 p-2">
              <TocList sections={doc.sections} />
            </div>
          </details>

          <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="mb-2 px-2.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  On this page
                </div>
                <TocList sections={doc.sections} />
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                    <Mail className="h-3 w-3 text-violet-600" />
                    Questions?
                  </div>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">
                    Contact the Service Provider about this policy.
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-2 block break-all text-[10px] text-violet-700 hover:text-violet-700"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
            </aside>

            <article className="min-w-0 max-w-3xl">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                {doc.intro.map((paragraph) => (
                  <p key={paragraph} className="text-[12.5px] leading-[1.85] text-slate-600">
                    <EmailText text={paragraph} />
                  </p>
                ))}
              </div>

              <div className="mt-2 divide-y divide-slate-200">
                {doc.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24 py-8">
                    <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">
                      {section.title}
                    </h2>
                    <div className="mt-3.5 space-y-3.5">
                      {section.blocks.map((block, index) => (
                        <Block key={`${section.id}-${index}`} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-transparent p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                    <Mail className="h-4 w-4 text-violet-700" />
                  </span>
                  <div>
                    <div className="text-[12.5px] font-medium text-slate-800">
                      Contact the Service Provider
                    </div>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                      Questions about {kind === "privacy" ? "privacy" : "these terms"} can be sent
                      directly to the address below.
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-2 inline-flex break-all text-[12px] text-violet-700 hover:text-violet-700"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <Link to={other.to} className="text-[11.5px] text-slate-500 hover:text-slate-800">
                  {other.label} →
                </Link>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10.5px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <ArrowUp className="h-3 w-3" />
                  Back to top
                </button>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function PrivacyPolicy() {
  return <LegalPage doc={privacyPolicy} kind="privacy" />;
}

export function TermsOfService() {
  return <LegalPage doc={termsOfService} kind="terms" />;
}
