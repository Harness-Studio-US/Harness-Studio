import { useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Loader2,
  Play,
  Plus,
  Trash2,
  Webhook as WebhookIcon,
  XCircle,
} from "lucide-react";
import { useSettings, estimateTokens, type RequestLog } from "../../lib/settings";
import { models } from "../../data/site";
import {
  API_BASE,
  DEFAULT_TEST_PROMPT,
  buildCurl,
  buildPython,
  buildRequestBody,
  buildTypeScript,
} from "../../lib/payload";
import { CodeBlock, CopyButton } from "../CodeBlock";
import { Badge, Segmented, StatusDot, Toggle } from "../controls";
import { cn } from "../../lib/cn";

type Section = "playground" | "logs" | "webhooks" | "usage";

const webhookEvents = [
  "response.completed",
  "response.failed",
  "batch.completed",
  "batch.failed",
  "usage.threshold",
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildUsageSeries(logs: RequestLog[]) {
  const today = new Date();
  const series = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - index));
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const base = 54000 + ((index * 37) % 11) * 6100;
    return {
      date,
      tokens: Math.round(base * (weekend ? 0.55 : 1)),
    };
  });
  const todayTokens = logs
    .filter((log) => new Date(log.ts).toDateString() === today.toDateString())
    .reduce((sum, log) => sum + log.tokensIn + log.tokensOut, 0);
  series[series.length - 1].tokens += todayTokens;
  return series;
}

export function DevToolsTab() {
  const { settings, update, logRequest, clearLogs } = useSettings();
  const [section, setSection] = useState<Section>("playground");
  const [lang, setLang] = useState<"curl" | "typescript" | "python">("curl");
  const [testPrompt, setTestPrompt] = useState(DEFAULT_TEST_PROMPT);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    status: number;
    latency: number;
    body: string;
    live: boolean;
    error?: boolean;
  } | null>(null);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [hookUrl, setHookUrl] = useState("");
  const [hookEvents, setHookEvents] = useState<string[]>(["response.completed"]);
  const [notice, setNotice] = useState("");
  const [showPayload, setShowPayload] = useState(false);

  const snippets = useMemo(
    () => ({
      curl: buildCurl(settings, testPrompt),
      typescript: buildTypeScript(settings, testPrompt),
      python: buildPython(settings, testPrompt),
    }),
    [settings, testPrompt]
  );
  const payload = useMemo(() => buildRequestBody(settings, testPrompt), [settings, testPrompt]);
  const series = useMemo(() => buildUsageSeries(settings.logs), [settings.logs]);
  const totalTokens = series.reduce((sum, day) => sum + day.tokens, 0);
  const maxDay = Math.max(...series.map((day) => day.tokens), 1);
  const requests30d = Math.round(totalTokens / 3200);
  const avgLatency = settings.logs.length
    ? Math.round(settings.logs.reduce((sum, log) => sum + log.latency, 0) / settings.logs.length)
    : 0;
  const errorCount = settings.logs.filter((log) => log.status >= 400).length;
  const modelTotals = models
    .filter((model) => model.id !== "harness-embed-1")
    .map((model) => ({
      name: model.short,
      tokens: settings.logs
        .filter((log) => log.model === model.id)
        .reduce((sum, log) => sum + log.tokensIn + log.tokensOut, 0),
    }));
  const modelMax = Math.max(...modelTotals.map((item) => item.tokens), 1);
  const activeLog = settings.logs.find((log) => log.id === selectedLog) ?? null;

  async function runTest() {
    if (running) return;
    setRunning(true);
    setResult(null);
    const started = performance.now();
    const provider = settings.provider;

    if (provider?.baseUrl && provider?.apiKey) {
      const body = buildRequestBody(settings, testPrompt, provider.model || settings.model);
      body.stream = false;
      body.max_tokens = Math.min(Number(body.max_tokens) || 256, 256);
      try {
        const res = await fetch(`${provider.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify(body),
        });
        const text = await res.text();
        const latency = Math.round(performance.now() - started);
        setResult({ status: res.status, latency, body: text, live: true, error: !res.ok });
        logRequest({
          endpoint: "/v1/chat/completions",
          model: provider.model || settings.model,
          status: res.status,
          latency,
          ttft: Math.round(latency * 0.3),
          tokensIn: estimateTokens(testPrompt),
          tokensOut: estimateTokens(text),
          stream: false,
        });
      } catch (error) {
        const latency = Math.round(performance.now() - started);
        const message = error instanceof Error ? error.message : "Network request failed";
        setResult({ status: 500, latency, body: message, live: true, error: true });
        logRequest({
          endpoint: "/v1/chat/completions",
          model: provider.model || settings.model,
          status: 500,
          latency,
          ttft: 0,
          tokensIn: estimateTokens(testPrompt),
          tokensOut: 0,
          stream: false,
        });
      } finally {
        setRunning(false);
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 720 + Math.random() * 500));
    const latency = Math.round(performance.now() - started);
    const sample = JSON.stringify(
      {
        id: `chatcmpl_preview_${Math.random().toString(36).slice(2, 8)}`,
        object: "chat.completion",
        model: settings.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content:
                "Your test likely passes locally because the real clock resolves the promise first. In CI the fake timers need to be advanced before the assertion. Wrap it in `await vi.advanceTimersByTimeAsync(30_000)`, then assert — and make sure the request mock is awaited before you advance.",
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: estimateTokens(testPrompt) + 96,
          completion_tokens: 96,
          total_tokens: estimateTokens(testPrompt) + 192,
        },
      },
      null,
      2
    );
    setResult({ status: 200, latency, body: sample, live: false });
    logRequest({
      endpoint: "/v1/chat/completions",
      model: settings.model,
      status: 200,
      latency,
      ttft: Math.round(latency * 0.28),
      tokensIn: estimateTokens(testPrompt) + 96,
      tokensOut: 96,
      stream: settings.stream,
    });
    setRunning(false);
  }

  function addWebhook() {
    if (!/^https?:\/\/.+/.test(hookUrl.trim()) || hookEvents.length === 0) return;
    update({
      webhooks: [
        {
          id: Math.random().toString(36).slice(2),
          url: hookUrl.trim(),
          events: hookEvents,
          active: true,
          lastDelivery: null,
        },
        ...settings.webhooks,
      ],
    });
    setHookUrl("");
    setHookEvents(["response.completed"]);
    setNotice("Endpoint added");
    window.setTimeout(() => setNotice(""), 2200);
  }

  function testWebhook(id: string, url: string) {
    update({
      webhooks: settings.webhooks.map((hook) =>
        hook.id === id ? { ...hook, lastDelivery: new Date().toISOString() } : hook
      ),
    });
    setNotice(`Test event queued for ${url.replace(/^https?:\/\//, "").slice(0, 32)}`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <div className="space-y-4">
      <Segmented
        value={section}
        onChange={setSection}
        options={[
          { value: "playground", label: "Playground" },
          { value: "logs", label: "Logs" },
          { value: "webhooks", label: "Webhooks" },
          { value: "usage", label: "Usage" },
        ]}
        size="sm"
      />

      {section === "playground" && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-[12px] font-medium text-slate-800">Test prompt</label>
              <button
                type="button"
                onClick={() => setShowPayload((v) => !v)}
                className="text-[10px] text-slate-500 hover:text-slate-700"
              >
                {showPayload ? "Hide JSON body" : "Show JSON body"}
              </button>
            </div>
            <textarea
              value={testPrompt}
              onChange={(event) => setTestPrompt(event.target.value)}
              rows={3}
              className="field resize-none text-[12px]"
              placeholder="Ask the model something for the test request"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[9.5px] text-slate-400">
                {estimateTokens(testPrompt)} prompt tokens · {settings.environment}
              </span>
              <button
                type="button"
                onClick={runTest}
                disabled={running}
                className="btn-primary h-8 px-3 text-[11px] disabled:opacity-60"
              >
                {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                {running ? "Sending…" : "Send test request"}
              </button>
            </div>
          </div>

          {showPayload && (
            <CodeBlock
              code={JSON.stringify(payload, null, 2)}
              lang="json"
              filename="request.json"
              className="max-h-64 overflow-y-auto"
            />
          )}

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-slate-700">Generated snippet</span>
              <span className="font-mono text-[9px] text-slate-400">
                {API_BASE[settings.environment].replace("https://", "")}/chat/completions
              </span>
            </div>
            <Segmented
              value={lang}
              onChange={setLang}
              options={[
                { value: "curl", label: "cURL" },
                { value: "typescript", label: "TypeScript" },
                { value: "python", label: "Python" },
              ]}
              size="sm"
            />
            <CodeBlock
              code={snippets[lang]}
              lang={lang === "typescript" ? "ts" : lang}
              filename={lang === "typescript" ? "request.ts" : lang === "python" ? "request.py" : "request.sh"}
              className="mt-2 max-h-72 overflow-y-auto"
            />
          </div>

          {result && (
            <div
              className={cn(
                "rounded-xl border p-3",
                result.error
                  ? "border-rose-200 bg-rose-50"
                  : "border-emerald-200 bg-emerald-50"
              )}
            >
              <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
                {result.error ? (
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                )}
                <span className="font-mono text-slate-800">HTTP {result.status || "ERR"}</span>
                <span className="font-mono text-slate-500">{result.latency}ms</span>
                <Badge tone={result.live ? "green" : "amber"}>
                  {result.live ? "live provider" : "simulated"}
                </Badge>
                <CopyButton text={result.body} className="ml-auto" />
              </div>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded border border-slate-200 bg-slate-50 p-2 font-mono text-[9.5px] leading-relaxed text-slate-600">
                {result.body}
              </pre>
              {!result.live && (
                <p className="mt-2 text-[9.5px] text-slate-500">
                  No provider connected, so this response is simulated and the request was logged
                  locally. Connect a provider under API keys to send the request for real.
                </p>
              )}
            </div>
          )}

          <p className="text-[10px] leading-relaxed text-slate-400">
            The snippet includes your current sampling, tool and cache settings. Requests from the
            browser can be blocked by a provider&apos;s CORS policy — call the API from your server in
            production.
          </p>
        </>
      )}

      {section === "logs" && (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-slate-800">Request logs</div>
              <p className="text-[10px] text-slate-400">
                Last {settings.logs.length} requests · stored in this browser
              </p>
            </div>
            <button
              type="button"
              onClick={clearLogs}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-600 hover:text-slate-900"
            >
              <Trash2 className="h-2.5 w-2.5" />
              Clear
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200">
            {settings.logs.length === 0 ? (
              <p className="p-4 text-center text-[11px] text-slate-400">No requests logged yet.</p>
            ) : (
              <div className="divide-y divide-slate-200">
                {settings.logs.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => setSelectedLog(log.id === selectedLog ? null : log.id)}
                    className={cn(
                      "block w-full px-3 py-2.5 text-left transition hover:bg-slate-50",
                      selectedLog === log.id && "bg-slate-100"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-slate-700">
                        <StatusDot status={log.status} />
                        {log.status}
                        <span className="text-slate-400">·</span>
                        <span className="truncate text-slate-500">{log.model}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[9px] text-slate-400">{timeAgo(log.ts)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[9.5px] text-slate-400">
                        {log.endpoint} {log.stream ? "· stream" : ""}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] text-slate-400">
                        {log.latency}ms · {(log.tokensIn + log.tokensOut).toLocaleString()} tok
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeLog && (
            <CodeBlock
              code={JSON.stringify(
                {
                  id: activeLog.id,
                  timestamp: activeLog.ts,
                  endpoint: activeLog.endpoint,
                  model: activeLog.model,
                  status: activeLog.status,
                  latency_ms: activeLog.latency,
                  ttft_ms: activeLog.ttft,
                  stream: activeLog.stream,
                  usage: { input_tokens: activeLog.tokensIn, output_tokens: activeLog.tokensOut },
                },
                null,
                2
              )}
              lang="json"
              filename="log.json"
            />
          )}

          <p className="text-[10px] text-slate-400">
            {errorCount} of {settings.logs.length} logged requests returned an error. Production logs
            include full request ids and are retained for 90 days.
          </p>
        </>
      )}

      {section === "webhooks" && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <Plus className="h-3 w-3 text-violet-700" />
              <span className="text-[12px] font-medium text-slate-800">Add endpoint</span>
            </div>
            <input
              value={hookUrl}
              onChange={(event) => setHookUrl(event.target.value)}
              className="field font-mono text-[11px]"
              placeholder="https://api.example.com/hooks/harness"
              aria-label="Webhook endpoint URL"
            />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {webhookEvents.map((event) => (
                <label key={event} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <input
                    type="checkbox"
                    checked={hookEvents.includes(event)}
                    onChange={() =>
                      setHookEvents((prev) =>
                        prev.includes(event) ? prev.filter((item) => item !== event) : [...prev, event]
                      )
                    }
                    className="h-3 w-3 accent-violet-500"
                  />
                  {event}
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={addWebhook}
              disabled={!/^https?:\/\/.+/.test(hookUrl.trim()) || hookEvents.length === 0}
              className="btn-primary mt-3 h-8 w-full px-3 text-[11px] disabled:opacity-40"
            >
              Add endpoint
            </button>
          </div>

          {notice && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] text-emerald-700">
              {notice}
            </p>
          )}

          <div className="space-y-2">
            {settings.webhooks.length === 0 && (
              <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-[11px] text-slate-400">
                No webhook endpoints yet.
              </p>
            )}
            {settings.webhooks.map((hook) => (
              <div key={hook.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[10.5px] text-slate-700">{hook.url}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {hook.events.map((event) => (
                        <Badge key={event} tone="violet">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Toggle
                    checked={hook.active}
                    onChange={() =>
                      update({
                        webhooks: settings.webhooks.map((item) =>
                          item.id === hook.id ? { ...item, active: !item.active } : item
                        ),
                      })
                    }
                    label="Webhook active"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] text-slate-400">
                    {hook.lastDelivery ? `last delivery ${timeAgo(hook.lastDelivery)}` : "never delivered"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => testWebhook(hook.id, hook.url)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-600 hover:text-slate-900"
                    >
                      Send test
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        update({ webhooks: settings.webhooks.filter((item) => item.id !== hook.id) })
                      }
                      className="rounded border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-600 hover:text-rose-600"
                      aria-label="Delete webhook"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-700">
              <WebhookIcon className="h-3 w-3 text-sky-600" />
              Signature verification
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              Deliveries are signed with HMAC-SHA256. Verify the{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-[9px] text-slate-700">
                X-Harness-Signature
              </code>{" "}
              header against the endpoint secret before trusting a payload.
            </p>
          </div>
        </>
      )}

      {section === "usage" && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["tokens / 30d", `${(totalTokens / 1_000_000).toFixed(2)}M`],
              ["requests / 30d", requests30d.toLocaleString()],
              ["avg latency", avgLatency ? `${avgLatency}ms` : "—"],
              ["errors", `${errorCount}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
                <div className="mt-0.5 font-mono text-base text-slate-900">{value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-slate-800">Token usage</span>
              <span className="text-[9px] text-slate-400">last 30 days · preview</span>
            </div>
            <div className="flex h-24 items-end gap-[3px]">
              {series.map((day, index) => (
                <div key={index} className="group relative flex flex-1 flex-col justify-end">
                  <div
                    className={cn(
                      "w-full rounded-sm",
                      index === series.length - 1
                        ? "bg-gradient-to-t from-violet-600 to-sky-400"
                        : "bg-gradient-to-t from-violet-600/50 to-violet-400/50"
                    )}
                    style={{ height: `${Math.max(4, (day.tokens / maxDay) * 100)}%` }}
                    title={`${dayLabel(day.date)}: ${day.tokens.toLocaleString()} tokens`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[8.5px] text-slate-400">
              <span>{dayLabel(series[0].date)}</span>
              <span>{dayLabel(series[14].date)}</span>
              <span>today</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-slate-800">By model</span>
              <span className="font-mono text-[9px] text-slate-400">from logs</span>
            </div>
            <div className="space-y-2">
              {modelTotals.map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex justify-between font-mono text-[9.5px]">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="text-slate-500">{item.tokens.toLocaleString()} tok</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                      style={{ width: `${Math.max(item.tokens ? 3 : 0, (item.tokens / modelMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-slate-800">Plan allowance</span>
              <Badge tone="violet">Pro</Badge>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                style={{ width: `${Math.min(100, (totalTokens / 5_000_000) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[9.5px] text-slate-400">
              <span>{(totalTokens / 1_000_000).toFixed(2)}M of 5M tokens</span>
              <span>${((totalTokens / 1_000_000) * 4.6).toFixed(2)} est. spend</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-sky-600" />
              <span className="text-[11.5px] font-medium text-slate-800">Rate limits</span>
            </div>
            {[
              ["Requests / min", 600, 108],
              ["Tokens / min", 1_000_000, 182_000],
            ].map(([label, limit, used]) => (
              <div key={String(label)} className="mb-2 last:mb-0">
                <div className="mb-1 flex justify-between font-mono text-[9px] text-slate-500">
                  <span>{label}</span>
                  <span>
                    {(used as number).toLocaleString()} / {(limit as number).toLocaleString()}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-slate-100">
                  <div
                    className="h-1 rounded-full bg-sky-400/80"
                    style={{ width: `${((used as number) / (limit as number)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
