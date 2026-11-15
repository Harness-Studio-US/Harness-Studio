import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Sparkles,
  Undo2,
  Wand2,
} from "lucide-react";
import { Logo } from "../components/Logo";
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
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-9 first:border-0 first:pt-2">
      <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4 text-[14px] leading-[1.8] text-slate-600">{children}</div>
    </section>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-[9px] font-semibold text-violet-700">
          {number}
        </span>
        <h3 className="text-[13.5px] font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-[13px] leading-relaxed text-slate-600">
      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600" />
      <div>{children}</div>
    </div>
  );
}

const requestTips = [
  ["Say what you want to happen", "“Make the save button easier to find.” You don’t need to name the file or the fix."],
  ["Mention where you are", "“On the settings page…” or “On mobile…” helps Harness look in the right place."],
  ["Describe the feeling", "“It feels too crowded” is useful. Design feedback doesn’t need to be technical."],
  ["Ask for options", "“Show me two versions” works when you’re not sure what you want yet."],
  ["Follow up", "“A little smaller” or “keep that, change the colour” is enough. Harness remembers the thread."],
];

export default function Docs() {
  const active = useActiveHeading(sections.map((s) => s.id));

  useEffect(() => {
    document.title = "Guide — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f8f8f6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-5">
            <Link to="/" aria-label="Harness Studio home">
              <Logo />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-1.5 text-[12px] text-slate-600 sm:flex">
              <BookOpen className="h-3.5 w-3.5" />
              Guide
              <span className="text-slate-400">/</span>
              <span className="text-slate-500">Harness Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-slate-600 hover:text-slate-900 sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <Link to="/console" className="btn-primary h-8 px-3.5 text-[12px]">
              Try the demo
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              On this page
            </div>
            <DocsSidebar sections={sections} active={active} />
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                <MessageSquare className="h-3 w-3 text-violet-600" />
                New to this?
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">
                Start with a sentence. There’s no setup and no special format.
              </p>
              <Link to="/console" className="mt-2 inline-flex text-[10.5px] text-violet-700">
                Try the demo →
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              The friendly guide
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              Build with a conversation.
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-[1.75] text-slate-600">
              Everything you need to start working with the Harness Studio AI — without learning a
              new language or reading a developer manual.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/console" className="btn-primary h-9 px-3.5 text-[12px]">
                <MessageSquare className="h-3.5 w-3.5" />
                Try the demo
              </Link>
              <a href="#getting-started" className="btn-ghost h-9 px-3.5 text-[12px]">
                Start with the basics
              </a>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: MessageSquare, title: "On the web", body: "Chat in your browser." },
                { icon: Monitor, title: "In the app", body: "Changes happen in Harness Studio." },
                { icon: Eye, title: "On your terms", body: "Review, tweak or undo." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-3">
                  <item.icon className="h-3.5 w-3.5 text-violet-600" />
                  <div className="mt-2 text-[11.5px] font-medium text-slate-800">{item.title}</div>
                  <div className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{item.body}</div>
                </div>
              ))}
            </div>
          </div>

          <Section id="welcome" title="Welcome">
            <p>
              Harness Studio is a development app for building software. It has an AI teammate who
              lives on the web, so you can talk through an idea from anywhere — while the work
              happens in your project inside the app.
            </p>
            <p>
              You don’t need to know the right words, the right file or the right setting. Describe
              what you want, and Harness will figure out the rest with you.
            </p>
            <Tip>
              If you can explain it to a teammate, you can ask Harness. There’s no secret command
              and no wrong way to start.
            </Tip>
          </Section>

          <Section id="getting-started" title="Getting started">
            <p>Your first change takes three small steps.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Step number="1" title="Open your project">
                Have the project you want to work on open in Harness Studio.
              </Step>
              <Step number="2" title="Open the chat">
                Go to the AI in your browser. A quick demo sign-in gets you into the chat.
              </Step>
              <Step number="3" title="Say what you want">
                Describe the change in a sentence. Harness will take it from there.
              </Step>
            </div>
            <p>
              That’s it. You can start with something tiny — changing a label, moving a button or
              asking what a screen does — and build up from there.
            </p>
          </Section>

          <Section id="first-conversation" title="Your first conversation">
            <p>
              A good first request is specific about the outcome, not the implementation. You don’t
              have to explain how to do it.
            </p>
            <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-[12px] text-slate-700">
                The sign-up page feels a little plain. Can you make it warmer and easier to read?
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                  <Sparkles className="h-3 w-3 text-violet-600" />
                </div>
                <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-slate-200 bg-[#fbfcfe] px-3.5 py-2.5 text-[12px] leading-relaxed text-slate-600">
                  I’d give the page a softer background, make the heading friendlier and give the
                  form more breathing room. I can also add a short line explaining what happens
                  after sign-up. Want me to try that?
                </div>
              </div>
            </div>
            <p>
              From there, keep the conversation going: “yes, try it”, “make the heading smaller”,
              or “actually, keep the original colours”. Harness follows the thread.
            </p>
          </Section>

          <Section id="changes" title="How changes work">
            <p>
              The chat is where you describe the outcome. Harness Studio is where the change takes
              shape. You’ll see a summary of what Harness did, in plain language, rather than a wall
              of code.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["You describe it", "A sentence, a screenshot or a quick note about the screen."],
                ["Harness makes it", "The app is updated in the place where your project lives."],
                ["You review it", "Try the result, ask for a tweak or undo it."],
                ["You keep it", "Only the changes you’re happy with stay."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-800">
                    <Check className="h-3 w-3 text-emerald-600" />
                    {title}
                  </div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{body}</p>
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
              You’re never stuck with a change. When Harness shows you the result, you have a few
              simple choices:
            </p>
            <div className="space-y-2.5">
              {[
                {
                  icon: Check,
                  title: "Keep it",
                  body: "The change stays and you can move on to the next thing.",
                },
                {
                  icon: Wand2,
                  title: "Tweak it",
                  body: "Ask for a different colour, more space, simpler copy — whatever needs adjusting.",
                },
                {
                  icon: Undo2,
                  title: "Undo it",
                  body: "Go back to how it was before. No explanation needed.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                    <item.icon className="h-3 w-3 text-violet-700" />
                  </span>
                  <div>
                    <div className="text-[12px] font-medium text-slate-800">{item.title}</div>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="better-requests" title="Better requests">
            <p>
              There’s no special formula. These small habits make the conversation smoother, though.
            </p>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {requestTips.map(([title, body]) => (
                <div key={title} className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-800">
                    <ChevronRight className="h-3 w-3 text-violet-500" />
                    {title}
                  </div>
                  <p className="mt-0.5 pl-[18px] text-[11.5px] leading-relaxed text-slate-500">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="project" title="Working with your project">
            <p>
              Think of the web chat as the place you explain the idea, and Harness Studio as the
              place where it becomes real. You can keep the chat open while you look at the app.
            </p>
            <p>
              Start with the screen in front of you. You don’t need to know the file name, the
              component structure or how the data flows. If you do know, you can mention it — but
              it’s optional.
            </p>
            <Tip>
              Not sure where to start? Ask Harness to walk you through the project first. A quick
              tour can make the next request much easier.
            </Tip>
          </Section>

          <Section id="privacy" title="Privacy & control">
            <p>
              Your project is yours. Harness is designed to keep you informed about what it is doing
              and to let you decide what stays.
            </p>
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <p className="text-[12px] leading-relaxed text-slate-600">
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
                  "Check that your project is open in Harness Studio and that you’re looking at the right screen. If you’re using the demo, the change is simulated — the full experience lives in the app.",
                ],
                [
                  "It changed the wrong thing",
                  "Tell Harness what’s off and ask it to undo. Then point to the screen or detail you meant. “Not that button — the one at the bottom” is a perfectly good correction.",
                ],
                [
                  "I don’t know what to ask",
                  "Start with what you see: “This feels confusing”, “I want to add a page” or “Explain this screen to me.” Harness can help you turn that into a concrete next step.",
                ],
                [
                  "I want a fresh start",
                  "Open a new chat. Your old conversation stays in the sidebar if you need to come back to it.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-3.5">
                  <div className="text-[12px] font-medium text-slate-800">{title}</div>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="contact" title="Still stuck?">
            <p>
              We’re building Harness Studio in the open and we’d love to hear what’s confusing,
              missing or just not clicking. A real person reads every note.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio%20question"
                className="btn-primary h-9 px-3.5 text-[12px]"
              >
                Ask us a question
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link to="/console" className="btn-ghost h-9 px-3.5 text-[12px]">
                Try the demo
              </Link>
            </div>
          </Section>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-[11px] text-slate-400">
            <span>Last updated November 2026</span>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-slate-700">
              Back to Harness Studio
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
