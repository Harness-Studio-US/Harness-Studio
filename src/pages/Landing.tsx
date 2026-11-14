import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Eye,
  Lightbulb,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Sparkles,
  Undo2,
  Wand2,
} from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import { HeroDemo } from "../components/marketing/HeroDemo";
import { DocLogo } from "../components/DocLogo";
import { faqs } from "../data/site";
import { assetUrl } from "../lib/assets";

const features = [
  {
    icon: Wand2,
    title: "Say it your way",
    body: "Ask for a change the way you’d explain it to a teammate. No commands, no special syntax, no developer dictionary.",
  },
  {
    icon: Monitor,
    title: "It works in your app",
    body: "The conversation happens on the web. The actual work happens inside Harness Studio, right where your project lives.",
  },
  {
    icon: Eye,
    title: "Every change is visible",
    body: "Harness explains what it did in plain language, so you can try it, keep it, or ask for something different.",
  },
  {
    icon: MessageSquare,
    title: "Keep the conversation going",
    body: "Follow up naturally. “Make the buttons bigger” or “actually, keep the old layout” just works.",
  },
  {
    icon: Lightbulb,
    title: "Learn as you build",
    body: "Ask why something works or what a piece of the project does. Answers come without the jargon.",
  },
  {
    icon: ShieldCheck,
    title: "You stay in charge",
    body: "Nothing has to be permanent. Review the result, undo what doesn’t feel right, and keep the parts you love.",
  },
];

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Harness what you want",
    body: "Open the AI in your browser and describe the change in your own words. A sentence is enough to start.",
  },
  {
    number: "02",
    icon: Monitor,
    title: "Watch it happen in the app",
    body: "Harness works inside Harness Studio — updating the screen, fixing the issue or building the thing you asked for.",
  },
  {
    number: "03",
    icon: Eye,
    title: "Review and keep building",
    body: "See the result, keep what feels right, and ask for a tweak. You’re always part of the conversation.",
  },
];

const examples = [
  {
    tag: "Fix something",
    prompt: "The save button doesn’t work on mobile. Can you fix it?",
    result: "Harness finds the cause and makes the fix — no bug report required.",
  },
  {
    tag: "Add a feature",
    prompt: "Add a settings page with a profile photo, name and email.",
    result: "A new screen, connected to your app and ready for you to review.",
  },
  {
    tag: "Change the design",
    prompt: "This page feels crowded. Give everything more room to breathe.",
    result: "Spacing, type and layout updated — with your style kept intact.",
  },
  {
    tag: "Understand the code",
    prompt: "Explain what this project does, like I’m new here.",
    result: "A plain-English tour of the app and the pieces that make it work.",
  },
];

const controlPoints = [
  "See a clear summary of what Harness wants to change.",
  "Try the result before you commit to it.",
  "Ask for another version whenever something feels off.",
];

export default function Landing() {
  useEffect(() => {
    document.title = "Harness Studio — Build software by talking";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900">
      <Nav />
      <main>
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="grid-bg absolute inset-0" />
          <div className="glow-orb -top-20 left-[8%] h-80 w-80 bg-violet-300/20" />
          <div className="glow-orb right-[5%] top-40 h-72 w-72 bg-sky-200/30" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-8">
            <div className="animate-rise min-w-0">
              <span className="inline-flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-slate-500">
                <span className="h-px w-7 bg-violet-500" />
                AI development app
              </span>

              <h1 className="mt-6 max-w-2xl text-[44px] font-bold leading-[0.99] tracking-[-0.052em] text-slate-950 sm:text-6xl lg:text-[74px]">
                Build software by <span className="gradient-text">talking it through.</span>
              </h1>

              <p className="mt-7 max-w-[35rem] text-[16.5px] leading-[1.7] text-slate-600 sm:text-[17.5px]">
                Harness Studio is the development app with an AI teammate. Describe what you want in
                your browser, and it does the work inside your project — no commands, no jargon, no
                guessing where to start.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/console" className="btn-primary h-12 px-5.5 text-[14px]">
                  Try the interactive demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/#how-it-works" className="btn-ghost h-12 px-5.5 text-[14px]">
                  See how it works
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-[12px] text-slate-500">
                No account needed. Changes in the demo are simulated.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-300/70 pt-6">
                {[
                  ["Talk naturally", "Your words"],
                  ["Review it", "Every change"],
                  ["Stay in control", "Your call"],
                ].map(([title, label]) => (
                  <div key={title}>
                    <div className="text-[12.5px] font-semibold text-slate-800">{title}</div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-rise min-w-0 lg:pl-2" style={{ animationDelay: "120ms" }}>
              <HeroDemo />
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-24 border-t border-slate-300/70 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-600">
                  The product
                </span>
                <h2 className="mt-3 max-w-xl text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  A development app that works with you.
                </h2>
              </div>
              <p className="max-w-xl text-[14.5px] leading-[1.8] text-slate-600 lg:pb-1">
                It should feel like working with a patient teammate, not operating a machine. Say
                what you want, ask questions, change your mind. Harness keeps the project, the
                conversation and the review in one place.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-[#fbfbf9] p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]"
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <feature.icon className="h-4 w-4 text-violet-700" />
                  </div>
                  <h3 className="text-[15.5px] font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.75] text-slate-600">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="relative scroll-mt-24 border-t border-slate-300/70 py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-sky-700">
                  How it works
                </span>
                <h2 className="mt-3 text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  Three steps. No manual.
                </h2>
                <p className="mt-4 max-w-xl text-[14.5px] leading-[1.8] text-slate-600">
                  From the first sentence to a finished change, you always know what’s happening and
                  what comes next.
                </p>
              </div>
              <Link
                to="/console"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-slate-950"
              >
                Try a conversation <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
              {steps.map((step) => (
                <article key={step.number} className="border-t border-slate-300 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">{step.number}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                      <step.icon className="h-4 w-4 text-violet-700" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.01em] text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-[13.5px] leading-[1.75] text-slate-600">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-slate-800 bg-[#0e1014] py-24 text-white">
          <div className="dot-bg absolute inset-0 opacity-[0.14]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-8">
            <div>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-300">
                You’re in charge
              </span>
              <h2 className="mt-3 max-w-xl text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-[44px]">
                Every change is yours to keep — or undo.
              </h2>
              <p className="mt-5 max-w-lg text-[14.5px] leading-[1.8] text-zinc-400">
                You’re not handing over the keys. Harness keeps you in the loop, explains its
                thinking in plain language and gives you room to change your mind.
              </p>

              <ul className="mt-8 space-y-4">
                {controlPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                      <Check className="h-2.5 w-2.5 text-emerald-300" />
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-zinc-300">{point}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/docs"
                className="mt-9 inline-flex items-center gap-2 text-[13px] font-semibold text-white hover:text-violet-200"
              >
                Read the guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[13px] font-semibold text-white">Change summary</div>
                  <div className="mt-1 text-[11px] text-zinc-500">Dashboard refresh</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9.5px] font-medium text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Ready to review
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  ["Updated the overview", "Warmer colours and a clearer headline"],
                  ["Simplified the actions", "One main action instead of three"],
                  ["Checked the mobile view", "Text and spacing stay comfortable"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10">
                      <Check className="h-2.5 w-2.5 text-emerald-300" />
                    </span>
                    <div>
                      <div className="text-[11.5px] font-medium text-zinc-200">{title}</div>
                      <div className="mt-0.5 text-[10.5px] text-zinc-500">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-[11.5px] font-semibold text-slate-900">
                  <Check className="h-3 w-3" />
                  Keep these changes
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 text-[11.5px] font-medium text-zinc-300">
                  <Undo2 className="h-3 w-3" />
                  Try something else
                </span>
              </div>
              <p className="mt-4 text-[10px] text-zinc-500">
                You decide what stays. Nothing is applied without you.
              </p>
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-24 border-t border-slate-300/70 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-600">
                In practice
              </span>
              <h2 className="mt-3 text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                Ask for what you want. Harness figures out the rest.
              </h2>
              <p className="mt-4 text-[14.5px] leading-[1.8] text-slate-600">
                A few examples of the kind of thing you can bring to the chat. No setup, no special
                format — just the goal in your own words.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {examples.map((example) => (
                <article
                  key={example.tag}
                  className="rounded-2xl border border-slate-200 bg-[#fbfbf9] p-6 transition hover:border-slate-300 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.25)] sm:p-7"
                >
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                    <span className="h-1 w-1 rounded-full bg-violet-500" />
                    {example.tag}
                  </span>
                  <p className="mt-5 text-[18px] font-medium leading-[1.5] tracking-[-0.015em] text-slate-950">
                    “{example.prompt}”
                  </p>
                  <p className="mt-5 border-t border-slate-200 pt-4 text-[13px] leading-[1.7] text-slate-600">
                    {example.result}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="studio" className="scroll-mt-24 border-t border-slate-300/70 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-600">
                  The studio
                </span>
                <h2 className="mt-3 text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  Create. Build. Innovate.
                </h2>
              </div>
              <p className="max-w-sm text-[13.5px] leading-[1.75] text-slate-600">
                Harness Studio is built by a small, independent team that wants software to feel
                more like a conversation and less like a machine.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-300/70 bg-black">
              <img
                src={assetUrl("/brand/harness-banner.svg")}
                alt="Harness Studio — Create, Build, Innovate"
                className="h-auto w-full"
              />
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 text-[12px] text-slate-600 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  A small team building better tools for builders
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-sky-700" />
                  Built for the web and the app
                </span>
              </div>
              <Link
                to="/brand"
                className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-slate-950"
              >
                Brand &amp; press kit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-slate-300/70 bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div>
              <h2 className="text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[42px]">
                Questions, answered.
              </h2>
              <p className="mt-4 max-w-sm text-[13.5px] leading-[1.8] text-slate-600">
                New to Harness Studio? The guide walks you through your first conversation, one
                plain-English step at a time.
              </p>
              <Link
                to="/docs"
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-700 hover:text-violet-800"
              >
                Read the guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[15px] font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
                  </summary>
                  <p className="max-w-2xl pb-5 pr-8 text-[13.5px] leading-[1.8] text-slate-600">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-300/70 px-5 py-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-slate-800 bg-[#111318] px-6 py-16 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] sm:px-12 sm:py-20">
            <div className="glow-orb left-1/4 top-0 h-64 w-64 bg-violet-500/15" />
            <div className="glow-orb bottom-0 right-1/4 h-56 w-56 bg-sky-500/10" />
            <div className="relative">
              <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <DocLogo className="h-9 w-9" />
              </div>
              <h2 className="text-[38px] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-[50px]">
                Start with a sentence.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[14.5px] leading-[1.8] text-zinc-400">
                Tell Harness what you want to build. It’ll ask questions, make a change and show you
                the result. You bring the idea — the conversation does the rest.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/console"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[0.7rem] bg-white px-5.5 text-[14px] font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Try the interactive demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="mailto:HarnessStudio@Outlook.com?subject=Harness%20Studio"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[0.7rem] border border-white/15 bg-white/[0.03] px-5.5 text-[14px] font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Talk to the team
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 text-[11px] text-zinc-500">
                No account required. The interactive demo runs in your browser.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
