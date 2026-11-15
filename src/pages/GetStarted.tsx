import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Mail, MessageSquare } from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";

const nextSteps = [
  {
    title: "Tell us what you’re working on",
    body: "A sentence or two is plenty. We’ll help you find the right place to start.",
  },
  {
    title: "Talk to the team",
    body: "A real person on the company reads every message and replies directly.",
  },
  {
    title: "Try Harness Copilot",
    body: "We’ll walk you through the workspace and your first change.",
  },
];

export default function GetStarted() {
  useEffect(() => {
    document.title = "Get started — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-slate-900">
      <Nav />
      <main className="relative overflow-hidden pb-24 pt-32 lg:pt-40">
        <div className="grid-bg absolute inset-0" />
        <div className="glow-orb right-[10%] top-24 h-72 w-72 bg-violet-300/20" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-14 px-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-slate-500">
              <span className="h-px w-7 bg-violet-500" />
              Get started
            </span>
            <h1 className="mt-6 max-w-xl text-[46px] font-bold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-6xl">
              Let’s find the right place to start.
            </h1>
            <p className="mt-6 max-w-lg text-[16px] leading-[1.75] text-slate-600">
              Tell us what you’re building, or what you’d like to change. We’ll help you get set up
              with Harness Copilot — or point you somewhere more useful. No sales script, just a
              useful conversation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio%20access"
                className="btn-primary h-12 px-5 text-[14px]"
              >
                <Mail className="h-4 w-4" />
                Talk to the team
              </a>
              <Link to="/console" className="btn-ghost h-12 px-5 text-[14px]">
                Try the demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-[12px] text-slate-500">
              Prefer email? Write to{" "}
              <a
                href="mailto:message.harness.studio@outlook.com"
                className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-slate-950"
              >
                message.harness.studio@outlook.com
              </a>
              .
            </p>

            <div className="mt-12 grid gap-3 border-t border-slate-300/70 pt-7 sm:grid-cols-2">
              {[
                "A real conversation with the team",
                "A walkthrough of Harness Copilot",
                "Room to ask questions as you go",
                "A direct line to the people building it",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                    <Check className="h-2.5 w-2.5 text-emerald-700" />
                  </span>
                  <span className="text-[13px] leading-relaxed text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                <MessageSquare className="h-5 w-5 text-violet-700" />
              </span>
              <div>
                <div className="text-[14px] font-semibold text-slate-950">What happens next</div>
                <div className="mt-0.5 text-[11.5px] text-slate-500">A simple, human process</div>
              </div>
            </div>

            <ol className="mt-7 space-y-6">
              {nextSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-mono text-[10px] text-slate-500">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">{step.title}</div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-xl border border-slate-200 bg-[#fbfbf9] p-4">
              <p className="text-[11.5px] leading-relaxed text-slate-500">
                Want to see the conversation first? Sign in to the demo, then accept the terms and
                privacy policy once. Demo replies are simulated.
              </p>
              <Link
                to="/console"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-700 hover:text-violet-800"
              >
                Open the demo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
