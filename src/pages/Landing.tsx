import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  Eye,
  Layers,
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
import { LogoMark } from "../components/Logo";
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
    title: "It works in your project",
    body: "The conversation happens on the web. The work happens inside your project, with every change shown for review.",
  },
  {
    icon: Eye,
    title: "Every change is visible",
    body: "Harness Studio explains what it did in plain language, so you can try it, keep it, or ask for something different.",
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
    title: "Say what you want",
    body: "Open the product in your browser and describe the change in your own words. A sentence is enough to start.",
  },
  {
    number: "02",
    icon: Monitor,
    title: "Watch it work in your project",
    body: "Harness Studio updates the screen, fixes the issue or builds the thing you asked for — right where your project lives.",
  },
  {
    number: "03",
    icon: Eye,
    title: "Review and keep building",
    body: "See the result, keep what feels right, and ask for a tweak. You’re always part of the conversation.",
  },
];

const principles = [
  {
    icon: Layers,
    title: "Clarity over cleverness",
    body: "The best tools explain themselves. We choose plain language, visible changes and a clear next step.",
  },
  {
    icon: ShieldCheck,
    title: "People stay in control",
    body: "Software should expand what you can do, not take the decisions away. The work stays reviewable and reversible.",
  },
  {
    icon: Building2,
    title: "Independent by design",
    body: "We’re a small company, which keeps us close to the product — and close to the people using it.",
  },
];

const examples = [
  {
    tag: "Fix something",
    prompt: "The save button doesn’t work on mobile. Can you fix it?",
    result: "Harness Studio finds the cause and makes the fix — no bug report required.",
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
  "See a clear summary of what Harness Studio wants to change.",
  "Try the result before you commit to it.",
  "Ask for another version whenever something feels off.",
];

export default function Landing() {
  useEffect(() => {
    document.title = "Harness Studio — Independent software company";
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
                Independent software company
              </span>

              <h1 className="mt-6 max-w-2xl text-[44px] font-bold leading-[0.99] tracking-[-0.052em] text-slate-950 sm:text-6xl lg:text-[74px]">
                Software for people who <span className="gradient-text">make things.</span>
              </h1>

              <p className="mt-7 max-w-[35rem] text-[16.5px] leading-[1.7] text-slate-600 sm:text-[17.5px]">
                Harness Studio is an independent software company. We build tools that make creating
                software feel more like a conversation — starting with our first product, also called
                Harness Studio.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/#products" className="btn-primary h-12 px-5.5 text-[14px]">
                  Explore our products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/#company" className="btn-ghost h-12 px-5.5 text-[14px]">
                  About the company
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-[12px] text-slate-500">
                Independent. Small team. Built for the web.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-300/70 pt-6">
                {[
                  ["The company", "Independent"],
                  ["The product", "Harness Studio"],
                  ["The idea", "Software, made human"],
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
              <div className="relative min-w-0">
                <div className="glow-orb left-1/4 top-0 h-64 w-64 bg-violet-300/25" />
                <div className="glow-orb bottom-0 right-0 h-56 w-56 bg-sky-200/35" />

                <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_36px_90px_-38px_rgba(15,23,42,0.38)]">
                  <div className="relative overflow-hidden rounded-[18px] bg-[#0a0c12] p-6 text-white sm:p-8">
                    <div className="dot-bg absolute inset-0 opacity-[0.12]" />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
                        <div className="flex items-center gap-2.5">
                          <LogoMark className="h-7 w-7" />
                          <span className="text-[13px] font-semibold">Harness Studio</span>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                          Company
                        </span>
                      </div>

                      <div className="pt-12 sm:pt-16">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-300">
                          Product 01 / AI development app
                        </span>
                        <h2 className="mt-3 text-[34px] font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-[40px]">
                          Harness Studio
                        </h2>
                        <p className="mt-3 max-w-sm text-[13.5px] leading-[1.75] text-zinc-400">
                          An AI teammate for the work of building software. Talk it through in the
                          browser; review every change in your project.
                        </p>
                        <Link
                          to="/#products"
                          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[11.5px] font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                          See the product
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <div className="mt-12 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
                        {["Talk it through", "Review the work", "Keep control"].map((item) => (
                          <div key={item} className="text-[10px] leading-[1.5] text-zinc-400">
                            <span className="mb-1.5 block h-1 w-1 rounded-full bg-violet-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10.5px] text-slate-500">
                    <span>Independent software company</span>
                    <span>One product, built with intent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="scroll-mt-24 border-t border-slate-300/70 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-600">
                  Products
                </span>
                <h2 className="mt-3 max-w-xl text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  One product. Built with intent.
                </h2>
              </div>
              <p className="max-w-xl text-[14.5px] leading-[1.8] text-slate-600 lg:pb-1">
                The first product from Harness Studio is the AI development app that shares its name.
                It is designed to make the work of building software feel direct, visible and yours
                to direct.
              </p>
            </div>

            <article className="mt-12 overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8f8f6] p-2 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.4)]">
              <div className="rounded-[22px] border border-slate-200/80 bg-white p-5 sm:p-8 lg:p-10">
                <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                        <span className="h-1 w-1 rounded-full bg-violet-500" />
                        Product 01
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        AI development app
                      </span>
                    </div>

                    <h3 className="mt-5 text-[40px] font-bold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-[48px]">
                      Harness Studio
                    </h3>
                    <p className="mt-4 max-w-md text-[14.5px] leading-[1.8] text-slate-600">
                      A development app with an AI teammate at its center. Describe what you want in
                      the browser, and Harness Studio works inside your project — then shows you
                      exactly what changed.
                    </p>

                    <ul className="mt-7 space-y-3">
                      {[
                        "Talk naturally, in your own words",
                        "Review every change before it stays",
                        "Ask for another direction at any time",
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                            <Check className="h-2.5 w-2.5 text-emerald-700" />
                          </span>
                          <span className="text-[13px] leading-relaxed text-slate-600">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link to="/console" className="btn-primary h-11 px-4 text-[13px]">
                        Try the demo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to="/docs" className="btn-ghost h-11 px-4 text-[13px]">
                        Read the guide
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <p className="mt-4 text-[11.5px] text-slate-500">
                      No account needed. Changes in the demo are simulated.
                    </p>
                  </div>

                  <div className="min-w-0">
                    <HeroDemo />
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-16 border-t border-slate-200 pt-10">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-sky-700">
                    Inside the product
                  </span>
                  <h3 className="mt-3 text-[30px] font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[36px]">
                    A teammate, not a command line.
                  </h3>
                </div>
                <Link
                  to="/docs"
                  className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-slate-950"
                >
                  Read the product guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-[#fbfbf9] p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)]"
                  >
                    <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white">
                      <feature.icon className="h-4 w-4 text-violet-700" />
                    </div>
                    <h4 className="text-[15.5px] font-semibold text-slate-950">{feature.title}</h4>
                    <p className="mt-2.5 text-[13.5px] leading-[1.75] text-slate-600">
                      {feature.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="company" className="scroll-mt-24 border-t border-slate-300/70 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
              <div>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-violet-600">
                  Company
                </span>
                <h2 className="mt-3 max-w-lg text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  A small company with a long view.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="text-[18px] leading-[1.75] tracking-[-0.01em] text-slate-700">
                  Harness Studio is an independent software company. We design and build tools that
                  make creating software feel more direct, more legible, and more human.
                </p>
                <p className="mt-5 text-[14.5px] leading-[1.8] text-slate-600">
                  Our first product shares our name. It is an AI development app for people who want
                  to move at the speed of a conversation — without giving up the ability to see,
                  question and undo the work. The company is small, the product is focused, and the
                  line between the two is deliberate.
                </p>
                <Link
                  to="/get-started"
                  className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-violet-700 hover:text-violet-800"
                >
                  Talk to the team <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-3">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-[#fbfbf9]">
                    <principle.icon className="h-4 w-4 text-violet-700" />
                  </div>
                  <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em] text-slate-950">
                    {principle.title}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-[1.75] text-slate-600">
                    {principle.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-300/70 bg-black">
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
                  Independent by design
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-sky-700" />
                  Building for the web
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

        <section
          id="how-it-works"
          className="relative scroll-mt-24 border-t border-slate-300/70 bg-white py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.19em] text-sky-700">
                  Inside the product
                </span>
                <h2 className="mt-3 text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[44px]">
                  Three steps. No manual.
                </h2>
                <p className="mt-4 max-w-xl text-[14.5px] leading-[1.8] text-slate-600">
                  The product is built around a simple loop: you describe the outcome, it does the
                  work, you decide what stays.
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
                You’re not handing over the keys. Harness Studio keeps you in the loop, explains its
                work in plain language and gives you room to change your mind.
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
                Ask for what you want. Review what comes back.
              </h2>
              <p className="mt-4 text-[14.5px] leading-[1.8] text-slate-600">
                A few examples of the kind of thing you can bring to the product. No setup, no special
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

        <section id="faq" className="scroll-mt-24 border-t border-slate-300/70 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div>
              <h2 className="text-[36px] font-bold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-[42px]">
                Questions, answered.
              </h2>
              <p className="mt-4 max-w-sm text-[13.5px] leading-[1.8] text-slate-600">
                About the company, the product and the demo.
              </p>
              <Link
                to="/docs"
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-700 hover:text-violet-800"
              >
                Read the product guide <ArrowRight className="h-3.5 w-3.5" />
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

        <section className="border-t border-slate-300/70 bg-white px-5 py-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-slate-800 bg-[#111318] px-6 py-16 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] sm:px-12 sm:py-20">
            <div className="glow-orb left-1/4 top-0 h-64 w-64 bg-violet-500/15" />
            <div className="glow-orb bottom-0 right-1/4 h-56 w-56 bg-sky-500/10" />
            <div className="relative">
              <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <DocLogo className="h-9 w-9" />
              </div>
              <h2 className="text-[38px] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:text-[50px]">
                Start a conversation.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-[14.5px] leading-[1.8] text-zinc-400">
                Whether you want to try the product or talk to the company behind it, start here.
                Tell us what you’re working on, and we’ll take it from there.
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
