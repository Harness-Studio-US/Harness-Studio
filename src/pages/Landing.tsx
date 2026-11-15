import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Eye,
  Layers,
  Lightbulb,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Undo2,
  Wand2,
} from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import { HeroDemo } from "../components/marketing/HeroDemo";
import { faqs } from "../data/site";

const features = [
  {
    icon: Wand2,
    title: "Say it your way",
    body: "Ask for a change the way you would explain it to a teammate. No commands, no special syntax, no developer dictionary.",
  },
  {
    icon: Monitor,
    title: "Work inside the project",
    body: "The conversation happens in the browser. The work happens in your project, with every change shown for review.",
  },
  {
    icon: Eye,
    title: "See what changed",
    body: "Copilot explains the result in plain language, so you can try it, keep it, or ask for something different.",
  },
  {
    icon: MessageSquare,
    title: "Keep the thread",
    body: "Follow up naturally. “Make the buttons bigger” or “actually, keep the old layout” is enough.",
  },
  {
    icon: Lightbulb,
    title: "Learn as you build",
    body: "Ask why something works or what a piece of the project does. Answers arrive without the jargon.",
  },
  {
    icon: ShieldCheck,
    title: "You keep the final call",
    body: "Review the result, undo what does not feel right, and keep the parts you love. Nothing is permanent.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe the outcome",
    body: "Open Harness Copilot and say what you want in your own words. A sentence is enough to begin.",
  },
  {
    number: "02",
    title: "Work through the change",
    body: "Copilot updates the screen, fixes the issue, or builds the thing you asked for inside your project.",
  },
  {
    number: "03",
    title: "Review and continue",
    body: "See the result, keep what feels right, and ask for a tweak. You are always part of the conversation.",
  },
];

const examples = [
  {
    tag: "Fix something",
    prompt: "The save button doesn’t work on mobile. Can you fix it?",
    result: "Copilot finds the cause and makes the fix, without a formal bug report.",
  },
  {
    tag: "Add a feature",
    prompt: "Add a settings page with a profile photo, name and email.",
    result: "A new screen, connected to your project and ready for you to review.",
  },
  {
    tag: "Change the design",
    prompt: "This page feels crowded. Give everything more room to breathe.",
    result: "Spacing, type and layout updated while your existing style stays intact.",
  },
  {
    tag: "Understand the code",
    prompt: "Explain what this project does, like I’m new here.",
    result: "A plain-English tour of the app and the pieces that make it work.",
  },
];

const principles = [
  {
    icon: Layers,
    title: "Clarity over cleverness",
    body: "The best tools explain themselves. We choose plain language, visible changes, and a clear next step.",
  },
  {
    icon: ShieldCheck,
    title: "People stay in control",
    body: "Software should expand what you can do, not take the decisions away. The work stays reviewable and reversible.",
  },
  {
    icon: Building2Icon,
    title: "Independent by design",
    body: "We are a small company, which keeps us close to the product and close to the people using it.",
  },
];

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
      <path d="M15 9h4a1 1 0 0 1 1 1v11" />
      <path d="M8 8h3M8 12h3M8 16h3M2 21h20" />
    </svg>
  );
}

const controlPoints = [
  "Read a clear summary before anything changes.",
  "Try the result before you commit to it.",
  "Ask for another version whenever something feels off.",
];

export default function Landing() {
  useEffect(() => {
    document.title = "Harness Studio — Independent software company";
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <section className="overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-36">
          <div className="container-site grid items-center gap-14 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
            <div className="min-w-0">
              <span className="eyebrow">Independent software company</span>

              <h1 className="mt-7 max-w-[700px] text-[clamp(3.2rem,6.2vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-ink">
                Software for people who{" "}
                <span className="display-serif text-accent">make things.</span>
              </h1>

              <p className="mt-7 max-w-[540px] text-[17px] leading-[1.75] text-muted">
                We design tools that make building software feel more direct, more visible, and
                more human. Harness Copilot is our first product.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/#product" className="btn-primary h-12 px-5 text-[14px]">
                  Explore the product
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/docs" className="btn-ghost h-12 px-5 text-[14px]">
                  Read the guide
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <dl className="mt-12 grid max-w-[560px] grid-cols-3 gap-5 border-t border-line pt-6">
                {[
                  ["Independent", "Studio"],
                  ["One focused", "Product"],
                  ["Built for", "The web"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                      {label}
                    </dt>
                    <dd className="mt-1.5 text-[13px] font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0 lg:pl-2">
              <div className="mx-auto max-w-[700px]">
                <div className="mb-3 flex items-center justify-between gap-4 border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.13em] text-muted">
                  <span>Product 01 / Harness Copilot</span>
                  <span>AI development app</span>
                </div>
                <HeroDemo />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-muted">
                  <span>An early look at the Copilot workspace.</span>
                  <span>Responses are simulated.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="product"
          className="scroll-mt-24 border-t border-line bg-surface py-20 lg:py-28"
        >
          <div className="container-site">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <span className="eyebrow">The product</span>
                <div className="mt-5 text-[13px] font-medium text-muted">Harness Copilot</div>
              </div>

              <div className="lg:col-span-8">
                <h2 className="max-w-[760px] text-[38px] font-semibold leading-[1.06] tracking-[-0.045em] text-ink sm:text-[50px]">
                  An AI development app that meets you in the conversation.
                </h2>
                <p className="mt-5 max-w-[650px] text-[16.5px] leading-[1.8] text-muted">
                  Describe what you want in the browser. Copilot works inside your project and
                  shows you exactly what changed, in language you can act on.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link to="/console" className="btn-primary h-11 px-4.5 text-[13.5px]">
                    Open Harness Copilot
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/docs" className="btn-ghost h-11 px-4.5 text-[13.5px]">
                    Read the product guide
                  </Link>
                </div>
                <p className="mt-4 text-[12.5px] text-muted">
                  Early preview. Responses are simulated and conversations stay in this browser.
                </p>
              </div>
            </div>

            <div className="mt-14 grid gap-x-12 border-t border-line md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="border-b border-line py-7">
                  <feature.icon className="h-[18px] w-[18px] text-accent" strokeWidth={1.8} />
                  <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.015em] text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 max-w-[330px] text-[14px] leading-[1.7] text-muted">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-20 lg:py-28">
          <div className="container-site">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">How it works</span>
              </div>
              <div className="lg:col-span-8">
                <h2 className="max-w-[720px] text-[38px] font-semibold leading-[1.07] tracking-[-0.045em] text-ink sm:text-[50px]">
                  Three steps. No manual.
                </h2>
                <p className="mt-5 max-w-[600px] text-[16px] leading-[1.8] text-muted">
                  The product is built around a simple loop: describe the outcome, work through
                  the change, decide what stays.
                </p>
              </div>
            </div>

            <div className="mt-14 grid gap-10 border-t border-line pt-8 md:grid-cols-3 md:gap-0">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className={`md:px-8 ${index === 0 ? "md:pl-0" : "md:border-l md:border-line"} ${
                    index === 2 ? "md:pr-0" : ""
                  }`}
                >
                  <span className="font-mono text-[12px] tracking-[0.08em] text-muted">
                    {step.number}
                  </span>
                  <h3 className="mt-8 text-[21px] font-semibold tracking-[-0.025em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[320px] text-[14.5px] leading-[1.75] text-muted">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink py-20 text-[#f6f2e9] lg:py-28">
          <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="eyebrow eyebrow--plain eyebrow--dark">You are in charge</span>
              <h2 className="mt-5 max-w-[560px] text-[38px] font-semibold leading-[1.06] tracking-[-0.045em] text-[#f6f2e9] sm:text-[50px]">
                Every change is yours to keep
                <span className="display-serif text-[#c4b5fd]"> — or undo.</span>
              </h2>
              <p className="mt-5 max-w-[520px] text-[16px] leading-[1.8] text-[#c9c3b7]">
                You are not handing over the keys. Copilot keeps you in the loop, explains its work
                in plain language, and gives you room to change your mind.
              </p>

              <ul className="mt-8 space-y-4">
                {controlPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[14px] leading-[1.7] text-[#e7e1d5]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#6ee7b7]/30 bg-[#6ee7b7]/10">
                      <Check className="h-2.5 w-2.5 text-[#a7f3d0]" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                to="/docs#review"
                className="mt-8 inline-flex items-center gap-2 text-[13.5px] font-semibold text-[#f6f2e9] underline decoration-[#f6f2e9]/30 underline-offset-4 hover:decoration-[#f6f2e9]"
              >
                How reviewing works <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/[0.045] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="text-[13px] font-semibold text-[#f6f2e9]">Change summary</div>
                  <div className="mt-1 text-[11.5px] text-[#aaa396]">Dashboard refresh</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6ee7b7]/25 bg-[#6ee7b7]/10 px-2.5 py-1 text-[10px] font-medium text-[#a7f3d0]">
                  <span className="h-1 w-1 rounded-full bg-[#6ee7b7]" />
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
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3.5 py-3"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#6ee7b7]/25 bg-[#6ee7b7]/10">
                      <Check className="h-2.5 w-2.5 text-[#a7f3d0]" />
                    </span>
                    <div>
                      <div className="text-[12px] font-medium text-[#f6f2e9]">{title}</div>
                      <div className="mt-0.5 text-[11px] text-[#aaa396]">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#f8f8f6] px-3.5 text-[11.5px] font-semibold text-[#0f172a]">
                  <Check className="h-3 w-3" />
                  Keep these changes
                </span>
                <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/15 px-3.5 text-[11.5px] font-medium text-[#e7e1d5]">
                  <Undo2 className="h-3 w-3" />
                  Try something else
                </span>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-[#aaa396]">
                You decide what stays. Nothing is applied without you.
              </p>
            </div>
          </div>
        </section>

        <section
          id="company"
          className="scroll-mt-24 border-b border-line bg-surface py-20 lg:py-28"
        >
          <div className="container-site">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">The company</span>
                <p className="mt-5 max-w-[260px] text-[13px] leading-[1.7] text-muted">
                  Harness Studio builds software for people who make things.
                </p>
              </div>

              <div className="lg:col-span-8">
                <h2 className="max-w-[760px] text-[38px] font-semibold leading-[1.07] tracking-[-0.045em] text-ink sm:text-[50px]">
                  A small company with a long view.
                </h2>
                <p className="mt-6 max-w-[720px] text-[20px] leading-[1.65] tracking-[-0.015em] text-ink-soft">
                  We design and build tools that make creating software feel more direct, more
                  legible, and more human.
                </p>
                <p className="mt-5 max-w-[680px] text-[15px] leading-[1.8] text-muted">
                  Our first product is Harness Copilot, an AI development app for people who want
                  to move at the speed of a conversation without giving up the ability to see,
                  question, and undo the work. The company is small, the product is focused, and
                  the line between the two is deliberate.
                </p>
                <Link
                  to="/get-started"
                  className="mt-7 inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink underline decoration-[#b8b1a3] underline-offset-4 hover:decoration-ink"
                >
                  Talk to the studio <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-0 border-t border-line md:grid-cols-3">
              {principles.map((principle, index) => (
                <article
                  key={principle.title}
                  className={`py-7 md:px-8 ${index === 0 ? "md:pl-0" : "md:border-l md:border-line"} ${
                    index === 2 ? "md:pr-0" : ""
                  }`}
                >
                  <principle.icon className="h-[18px] w-[18px] text-accent" strokeWidth={1.8} />
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2.5 max-w-[330px] text-[14px] leading-[1.7] text-muted">
                    {principle.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-24 py-20 lg:py-28">
          <div className="container-site">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">In practice</span>
              </div>
              <div className="lg:col-span-8">
                <h2 className="max-w-[740px] text-[38px] font-semibold leading-[1.07] tracking-[-0.045em] text-ink sm:text-[50px]">
                  Ask for what you want. Review what comes back.
                </h2>
                <p className="mt-5 max-w-[620px] text-[16px] leading-[1.8] text-muted">
                  A few examples of what you can bring to Copilot. No special format, just the goal
                  in your own words.
                </p>
              </div>
            </div>

            <div className="mt-12 divide-y divide-line border-y border-line">
              {examples.map((example, index) => (
                <div
                  key={example.tag}
                  className="grid gap-4 py-6 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,0.85fr)] md:gap-8"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10.5px] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {example.tag}
                    </span>
                  </div>
                  <p className="text-[17px] font-medium leading-[1.55] tracking-[-0.015em] text-ink">
                    “{example.prompt}”
                  </p>
                  <p className="text-[13.5px] leading-[1.7] text-muted">{example.result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-line bg-surface py-20 lg:py-28">
          <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <span className="eyebrow">Questions</span>
              <h2 className="mt-5 max-w-[360px] text-[38px] font-semibold leading-[1.07] tracking-[-0.045em] text-ink sm:text-[46px]">
                A clearer view of what this is.
              </h2>
              <p className="mt-5 max-w-[300px] text-[14.5px] leading-[1.75] text-muted">
                About the company, the product, and the early preview.
              </p>
              <Link
                to="/docs"
                className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-[#b8b1a3] underline-offset-4 hover:decoration-ink"
              >
                Read the product guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-line border-y border-line lg:col-span-8">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[15.5px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" />
                  </summary>
                  <p className="max-w-[620px] pb-5 pr-8 text-[14px] leading-[1.8] text-muted">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line py-16 lg:py-20">
          <div className="container-site">
            <div className="overflow-hidden rounded-xl bg-ink px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
              <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
                <div>
                  <span className="eyebrow eyebrow--plain eyebrow--dark">
                    Start a conversation
                  </span>
                  <h2 className="mt-4 max-w-[680px] text-[40px] font-semibold leading-[1.03] tracking-[-0.045em] text-[#f6f2e9] sm:text-[54px]">
                    Bring the next idea.
                    <span className="display-serif text-[#c4b5fd]"> We’ll meet you there.</span>
                  </h2>
                  <p className="mt-5 max-w-[500px] text-[15px] leading-[1.8] text-[#c9c3b7]">
                    Open Harness Copilot to try the conversation, or write to the studio if you
                    want to talk through the work first.
                  </p>
                  <p className="mt-4 text-[11.5px] text-[#aaa396]">
                    Early preview. Responses are simulated.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
                  <Link
                    to="/console"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#f8f8f6] px-5 text-[13.5px] font-semibold text-[#0f172a] transition hover:bg-white"
                  >
                    Open Harness Copilot
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-[13.5px] font-medium text-[#f6f2e9] transition hover:bg-white/[0.08]"
                  >
                    Email the studio
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
