import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Mail, MessageSquare } from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";

const nextSteps = [
  {
    title: "Tell us what you are working on",
    body: "A sentence or two is plenty. We will help you find the right place to start.",
  },
  {
    title: "Talk to the studio",
    body: "A real person on the team reads every message and replies directly.",
  },
  {
    title: "Try Harness Copilot",
    body: "We will walk you through the workspace and your first change.",
  },
];

const benefits = [
  "A real conversation with the team",
  "A walkthrough of Harness Copilot",
  "Room to ask questions as you go",
  "A direct line to the people building it",
];

export default function GetStarted() {
  useEffect(() => {
    document.title = "Contact — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />

      <main className="pb-20 pt-28 lg:pt-36">
        <div className="container-site">
          <div className="grid items-start gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
            <div>
              <span className="eyebrow">Contact the studio</span>
              <h1 className="mt-6 max-w-[640px] text-[46px] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-[68px]">
                Let’s find the{" "}
                <span className="display-serif text-accent">right place to start.</span>
              </h1>
              <p className="mt-7 max-w-[540px] text-[16.5px] leading-[1.8] text-muted">
                Tell us what you are building, or what you would like to change. We will help you
                get set up with Harness Copilot, or point you somewhere more useful. No sales
                script, just a useful conversation.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio%20access"
                  className="btn-primary h-12 px-5 text-[14px]"
                >
                  <Mail className="h-4 w-4" />
                  Email the studio
                </a>
                <Link to="/console" className="btn-ghost h-12 px-5 text-[14px]">
                  Open Harness Copilot
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-[12.5px] text-muted">
                Prefer email? Write to{" "}
                <a
                  href="mailto:message.harness.studio@outlook.com"
                  className="font-medium text-ink underline decoration-[#b8b1a3] underline-offset-3 hover:decoration-ink"
                >
                  message.harness.studio@outlook.com
                </a>
                .
              </p>

              <div className="mt-12 grid max-w-[580px] gap-x-8 gap-y-4 border-t border-line pt-7 sm:grid-cols-2">
                {benefits.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#a7d7c5] bg-[#effaf4]">
                      <Check className="h-2.5 w-2.5 text-[#047857]" />
                    </span>
                    <span className="text-[13.5px] leading-[1.65] text-ink-soft">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-3 text-[12.5px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-[#047857]" />
                A real person reads every message.
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface">
              <div className="border-b border-line p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-paper">
                    <MessageSquare className="h-[18px] w-[18px] text-accent" strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-ink">What happens next</div>
                    <div className="mt-0.5 text-[12px] text-muted">A simple, human process</div>
                  </div>
                </div>

                <ol className="mt-8">
                  {nextSteps.map((step, index) => (
                    <li
                      key={step.title}
                      className="grid grid-cols-[34px_1fr] gap-4 border-t border-line py-5 first:border-t-0 first:pt-0"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c8c1b4] bg-paper font-mono text-[11px] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="text-[14px] font-semibold text-ink">{step.title}</div>
                        <p className="mt-1.5 text-[13px] leading-[1.7] text-muted">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Want to look around first?
                </div>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-soft">
                  Open the early preview, accept the terms once, and try the conversation. Responses
                  are simulated and chats stay in your browser.
                </p>
                <Link
                  to="/console"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-strong hover:underline"
                >
                  Open the preview
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[12px] text-muted">
            <span>Harness Studio · Independent software company</span>
            <Link to="/docs" className="inline-flex items-center gap-1.5 hover:text-ink">
              Read the product guide
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
