export type Model = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  context: string;
  maxOutput: number;
  inputPrice: number;
  outputPrice: number;
  speed: string;
  badge?: string;
  strengths: string[];
};

export const models: Model[] = [
  {
    id: "harness-code-1",
    name: "Harness Code 1",
    short: "Code 1",
    tagline: "Flagship agentic coding model",
    description:
      "Our most capable model for multi-file refactors, long-horizon agents and production debugging. Plans before it edits and verifies with tools.",
    context: "256K",
    maxOutput: 16384,
    inputPrice: 3,
    outputPrice: 15,
    speed: "~92 tok/s",
    badge: "Recommended",
    strengths: ["Agentic tool use", "Multi-file edits", "Long context", "Vision"],
  },
  {
    id: "harness-code-1-mini",
    name: "Harness Code Mini",
    short: "Code Mini",
    tagline: "Fast and inexpensive",
    description:
      "Built for inline completion, review bots and high-volume classification. Same API and tool protocol, a fraction of the cost.",
    context: "128K",
    maxOutput: 8192,
    inputPrice: 0.3,
    outputPrice: 1.2,
    speed: "~310 tok/s",
    strengths: ["Low latency", "High volume", "Structured output", "Cheap"],
  },
  {
    id: "harness-reason-1",
    name: "Harness Reason 1",
    short: "Reason 1",
    tagline: "Extended thinking for hard problems",
    description:
      "Spends more tokens thinking before answering. Best for architecture, tricky migrations, formal verification and root-cause analysis.",
    context: "256K",
    maxOutput: 32768,
    inputPrice: 5,
    outputPrice: 25,
    speed: "~38 tok/s",
    badge: "Reasoning",
    strengths: ["Deliberate reasoning", "Math + proofs", "Root-cause analysis", "Tool planning"],
  },
  {
    id: "harness-embed-1",
    name: "Harness Embed 1",
    short: "Embed 1",
    tagline: "Code-aware embeddings",
    description:
      "One vector space for code, docs and tickets. Powers semantic search, dedupe and retrieval for agents over your repository.",
    context: "8K",
    maxOutput: 0,
    inputPrice: 0.02,
    outputPrice: 0,
    speed: "batch",
    strengths: ["Code retrieval", "1536 dimensions", "Batch API", "Tunable"],
  },
];

export function getModel(id: string): Model {
  return models.find((m) => m.id === id) ?? models[0];
}

export const benchmarks = [
  { name: "SWE-bench Verified", value: 74.8, suffix: "%", note: "agentic, 500 issues" },
  { name: "HumanEval+", value: 96.4, suffix: "%", note: "pass@1" },
  { name: "LiveCodeBench", value: 62.1, suffix: "%", note: "2025–26 tasks" },
  { name: "Aider Polyglot", value: 71.3, suffix: "%", note: "6 languages" },
  { name: "Terminal-Bench", value: 54.6, suffix: "%", note: "shell agents" },
];

export const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    blurb: "For side projects and evaluating the API.",
    features: [
      "1M tokens / month included",
      "All four models",
      "60 requests / minute",
      "7-day request logs",
      "Community support",
    ],
    cta: "Start building",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per seat / month",
    blurb: "For teams shipping agents to production.",
    features: [
      "Pay-as-you-go tokens",
      "600 requests / minute",
      "Prompt caching + batch API",
      "90-day logs, webhooks, evals",
      "Priority support, 99.9% SLA",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    blurb: "For regulated teams and private deployments.",
    features: [
      "Unlimited throughput + reserved capacity",
      "VPC / on-prem deployment",
      "SOC 2 Type II, DPA, zero retention",
      "SSO, SCIM, audit logs",
      "Dedicated solutions engineer",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export const faqs = [
  {
    q: "What is Harness Studio?",
    a: "Harness Studio is an independent software company. It is also the name of its first product: an AI development app where you describe what you want in your browser and review the changes inside your project.",
  },
  {
    q: "Why do the company and the product share a name?",
    a: "The company and its AI development app are both called Harness Studio. On this site, “Harness Studio” usually means the company; “the Harness Studio app” or “Harness Studio AI” makes it clear we mean the product.",
  },
  {
    q: "Where do I talk to the AI?",
    a: "In the Harness Studio app, in your browser. Describe what you want in your own words, and the AI teammate will work inside your project to make it happen.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. You can ask for changes in plain language. If you do code, you can go as deep as you like — but you never need special syntax or developer-only settings to get started.",
  },
  {
    q: "What can I ask it to do?",
    a: "Fix a broken button, add a page, change how something looks, explain part of your project, or help you decide what to build next. If you can describe it, it’s worth asking.",
  },
  {
    q: "Is the demo the full app?",
    a: "No. The demo lets you try the conversation in your browser. The full experience — your project, the changes and the review — happens inside the Harness Studio app.",
  },
  {
    q: "What if I don’t like a change?",
    a: "Ask for a different direction, or undo it. You’re always in control of what stays.",
  },
];

export const codeSnippets = {
  typescript: `import { Harness } from "@harness-studio/sdk";

const harness = new Harness({ apiKey: process.env.HARNESS_API_KEY });

const stream = await harness.chat.completions.create({
  model: "harness-code-1",
  messages: [
    { role: "system", content: "You are a senior engineer. Show diffs." },
    { role: "user", content: "Refactor auth to rotate refresh tokens." },
  ],
  tools: [{ type: "code_execution" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}`,
  python: `from harness import Harness

client = Harness()  # reads HARNESS_API_KEY

stream = client.chat.completions.create(
    model="harness-code-1",
    messages=[
        {"role": "system", "content": "You are a senior engineer. Show diffs."},
        {"role": "user", "content": "Refactor auth to rotate refresh tokens."},
    ],
    tools=[{"type": "code_execution"}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
  curl: `curl https://api.harness.studio/v1/chat/completions \\
  -H "Authorization: Bearer $HARNESS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "harness-code-1",
    "messages": [
      { "role": "user", "content": "Refactor auth to rotate refresh tokens." }
    ],
    "tools": [{ "type": "code_execution" }],
    "stream": true
  }'`,
};
