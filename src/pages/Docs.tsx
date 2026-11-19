import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Sparkles,
  Undo2,
  Wand2,
} from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import { DocsSidebar, useActiveHeading } from "../components/docs-ui";

const sections = [
  { id: "welcome", label: "Welcome" },
  { id: "getting-started", label: "Getting started" },
  { id: "first-conversation", label: "Your first conversation" },
  { id: "changes", label: "How changes work" },
  { id: "review", label: "Reviewing & undoing" },
  { id: "better-requests", label: "Better requests" },
  { id: "project", label: "Working with your project" },
  { id: "privacy", label: "Privacy & control" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "contact", label: "Still stuck?" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line py-10 first:border-0 first:pt-0">
      <h2 className="text-[27px] font-semibold tracking-[-0.035em] text-ink">{title}</h2>
      <div className="mt-5 space-y-4 text-[15.5px] leading-[1.8] text-ink-soft">{children}</div>
    </section>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c8c1b4] bg-paper text-[11px] font-semibold text-ink">
          {number}
        </span>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-3 text-[14px] leading-[1.7] text-muted">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 border-l-2 border-accent bg-violet-50 px-4 py-3.5 text-[14px] leading-[1.75] text-ink-soft">
      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-accent" />
      <div>{children}</div>
    </div>
  );
}

const requestTips = [
  [
    "Say what you want to happen",
    "“Make the save button easier to find.” You don’t need to name the file or the fix.",
  ],
  [
    "Mention where you are",
    "“On the settings page…” or “On mobile…” helps Copilot look in the right place.",
  ],
  [
    "Describe the feeling",
    "“It feels too crowded” is useful. Design feedback doesn’t need to be technical.",
  ],
  [
    "Ask for options",
    "“Show me two versions” works when you’re not sure what you want yet.",
  ],
  [
    "Follow up",
    "“A little smaller” or “keep that, change the colour” is enough. Copilot remembers the thread.",
  ],
];

export default function Docs() {
  const active = useActiveHeading(sections.map((section) => section.id));

  useEffect(() => {
    document.title = "Harness Copilot guide — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />

      <main className="pb-20 pt-28 lg:pt-32">
        <div className="container-site">
          <header className="max-w-[900px] border-b border-line pb-10">
            <span className="eyebrow">Harness Copilot / Product guide</span>
            <h1 className="mt-6 max-w-[820px] text-[46px] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-[64px]">
              Build with a <span className="display-serif text-accent">conversation.</span>
            </h1>
            <p className="mt-6 max-w-[680px] text-[17px] leading-[1.8] text-muted">
              Everything you need to start working with Harness Copilot, without learning a new
              language or reading a developer manual.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/console" className="btn-primary h-11 px-4.5 text-[13.5px]">
                <MessageSquare className="h-3.5 w-3.5" />
                Open Harness Copilot
              </Link>
              <a href="#getting-started" className="btn-ghost h-11 px-4.5 text-[13.5px]">
                Start with the basics
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
              <span>Product guide</span>
              <span className="h-3 w-px bg-[#c8c1b4]" aria-hidden />
              <span>10 minute read</span>
              <span className="h-3 w-px bg-[#c8c1b4]" aria-hidden />
              <span>Updated November 2026</span>
            </div>
          </header>

          <div className="mt-8 grid gap-3 border-b border-line pb-10 sm:grid-cols-3">
            {[
              { icon: MessageSquare, title: "On the web", body: "Talk in your browser." },
              { icon: Monitor, title: "In the project", body: "The change happens in place." },
              { icon: Eye, title: "On your terms", body: "Review, tweak or undo." },
            ].map((item) => (
              <div key={item.title} className="border-l border-line pl-4 first:border-l-0 first:pl-0">
                <item.icon className="h-4 w-4 text-accent" strokeWidth={1.8} />
                <div className="mt-2 text-[13.5px] font-semibold text-ink">{item.title}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.body}</div>
              </div>
            ))}
          </div>

          <details className="group mt-6 rounded-lg border border-line bg-surface lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[13px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-line p-2">
              <DocsSidebar sections={sections} active={active} />
            </div>
          </details>

          <div className="mt-10 grid gap-12 lg:grid-cols-[230px_minmax(0,760px)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  On this page
                </div>
                <DocsSidebar sections={sections} active={active} />
                <div className="mt-7 rounded-lg border border-line bg-surface p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                    <MessageSquare className="h-3.5 w-3.5 text-accent" />
                    New to this?
                  </div>
                  <p className="mt-2 text-[12.5px] leading-[1.65] text-muted">
                    Start with a sentence. There is no setup and no special format.
                  </p>
                  <Link
                    to="/console"
                    className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent-strong hover:underline"
                  >
                    Open Copilot <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>

            <article className="min-w-0">
              <Section id="welcome" title="Welcome">
                <p>
                  Harness Copilot is the AI development app from Harness Studio. It lives on the
                  web, so you can talk through an idea from anywhere while the work happens in your
                  project.
                </p>
                <p>
                  You don’t need to know the right words, the right file or the right setting.
                  Describe what you want, and Copilot will figure out the rest with you.
                </p>
                <Tip>
                  If you can explain it to a teammate, you can ask Copilot. There is no secret
                  command and no wrong way to start.
                </Tip>
              </Section>

              <Section id="getting-started" title="Getting started">
                <p>Your first change takes three small steps.</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Step number="1" title="Open your project">
                    Have the project you want to work on open in your workspace.
                  </Step>
                  <Step number="2" title="Open Harness Copilot">
                    Sign in or create an account. Accept the terms once, and the workspace is
                    ready.
                  </Step>
                  <Step number="3" title="Say what you want">
                    Describe the change in a sentence. Copilot will take it from there.
                  </Step>
                </div>
                <p>
                  That is it. Start with something small, like changing a label, moving a button or
                  asking what a screen does, and build from there.
                </p>
              </Section>

              <Section id="first-conversation" title="Your first conversation">
                <p>
                  A good first request is specific about the outcome, not the implementation. You
                  don’t have to explain how to do it.
                </p>
                <div className="space-y-3 rounded-lg border border-line bg-surface p-4 sm:p-5">
                  <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-paper-deep px-3.5 py-2.5 text-[13px] leading-[1.65] text-ink">
                    The sign-up page feels a little plain. Can you make it warmer and easier to
                    read?
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
                      <Sparkles className="h-3 w-3 text-accent" />
                    </div>
                    <div className="max-w-[88%] rounded-xl rounded-tl-sm border border-line bg-[#fdfbf6] px-3.5 py-2.5 text-[13px] leading-[1.7] text-ink-soft">
                      I would give the page a softer background, make the heading friendlier and
                      give the form more breathing room. I can also add a short line explaining what
                      happens after sign-up. Want me to try that?
                    </div>
                  </div>
                </div>
                <p>
                  From there, keep the conversation going: “yes, try it”, “make the heading
                  smaller”, or “actually, keep the original colours”. Copilot follows the thread.
                </p>
              </Section>

              <Section id="changes" title="How changes work">
                <p>
                  The chat is where you describe the outcome. Harness Copilot is where the change
                  takes shape. You will see a summary of what Copilot did, in plain language,
                  rather than a wall of code.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["You describe it", "A sentence, a screenshot or a quick note about the screen."],
                    ["Copilot makes it", "The app is updated in the place where your project lives."],
                    ["You review it", "Try the result, ask for a tweak or undo it."],
                    ["You keep it", "Only the changes you are happy with stay."],
                  ].map(([title, body]) => (
                    <div key={title} className="hover-lift rounded-lg border border-line bg-surface p-4">
                      <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                        <Check className="h-3.5 w-3.5 text-[#047857]" />
                        {title}
                      </div>
                      <p className="mt-1.5 text-[13px] leading-[1.65] text-muted">{body}</p>
                    </div>
                  ))}
                </div>
                <p>
                  If something doesn’t look right, say so. “That’s too much” and “I liked the old
                  spacing” are useful feedback.
                </p>
              </Section>

              <Section id="review" title="Reviewing & undoing">
                <p>
                  You are never stuck with a change. When Copilot shows you the result, you have a
                  few simple choices:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      icon: Check,
                      title: "Keep it",
                      body: "The change stays and you can move on to the next thing.",
                    },
                    {
                      icon: Wand2,
                      title: "Tweak it",
                      body: "Ask for a different colour, more space or simpler copy — whatever needs adjusting.",
                    },
                    {
                      icon: Undo2,
                      title: "Undo it",
                      body: "Go back to how it was before. No explanation needed.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="hover-lift flex gap-3 rounded-lg border border-line bg-surface p-4"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-paper">
                        <item.icon className="h-3.5 w-3.5 text-accent" />
                      </span>
                      <div>
                        <div className="text-[13.5px] font-semibold text-ink">{item.title}</div>
                        <p className="mt-1 text-[13px] leading-[1.65] text-muted">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="better-requests" title="Better requests">
                <p>
                  There is no special formula. These small habits make the conversation smoother,
                  though.
                </p>
                <div className="divide-y divide-line rounded-lg border border-line bg-surface">
                  {requestTips.map(([title, body]) => (
                    <div key={title} className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                        <ChevronRight className="h-3.5 w-3.5 text-accent" />
                        {title}
                      </div>
                      <p className="mt-1 pl-[22px] text-[13px] leading-[1.7] text-muted">{body}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="project" title="Working with your project">
                <p>
                  Think of the chat as the place you explain the idea, and Harness Copilot as the
                  place where it becomes real. You can keep the chat open while you look at the app.
                </p>
                <p>
                  Start with the screen in front of you. You don’t need to know the file name, the
                  component structure or how the data flows. If you do know, you can mention it,
                  but it is optional.
                </p>
                <Tip>
                  Not sure where to start? Ask Copilot to walk you through the project first. A
                  quick tour can make the next request much easier.
                </Tip>
              </Section>

              <Section id="privacy" title="Privacy & control">
                <p>
                  Your project is yours. Harness Copilot is designed to keep you informed about
                  what it is doing and to let you decide what stays.
                </p>
                <div className="flex gap-3 rounded-lg border border-[#a7d7c5] bg-[#effaf4] p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                  <p className="text-[13px] leading-[1.7] text-ink-soft">
                    Avoid pasting passwords, private keys or personal information into any chat. If
                    something sensitive needs to change, handle that part directly in your project.
                  </p>
                </div>
              </Section>

              <Section id="troubleshooting" title="Troubleshooting">
                <div className="space-y-3">
                  {[
                    [
                      "Nothing seems to have changed",
                      "Check that your project is open in your workspace and that you are looking at the right screen. If it still looks the same, ask Copilot which screen it changed and point it at the one you meant.",
                    ],
                    [
                      "It changed the wrong thing",
                      "Tell Copilot what is off and ask it to undo. Then point to the screen or detail you meant. “Not that button — the one at the bottom” is a perfectly good correction.",
                    ],
                    [
                      "I don’t know what to ask",
                      "Start with what you see: “This feels confusing”, “I want to add a page” or “Explain this screen to me.” Copilot can help you turn that into a concrete next step.",
                    ],
                    [
                      "I want a fresh start",
                      "Open a new chat. Your old conversation stays in the sidebar if you need to come back to it.",
                    ],
                  ].map(([title, body]) => (
                    <div key={title} className="hover-lift rounded-lg border border-line bg-surface p-4">
                      <div className="text-[13.5px] font-semibold text-ink">{title}</div>
                      <p className="mt-1.5 text-[13px] leading-[1.7] text-muted">{body}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section id="contact" title="Still stuck?">
                <p>
                  We are building Harness Studio in the open and we would love to hear what is
                  confusing, missing or just not clicking. A real person reads every note.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio%20question"
                    className="btn-primary h-10 px-4 text-[13px]"
                  >
                    Ask us a question
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <Link to="/console" className="btn-ghost h-10 px-4 text-[13px]">
                    Open Harness Copilot
                  </Link>
                </div>
                <p className="mt-4 text-[13px] text-muted">
                  Prefer to talk it through? Call{" "}
                  <a
                    href="tel:+18203861976"
                    className="font-medium text-ink underline decoration-[#b8b1a3] underline-offset-3 hover:decoration-ink"
                  >
                    +1 (820) 386-1976
                  </a>
                  .
                </p>
              </Section>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[12px] text-muted">
                <span>Last updated November 2026</span>
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-ink">
                  Back to Harness Studio
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
