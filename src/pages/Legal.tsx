import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronDown, FileText, Mail, ShieldCheck } from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import {
  privacyPolicy,
  termsOfService,
  type LegalBlock,
  type LegalDocument,
  type LegalSection,
} from "../data/legal";

const EMAIL = "message.harness.studio@outlook.com";

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
              className="font-medium text-accent-strong underline decoration-[#C4B5FD] underline-offset-2 hover:text-ink"
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
    return <h3 className="pt-2 text-[15.5px] font-semibold text-ink">{block.text}</h3>;
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-[1.8] text-ink-soft marker:text-accent">
        {block.items.map((item) => (
          <li key={item}>
            <EmailText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-[15px] leading-[1.85] text-ink-soft">
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
          className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-[12.5px] leading-snug text-muted transition hover:bg-[#F1F5F9] hover:text-ink"
        >
          <span className="mt-0.5 font-mono text-[10px] text-[#475569]">
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
    <div className="min-h-screen bg-paper text-ink">
      <Nav />

      <main className="pb-20 pt-28 lg:pt-32">
        <div className="container-site">
          <header className="max-w-[900px] border-b border-line pb-9">
            <span className="eyebrow">
              {kind === "privacy" ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {doc.eyebrow}
            </span>
            <h1 className="mt-6 text-[46px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[60px]">
              {doc.title}
            </h1>
            <p className="mt-5 max-w-[720px] text-[16.5px] leading-[1.8] text-muted">
              {doc.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted">
              <span>Effective {doc.effective}</span>
              <span className="h-3 w-px bg-[#CBD5E1]" aria-hidden />
              <Link
                to={other.to}
                className="font-medium text-ink underline decoration-[#94A3B8] underline-offset-3 hover:decoration-ink"
              >
                Also read {other.label}
              </Link>
            </div>
          </header>

          <details className="group mt-6 rounded-lg border border-line bg-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[13px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-line p-2">
              <TocList sections={doc.sections} />
            </div>
          </details>

          <div className="mt-10 grid gap-12 lg:grid-cols-[230px_minmax(0,760px)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="mb-3 px-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  On this page
                </div>
                <TocList sections={doc.sections} />
                <div className="mt-7 rounded-lg border border-line bg-surface p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    Questions?
                  </div>
                  <p className="mt-2 text-[12px] leading-[1.65] text-muted">
                    Contact Harness Studio about this {kind === "privacy" ? "policy" : "agreement"}.
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-2.5 block break-all text-[11.5px] font-medium text-accent-strong hover:underline"
                  >
                    {EMAIL}
                  </a>
                  <a
                    href="tel:+18203861976"
                    className="mt-1.5 block text-[11.5px] font-medium text-accent-strong hover:underline"
                  >
                    +1 (820) 386-1976
                  </a>
                </div>
              </div>
            </aside>

            <article className="min-w-0 max-w-[760px]">
              <div className="space-y-4 rounded-lg border border-line bg-surface p-5 sm:p-6">
                {doc.intro.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-[1.85] text-ink-soft">
                    <EmailText text={paragraph} />
                  </p>
                ))}
              </div>

              <div className="mt-2 divide-y divide-line">
                {doc.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28 py-9">
                    <h2 className="text-[23px] font-semibold tracking-[-0.025em] text-ink">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4">
                      {section.blocks.map((block, index) => (
                        <Block key={`${section.id}-${index}`} block={block} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="rounded-lg border border-line bg-[#F5F3FF] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E9D5FF] bg-surface">
                    <Mail className="h-4 w-4 text-accent" />
                  </span>
                  <div>
                    <div className="text-[14px] font-semibold text-ink">
                      Contact Harness Studio
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.7] text-muted">
                      Questions about {kind === "privacy" ? "privacy" : "these terms"} can be sent
                      directly to the address below.
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-2.5 inline-flex break-all text-[13px] font-medium text-accent-strong hover:underline"
                    >
                      {EMAIL}
                    </a>
                    <a
                      href="tel:+18203861976"
                      className="mt-1.5 block text-[13px] font-medium text-accent-strong hover:underline"
                    >
                      +1 (820) 386-1976
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <Link
                  to={other.to}
                  className="text-[12.5px] font-medium text-muted hover:text-ink"
                >
                  {other.label} →
                </Link>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-2 text-[12px] text-muted transition hover:text-ink"
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
