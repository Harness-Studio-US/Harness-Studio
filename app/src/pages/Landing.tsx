import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Braces,
  Check,
  ChevronDown,
  Code2,
  Cpu,
  FileText,
  Gauge,
  Globe,
  KeyRound,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Webhook,
  Zap,
} from "lucide-react";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import { HeroDemo } from "../components/marketing/HeroDemo";
import { CodeBlock } from "../components/CodeBlock";
import { DocLogo } from "../components/DocLogo";
import { benchmarks, codeSnippets, faqs, models, plans } from "../data/site";
import { assetUrl } from "../lib/assets";
import { cn } from "../lib/cn";

const features = [
  {
    icon: Sparkles,
    title: "Agentic, not autocomplete",
    body: "Harness Code plans, calls tools, reads the result and iterates. Shell, browser, code execution and file search are built into the loop — no orchestration framework required.",
    className: "md:col-span-3",
    visual: "tools",
  },
  {
    icon: Boxes,
    title: "256K tokens of repository",
    body: "Whole services, lockfiles, migrations and test suites in a single request. Prompt caching keeps long contexts fast and cheap.",
    className: "md:col-span-3",
    visual: "context",
  },
  {
    icon: Code2,
    title: "OpenAI-compatible",
    body: "Change the base URL and model name. Keep your SDK, messages, tools and evals.",
    className: "md:col-span-2",
    visual: "swap",
  },
  {
    icon: Zap,
    title: "Streaming + structured output",
    body: "Token streaming, SSE usage frames and JSON Schema responses you can bind to a type.",
    className: "md:col-span-2",
    visual: "stream",
  },
  {
    icon: Gauge,
    title: "90% cheaper cached input",
    body: "Stable system prompts and repo context are billed at a tenth of the input rate.",
    className: "md:col-span-2",
    visual: "cache",
  },
];

const consoleFeatures = [
  {
    icon: SlidersHorizontal,
    title: "Every sampling parameter",
    body: "Temperature, top-p, top-k, max tokens, penalties, seed and stop sequences — persisted with the workspace.",
  },
  {
    icon: Terminal,
    title: "Built-in tools, your call",
    body: "Toggle code execution, web search, file search and browser in one switch. Auto, required or no tool choice.",
  },
  {
    icon: KeyRound,
    title: "Keys with real scopes",
    body: "Create scoped production keys, see last use and revoke instantly. Sandbox and production are separate.",
  },
  {
    icon: Activity,
    title: "Playground, logs and webhooks",
    body: "Inspect the exact request body, generate curl or SDK snippets, replay responses and wire delivery events.",
  },
];

const trust = ["NORTHWIND", "LUMEN LABS", "FOUNDRY", "ARCFRAME", "MONOLITH", "VELA CO"];

const tokenRows = models.map((model) => ({
  model: model.name,
  input: model.inputPrice,
  output: model.outputPrice,
  context: model.context,
}));

export default function Landing() {
  const [codeTab, setCodeTab] = useState<"typescript" | "python" | "curl">("typescript");

  useEffect(() => {
    document.title = "Harness Studio — Harness Code, the agentic coding model";
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
              <Link
                to="/docs#changelog"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11.5px] text-slate-600 transition hover:border-violet-200 hover:text-slate-800"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                Harness Code 1.2 — parallel tool calls are live
                <ArrowUpRight className="h-3 w-3" />
              </Link>

              <h1 className="mt-6 max-w-2xl text-[42px] font-bold leading-[1.03] tracking-[-0.04em] text-slate-900 sm:text-6xl lg:text-[66px]">
                The coding model that <span className="gradient-text">ships with you.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Harness Code is an agentic engineering model from Harness Studio. It reads your
                repository, runs the tests and writes the patch — through one OpenAI-compatible API,
                with 256K tokens of context.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/console" className="btn-primary h-11 px-5 text-sm">
                  Start building free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/docs" className="btn-ghost h-11 px-5 text-sm">
                  Read the docs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-slate-400">
                <span>1M free tokens</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>No credit card</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>OpenAI SDK compatible</span>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-6 sm:grid-cols-4">
                {[
                  ["256K", "context"],
                  ["74.8%", "SWE-bench"],
                  ["92 tok/s", "output"],
                  ["99.9%", "uptime"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="font-mono text-lg font-semibold text-slate-900">{value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-rise lg:pl-2" style={{ animationDelay: "120ms" }}>
              <HeroDemo />
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Engineering teams prototyping with Harness
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-60">
              {trust.map((name) => (
                <span key={name} className="text-[12px] font-bold tracking-[0.16em] text-slate-600">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="product" className="relative scroll-mt-24 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                Product
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                An agent, not an autocomplete.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                Everything needed to take a task from “here&apos;s the issue” to “here&apos;s the
                reviewed diff” — model, tools, context and the infrastructure around them.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-6">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
                    feature.className
                  )}
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                    <feature.icon className="h-4 w-4 text-violet-700" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-slate-500">
                    {feature.body}
                  </p>

                  {feature.visual === "tools" && (
                    <div className="mt-5 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      {[
                        ["Read repo", "12 files matched", true],
                        ["Run tests", "34 passed, 0 failed", true],
                        ["Edit patch", "session.ts +18 −4", true],
                        ["Open PR", "awaiting review", false],
                      ].map(([label, detail, done], index) => (
                        <div
                          key={String(label)}
                          className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5"
                        >
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-full border",
                              done
                                ? "border-emerald-400/40 bg-emerald-100 text-emerald-700"
                                : "border-slate-300 text-slate-400"
                            )}
                          >
                            {done ? <Check className="h-2.5 w-2.5" /> : <span className="text-[8px]">{index + 1}</span>}
                          </span>
                          <span className="font-mono text-[10px] text-slate-600">{label}</span>
                          <span className="ml-auto font-mono text-[9px] text-slate-400">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.visual === "context" && (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[9.5px] leading-relaxed">
                      {[
                        ["src/server/auth/session.ts", "2,840 tokens"],
                        ["src/server/auth/tokens.ts", "1,912 tokens"],
                        ["migrations/0042_refresh.sql", "640 tokens"],
                        ["tests/auth/*.test.ts", "8,204 tokens"],
                      ].map(([file, tokens]) => (
                        <div key={file} className="flex justify-between gap-3 py-0.5">
                          <span className="truncate text-slate-500">{file}</span>
                          <span className="shrink-0 text-slate-400">{tokens}</span>
                        </div>
                      ))}
                      <div className="mt-2 h-1 rounded-full bg-slate-100">
                        <div className="h-1 w-[38%] rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[8px] text-slate-400">
                        <span>58,920 / 256,000 tokens</span>
                        <span>cached</span>
                      </div>
                    </div>
                  )}

                  {feature.visual === "swap" && (
                    <div className="mt-5 space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[9.5px]">
                      <div className="text-rose-600/70 line-through">baseURL: api.openai.com/v1</div>
                      <div className="text-emerald-700/80">baseURL: api.harness.studio/v1</div>
                      <div className="text-slate-500">model: &quot;harness-code-1&quot;</div>
                    </div>
                  )}

                  {feature.visual === "stream" && (
                    <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        event: response.output_text.delta
                      </div>
                      <div className="mt-1.5 font-mono text-[9.5px] text-violet-700/90">
                        data: {`{`}&quot;delta&quot;:&quot;patch applied&quot;{`}`}
                        <span className="caret" />
                      </div>
                    </div>
                  )}

                  {feature.visual === "cache" && (
                    <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5">
                      <span className="font-mono text-xl font-semibold text-emerald-700">−90%</span>
                      <span className="text-[10px] leading-snug text-slate-500">
                        on repeated input across agent turns and evals
                      </span>
                    </div>
                  )}
                </article>
              ))}

              <article className="md:col-span-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-transparent p-5">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: ShieldCheck, title: "SOC 2 Type II", text: "Audited controls, DPA available" },
                    { icon: Globe, title: "Zero retention", text: "No training on API data" },
                    { icon: Cpu, title: "Private VPC", text: "Self-host for Enterprise" },
                    { icon: Activity, title: "99.9% SLA", text: "Multi-region inference" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                      <div>
                        <div className="text-[12px] font-semibold text-slate-800">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* MODELS */}
        <section id="models" className="relative scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                  Models
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  One family. Every workload.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Same messages, tools and response shapes across all four models. Route by cost and
                  latency; keep the integration.
                </p>
              </div>
              <Link
                to="/docs#models"
                className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-slate-600 hover:text-slate-900"
              >
                Compare in docs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {models.map((model) => (
                <article
                  key={model.id}
                  className={cn(
                    "group relative rounded-2xl border p-5 transition",
                    model.id === "harness-code-1"
                      ? "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-transparent"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[16px] font-semibold text-slate-900">{model.name}</h3>
                        {model.badge && (
                          <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[9px] font-medium text-violet-700">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-slate-500">{model.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[9.5px] text-slate-600">
                      {model.id}
                    </span>
                  </div>

                  <p className="mt-3 text-[12.5px] leading-relaxed text-slate-600">{model.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {model.strengths.map((strength) => (
                      <span
                        key={strength}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Context</div>
                      <div className="mt-0.5 font-mono text-[12px] text-slate-800">{model.context}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Speed</div>
                      <div className="mt-0.5 font-mono text-[12px] text-slate-800">{model.speed}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Price / M</div>
                      <div className="mt-0.5 font-mono text-[12px] text-slate-800">
                        ${model.inputPrice} / ${model.outputPrice}
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/console"
                    className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-violet-700 hover:text-violet-700"
                  >
                    Try {model.short} in the console <ArrowRight className="h-3 w-3" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* API */}
        <section id="api" className="relative scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Developers
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                One API. Your stack.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                Harness is wire-compatible with the OpenAI Chat Completions API. Bring the SDK and
                tool schemas you already have — then turn on features that understand code.
              </p>

              <ul className="mt-7 space-y-3.5">
                {[
                  ["Chat Completions + Responses", "Streaming, tool calls, JSON Schema, seeds, logprobs."],
                  ["Prompt caching", "Mark stable prefixes and pay 10% for repeated input."],
                  ["Batch API", "50% off asynchronous jobs, results in under 24h."],
                  ["Usage you can audit", "Per-key spend limits, usage frames and webhook events."],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                      <Check className="h-2.5 w-2.5 text-emerald-700" />
                    </span>
                    <div>
                      <div className="text-[12.5px] font-medium text-slate-800">{title}</div>
                      <div className="text-[11.5px] text-slate-500">{body}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/docs#quickstart"
                className="btn-ghost mt-7 h-10 px-4 text-[12.5px]"
              >
                Quickstart guide
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  {(["typescript", "python", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCodeTab(tab)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition",
                        codeTab === tab
                          ? "bg-white text-slate-900"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {tab === "typescript" ? "TypeScript" : tab}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[9.5px] text-slate-400">POST /v1/chat/completions</span>
              </div>
              <CodeBlock
                className="min-w-0"
                code={codeSnippets[codeTab]}
                lang={codeTab === "typescript" ? "ts" : codeTab}
                filename={codeTab === "typescript" ? "agent.ts" : codeTab === "python" ? "agent.py" : "request.sh"}
              />
              <p className="mt-3 flex items-center gap-1.5 text-[10.5px] text-slate-400">
                <ShieldCheck className="h-3 w-3" />
                Keys are scoped per environment. Never ship them in client code.
              </p>
            </div>
          </div>
        </section>

        {/* CONSOLE */}
        <section className="relative scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-600">
                  Console
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  A console operators don&apos;t fight.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                  Everything the model needs, exposed instead of hidden. Tune the sampling, wire the
                  tools, mint keys and watch the request leave — in one workspace.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {consoleFeatures.map((item) => (
                    <div key={item.title}>
                      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-100">
                        <item.icon className="h-3.5 w-3.5 text-violet-700" />
                      </div>
                      <h3 className="text-[12.5px] font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{item.body}</p>
                    </div>
                  ))}
                </div>

                <Link to="/console" className="btn-primary mt-8 h-10 px-4 text-[12.5px]">
                  Open the console
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]">
                <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="inline-flex items-center gap-2 text-[11.5px] font-medium text-slate-700">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-violet-600" />
                    Request settings
                  </span>
                  <span className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
                    harness-code-1
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "temperature", value: "0.40", width: "20%" },
                    { label: "top_p", value: "0.95", width: "95%" },
                    { label: "max_tokens", value: "2048", width: "48%" },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex justify-between font-mono text-[10px]">
                        <span className="text-slate-500">{row.label}</span>
                        <span className="text-slate-700">{row.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="relative h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500"
                          style={{ width: row.width }}
                        >
                          <span className="absolute -right-1 -top-[3px] h-3 w-3 rounded-full border-2 border-[#0b0d14] bg-violet-300" />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      ["web_search", true],
                      ["code_execution", true],
                      ["file_search", false],
                      ["browser", false],
                    ].map(([tool, on]) => (
                      <div
                        key={String(tool)}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1.5"
                      >
                        <span className="font-mono text-[9.5px] text-slate-600">{tool}</span>
                        <span
                          className={cn(
                            "flex h-3 w-6 items-center rounded-full px-0.5",
                            on ? "bg-gradient-to-r from-sky-500 to-violet-500" : "bg-slate-200"
                          )}
                        >
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full bg-white",
                              on ? "ml-auto" : "opacity-60"
                            )}
                          />
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[9.5px] leading-relaxed text-slate-500">
                    <div className="text-slate-400">// generated request</div>
                    <div>
                      <span className="text-sky-700">&quot;model&quot;</span>:{" "}
                      <span className="text-emerald-700">&quot;harness-code-1&quot;</span>,
                    </div>
                    <div>
                      <span className="text-sky-700">&quot;stream&quot;</span>:{" "}
                      <span className="text-amber-700">true</span>,{" "}
                      <span className="text-sky-700">&quot;tools&quot;</span>: [
                      <span className="text-emerald-700">&quot;web_search&quot;</span>,{" "}
                      <span className="text-emerald-700">&quot;code_execution&quot;</span>]
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                    <span className="flex items-center gap-1.5 font-mono text-[9.5px] text-slate-500">
                      <KeyRound className="h-3 w-3 text-amber-700" />
                      hns_live_7Qx••••••••
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[8.5px] text-emerald-700">
                      active
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-4 -left-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl">
                  <Webhook className="h-3.5 w-3.5 text-sky-600" />
                  <span className="text-[10px] text-slate-600">response.completed</span>
                  <span className="text-[9px] text-emerald-600">200</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENCHMARKS */}
        <section className="border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Evals
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                  Fast enough to trust.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
                  Measured with our own harness on public benchmarks, with tool use enabled and no
                  test-set contamination. Reproducible scripts ship with every release.
                </p>
                <div className="mt-6 space-y-2 text-[11.5px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm bg-gradient-to-br from-sky-400 to-violet-500" />
                    Harness Code 1 · agentic settings
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-sm bg-slate-300" />
                    Best publicly reported baseline
                  </div>
                </div>
              </div>

              <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
                {benchmarks.map((b) => (
                  <div key={b.name}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[12.5px] font-medium text-slate-800">{b.name}</span>
                        <span className="text-[10px] text-slate-400">{b.note}</span>
                      </div>
                      <span className="font-mono text-[12px] font-semibold text-slate-900">
                        {b.value}
                        {b.suffix}
                      </span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500"
                        style={{ width: `${b.value}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-px bg-slate-900/15"
                        style={{ width: `${Math.max(b.value - 8, 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="pt-1 text-[10px] text-slate-400">
                  Internal evaluation run, October 2026. Task-level results and harness configs are in
                  the docs.
                </p>
              </div>
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
                Harness Studio is a small AI studio building agentic tools for engineers. We ship the
                model, the API and the surface you use to run it.
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
                  Founded 2024 · San Francisco / remote
                </span>
                <span className="hidden items-center gap-1.5 sm:inline-flex">
                  <Globe className="h-3.5 w-3.5 text-sky-600" />
                  Building in public
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

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-24 border-t border-slate-200 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
                Pricing
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Start free. Scale when it ships.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Plans cover the console and throughput. Tokens are metered per million, with cached
                input at 10% of the normal rate.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-5 shadow-sm",
                    plan.highlight
                      ? "border-violet-200 bg-gradient-to-b from-violet-50 to-transparent"
                      : "border-slate-200 bg-white"
                  )}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-5 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[9px] font-medium text-violet-700">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-[14px] font-semibold text-slate-900">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                    <span className="text-[11px] text-slate-500">{plan.cadence}</span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-slate-500">{plan.blurb}</p>

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-[12px] text-slate-600">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-violet-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/console"
                    className={cn(
                      "mt-6 flex h-9 items-center justify-center rounded-lg text-[12px] font-medium",
                      plan.highlight ? "btn-primary" : "btn-ghost"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5">
                <span className="text-[11px] font-medium text-slate-700">Token pricing</span>
                <span className="font-mono text-[10px] text-slate-400">USD per 1M tokens</span>
              </div>
              <div className="divide-y divide-slate-200">
                {tokenRows.map((row) => (
                  <div key={row.model} className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-2 px-4 py-2.5">
                    <span className="text-[12px] text-slate-800">{row.model}</span>
                    <span className="text-right font-mono text-[11.5px] text-slate-600">
                      ${row.input} in
                    </span>
                    <span className="text-right font-mono text-[11.5px] text-slate-600">
                      ${row.output} out
                    </span>
                    <span className="text-right font-mono text-[11.5px] text-slate-500">
                      {row.context} ctx
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-2 px-4 py-2.5">
                  <span className="text-[11.5px] text-slate-500">Cached input</span>
                  <span className="col-span-3 text-right font-mono text-[11px] text-emerald-700/80">
                    90% discount across Code and Reason models
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900">Questions, answered.</h2>
              <p className="mt-3 text-[12.5px] leading-relaxed text-slate-500">
                Still unsure? The docs go deeper, and the console has a live request playground.
              </p>
              <Link
                to="/docs"
                className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-violet-700 hover:text-violet-700"
              >
                Browse documentation <ArrowRight className="h-3 w-3" />
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
        <section className="px-5 pb-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-violet-50 via-white to-white px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="relative">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100">
                <DocLogo className="h-9 w-9" />
              </div>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Your next commit could write itself.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
                Open the console, pick a model and send a real request. One million free tokens, no
                card, no sales call.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link to="/console" className="btn-primary h-11 px-5 text-sm">
                  Open Harness Code
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/docs#quickstart" className="btn-ghost h-11 px-5 text-sm">
                  Read the quickstart
                </Link>
              </div>
              <p className="mt-4 font-mono text-[10px] text-slate-400">
                console.harness.studio · api.harness.studio/v1
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
