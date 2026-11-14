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
    body: "Ask for a change the way you’d explain it to a friend. No commands, no special syntax, no developer dictionary.",
  },
  {
    icon: Monitor,
    title: "It works in your app",
    body: "The conversation happens on the web. The actual work happens inside Harness Studio, right where your project lives.",
  },
  {
    icon: Eye,
    title: "You see what changed",
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
    tone: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    tag: "Add a feature",
    prompt: "Add a settings page with a profile photo, name and email.",
    result: "A new screen, connected to your app and ready for you to review.",
    tone: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    tag: "Change the design",
    prompt: "This page feels crowded. Give everything more room to breathe.",
    result: "Spacing, type and layout updated — with your style kept intact.",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    tag: "Understand the code",
    prompt: "Explain what this project does, like I’m new here.",
    result: "A plain-English tour of the app and the pieces that make it work.",
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

const controlPoints = [
  "See a clear summary of what Harness wants to change.",
  "Try the result before you commit to it.",
  "Ask for another version whenever something feels off.",
];

export default function Landing() {
  useEffect(() => {
    document.title = "Harness Studio — Build by talking";
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-800">
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="grid-bg absolute inset-0" />
          <div className="glow-orb -top-20 left-[8%] h-80 w-80 bg-violet-300/30" />
          <div className="glow-orb right-[5%] top-40 h-72 w-72 bg-sky-200/40" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11.5px] text-slate-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                Harness Studio AI · Preview
              </span>

              <h1 className="mt-6 max-w-2xl text-[42px] font-bold leading-[1.03] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[66px]">
                Build by <span className="gradient-text">talking it through.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Harness Studio is a development app with an AI teammate. Chat with it in your
                browser, and watch it make the change in your app — no commands, no jargon, no
                guessing where to start.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/console" className="btn-primary h-11 px-5 text-sm">
                  Try the AI
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/#how-it-works" className="btn-ghost h-11 px-5 text-sm">
                  See how it works
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <p className="mt-4 text-[11.5px] text-slate-400">
                Try the conversation here. The full experience happens in Harness Studio.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-x-5 gap-y-3 border-t border-slate-200 pt-6">
                {[
                  ["Speak naturally", "Your words"],
                  ["See it happen", "In the app"],
                  ["Stay in control", "Your call"],
                ].map(([title, label]) => (
                  <div key={title}>
                    <div className="text-[12px] font-semibold text-slate-800">{title}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-rise lg:pl-2" style={{ animationDelay: "120ms" }}>
              <HeroDemo />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="product" className="relative scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                A better way to build
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                You bring the idea. Harness handles the how.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                It should feel like working with a patient teammate, not operating a machine. Say
                what you want, ask questions, change your mind. Harness keeps up.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                    <feature.icon className="h-4 w-4 text-violet-700" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b0d14] p-6 text-white sm:p-8">
              <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                    The difference
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                    A conversation, not a command line.
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-400">
                    You don’t need to know the right words, the right file or the right setting.
                    Describe the outcome and let Harness work out the details.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[12px] leading-relaxed text-zinc-300">
                    The landing page feels a little cold. Can we make it friendlier?
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/50">
                      <DocLogo className="h-4 w-4" />
                    </div>
                    <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[12px] leading-relaxed text-zinc-300">
                      Yes. I’d warm up the background, soften the headings and give the main button
                      a clearer, friendlier label. Want me to try that in your app?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="relative scroll-mt-24 border-t border-slate-200 bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                  How it works
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Three steps. No manual.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  From the first sentence to a finished change, you always know what’s happening and
                  what comes next.
                </p>
              </div>
              <Link
                to="/console"
                className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-slate-600 hover:text-slate-900"
              >
                Try a conversation <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6"
                >
                  {index < steps.length - 1 && (
                    <span className="absolute -right-2 top-10 hidden h-px w-4 bg-slate-300 md:block" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">{step.number}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                      <step.icon className="h-4 w-4 text-violet-700" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-[15px] font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EXAMPLES */}
        <section id="examples" className="scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                In practice
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Ask for what you want. Harness figures out the rest.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                A few real examples of the kind of thing you can bring to the chat. No setup, no
                special format — just the goal in your own words.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {examples.map((example) => (
                <article
                  key={example.tag}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[9.5px] font-medium ${example.tone}`}
                  >
                    {example.tag}
                  </span>
                  <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-900">
                    “{example.prompt}”
                  </p>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-[11.5px] leading-relaxed text-slate-500">
                    {example.result}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTROL */}
        <section className="border-t border-slate-200 bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                You’re in charge
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Nothing happens behind your back.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                You’re not handing over the keys. Harness keeps you in the loop, explains its
                thinking in plain language and gives you room to change your mind.
              </p>

              <ul className="mt-7 space-y-3.5">
                {controlPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                      <Check className="h-2.5 w-2.5 text-emerald-700" />
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-slate-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#fbfcfe] p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="inline-flex items-center gap-2 text-[11.5px] font-medium text-slate-700">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  What Harness suggests
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-700">
                  Ready to review
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  ["Updated the hero", "Warmer colours and a clearer headline"],
                  ["Simplified the buttons", "One main action instead of three"],
                  ["Checked the mobile view", "Text and spacing stay comfortable"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                      <Check className="h-2.5 w-2.5 text-emerald-700" />
                    </span>
                    <div>
                      <div className="text-[11.5px] font-medium text-slate-800">{title}</div>
                      <div className="text-[10.5px] text-slate-500">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-medium text-white"
                >
                  <Check className="h-3 w-3" />
                  Keep these changes
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600"
                >
                  <Undo2 className="h-3 w-3" />
                  Try something else
                </button>
              </div>
              <p className="mt-3 text-[9.5px] text-slate-400">
                You choose what stays. Nothing is applied without you.
              </p>
            </div>
          </div>
        </section>

        {/* STUDIO / BANNER */}
        <section id="studio" className="scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                  The studio
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Create. Build. Innovate.
                </h2>
              </div>
              <p className="max-w-sm text-[12.5px] leading-relaxed text-slate-500">
                We’re building a calmer way to make software. Harness Studio is our development app,
                with an AI teammate who speaks your language.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
              <img
                src={assetUrl("/brand/harness-banner.svg")}
                alt="Harness Studio — Create, Build, Innovate"
                className="h-auto w-full"
                loading="lazy"
              />
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 text-[12px] text-slate-500 sm:flex-row sm:items-center">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  A small team building better tools for builders
                </span>
                <span className="hidden items-center gap-1.5 sm:inline-flex">
                  <Monitor className="h-3.5 w-3.5 text-sky-600" />
                  Built for the web and the app
                </span>
              </div>
              <Link
                to="/brand"
                className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
              >
                Brand &amp; press kit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-slate-200 bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900">
                Questions, answered.
              </h2>
              <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">
                New to Harness Studio? The guide walks you through your first conversation, one
                plain-English step at a time.
              </p>
              <Link
                to="/docs"
                className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-violet-700 hover:text-violet-700"
              >
                Read the guide <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[13.5px] font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 pr-8 text-[12.5px] leading-relaxed text-slate-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-24 pt-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-violet-50 via-white to-white px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="relative">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
                <DocLogo className="h-9 w-9" />
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Start with a sentence.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                Tell Harness what you want to build. It’ll ask questions, make a change and show you
                the result. You bring the idea — the conversation does the rest.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link to="/console" className="btn-primary h-11 px-5 text-sm">
                  Try the AI
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/docs" className="btn-ghost h-11 px-5 text-sm">
                  Read the guide
                </Link>
              </div>
              <p className="mt-4 text-[10.5px] text-slate-400">
                Preview the conversation. No account needed.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
