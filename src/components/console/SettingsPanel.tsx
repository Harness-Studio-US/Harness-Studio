import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "firebase/auth";
import {
  BookOpen,
  Check,
  Compass,
  FileText,
  Globe,
  KeyRound,
  MessageSquare,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import {
  DEFAULT_SYSTEM_PROMPT,
  estimateTokens,
  useSettings,
  type ApiKey,
} from "../../lib/settings";
import { API_BASE } from "../../lib/payload";
import { models } from "../../data/site";
import { CopyButton } from "../CodeBlock";
import { Badge, Segmented, SettingCard, Slider, Toggle } from "../controls";
import { cn } from "../../lib/cn";
import { DevToolsTab } from "./DevToolsTab";
import { SecurityTab } from "./SecurityTab";

type TabId = "model" | "prompt" | "tools" | "keys" | "security" | "dev";

const tabs: Array<{ id: TabId; label: string; icon: typeof SlidersHorizontal }> = [
  { id: "model", label: "Model", icon: SlidersHorizontal },
  { id: "prompt", label: "Prompt", icon: MessageSquare },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "keys", label: "API keys", icon: KeyRound },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "dev", label: "Dev tools", icon: Terminal },
];

const allScopes = ["chat:write", "models:read", "files:write", "logs:read"];

const promptPresets = [
  {
    id: "default",
    label: "Studio default",
    body: DEFAULT_SYSTEM_PROMPT,
  },
  {
    id: "concise",
    label: "Concise",
    body: "You are Harness Code. Answer in the fewest words that are still correct. Prefer code over prose. Never restate the question. Flag uncertainty explicitly.",
  },
  {
    id: "architect",
    label: "Architect",
    body: "You are a principal engineer at Harness Studio. Start with constraints and trade-offs, then propose a minimal design. Call out failure modes, migrations and rollback. Use tools to verify assumptions before committing to a plan.",
  },
  {
    id: "reviewer",
    label: "Reviewer",
    body: "You are a strict code reviewer. Focus on correctness, security, data loss and missing tests. Cite the exact line or behaviour. Do not comment on style unless it hides a bug. Suggest the smallest fix.",
  },
];

const toolDefs = [
  {
    key: "web" as const,
    name: "web_search",
    icon: Globe,
    description: "Fetch fresh pages and return ranked extracts with citations.",
    schema: { type: "web_search", max_results: 5, freshness: "2026", citations: true },
  },
  {
    key: "code" as const,
    name: "code_execution",
    icon: Terminal,
    description: "Run commands in an isolated sandbox with the repo mounted.",
    schema: { type: "code_execution", language: "node", timeout_ms: 120000, network: "restricted" },
  },
  {
    key: "files" as const,
    name: "file_search",
    icon: FileText,
    description: "Semantic search across indexed files and uploaded documents.",
    schema: { type: "file_search", vector_store_ids: ["vs_repo"], max_results: 8 },
  },
  {
    key: "browser" as const,
    name: "browser",
    icon: Compass,
    description: "Open a headless browser to inspect docs or reproduce a UI bug.",
    schema: { type: "browser", headless: true, allowed_domains: ["docs.*", "*.npmjs.com"] },
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ModelTab() {
  const { settings, update } = useSettings();

  return (
    <div className="space-y-4">
      <SettingCard title="Model" description="Routing changes apply to the next message you send.">
        <div className="space-y-1.5">
          {models.map((model) => {
            const selected = settings.model === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => update({ model: model.id })}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition",
                  selected
                    ? "border-violet-200 bg-violet-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full border",
                    selected ? "border-violet-300 bg-violet-400" : "border-slate-300"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-[12px] font-medium text-slate-800">{model.name}</span>
                    <span className="font-mono text-[9px] text-slate-400">
                      {model.context} · ${model.inputPrice}/${model.outputPrice}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[10.5px] text-slate-500">{model.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard title="Sampling" description="These values are sent verbatim with every request.">
        <div className="space-y-4">
          <Slider
            label="Temperature"
            value={settings.temperature}
            min={0}
            max={2}
            step={0.05}
            onChange={(value) => update({ temperature: value })}
            format={(value) => value.toFixed(2)}
            help="Lower keeps patches predictable. Above 1.0 gets adventurous."
          />
          <Slider
            label="Top P"
            value={settings.topP}
            min={0.01}
            max={1}
            step={0.01}
            onChange={(value) => update({ topP: value })}
            format={(value) => value.toFixed(2)}
          />
          <Slider
            label="Top K"
            value={settings.topK}
            min={1}
            max={100}
            step={1}
            onChange={(value) => update({ topK: value })}
          />
          <Slider
            label="Max output tokens"
            value={settings.maxTokens}
            min={256}
            max={16384}
            step={256}
            onChange={(value) => update({ maxTokens: value })}
            format={(value) => value.toLocaleString()}
          />
          <div className="grid grid-cols-2 gap-3">
            <Slider
              label="Presence"
              value={settings.presencePenalty}
              min={0}
              max={2}
              step={0.1}
              onChange={(value) => update({ presencePenalty: value })}
              format={(value) => value.toFixed(1)}
            />
            <Slider
              label="Frequency"
              value={settings.frequencyPenalty}
              min={0}
              max={2}
              step={0.1}
              onChange={(value) => update({ frequencyPenalty: value })}
              format={(value) => value.toFixed(1)}
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Generation">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-slate-800">Stream tokens</div>
              <p className="text-[10.5px] text-slate-500">Receive server-sent events as they arrive.</p>
            </div>
            <Toggle
              checked={settings.stream}
              onChange={(value) => update({ stream: value })}
              label="Stream tokens"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-slate-800">Prompt caching</div>
              <p className="text-[10.5px] text-slate-500">Cache the stable prefix; read at 10% cost.</p>
            </div>
            <Toggle
              checked={settings.cacheEnabled}
              onChange={(value) => update({ cacheEnabled: value })}
              label="Prompt caching"
            />
          </div>
          <div>
            <div className="mb-1.5 text-[12px] font-medium text-slate-800">Response format</div>
            <Segmented
              value={settings.responseFormat}
              onChange={(value) => update({ responseFormat: value })}
              options={[
                { value: "text", label: "Text" },
                { value: "json_object", label: "JSON object" },
              ]}
              size="sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600" htmlFor="seed">
                Seed
              </label>
              <div className="flex gap-1">
                <input
                  id="seed"
                  type="number"
                  value={settings.seed ?? ""}
                  onChange={(event) =>
                    update({ seed: event.target.value === "" ? null : Number(event.target.value) })
                  }
                  placeholder="random"
                  className="field font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => update({ seed: null })}
                  className="shrink-0 rounded-md border border-slate-200 px-2 text-[9px] text-slate-500 hover:text-slate-800"
                >
                  rand
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600" htmlFor="stop">
                Stop sequences
              </label>
              <input
                id="stop"
                value={settings.stop}
                onChange={(event) => update({ stop: event.target.value })}
                placeholder="one per line"
                className="field font-mono text-[11px]"
              />
            </div>
          </div>
        </div>
      </SettingCard>

      <button
        type="button"
        onClick={() =>
          update({
            temperature: 0.4,
            topP: 0.95,
            topK: 40,
            maxTokens: 2048,
            presencePenalty: 0,
            frequencyPenalty: 0,
            seed: null,
            stop: "",
            stream: true,
            responseFormat: "text",
          })
        }
        className="w-full rounded-lg border border-slate-200 py-2 text-[11px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
      >
        Reset sampling to studio defaults
      </button>
    </div>
  );
}

function PromptTab() {
  const { settings, update } = useSettings();
  const tokens = estimateTokens(settings.systemPrompt);

  return (
    <div className="space-y-4">
      <SettingCard
        title="System prompt"
        description="Prepended to every request. Keep it stable to hit the prompt cache."
        right={<span className="font-mono text-[9.5px] text-slate-400">{tokens} tok</span>}
      >
        <div className="mb-2 grid grid-cols-2 gap-1.5">
          {promptPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => update({ systemPrompt: preset.body, promptPreset: preset.id })}
              className={cn(
                "rounded-md border px-2 py-1.5 text-left text-[10.5px] transition",
                settings.promptPreset === preset.id
                  ? "border-violet-200 bg-violet-50 text-slate-800"
                  : "border-slate-200 bg-white text-slate-500 hover:text-slate-800"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <textarea
          value={settings.systemPrompt}
          onChange={(event) => update({ systemPrompt: event.target.value, promptPreset: "custom" })}
          rows={11}
          className="field resize-y font-mono text-[11px] leading-relaxed"
          placeholder="Describe how Harness Code should behave…"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[9.5px] text-slate-400">
            {settings.systemPrompt.length.toLocaleString()} characters · saved automatically
          </span>
          <button
            type="button"
            onClick={() => update({ systemPrompt: DEFAULT_SYSTEM_PROMPT, promptPreset: "default" })}
            className="text-[10px] text-slate-500 hover:text-slate-700"
          >
            Restore studio prompt
          </button>
        </div>
      </SettingCard>

      <SettingCard title="Context budget">
        <div className="space-y-2">
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>system + conversation</span>
            <span>{tokens.toLocaleString()} / 256,000</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
              style={{ width: `${Math.min(100, Math.max(1.5, (tokens / 256000) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[9.5px] text-slate-400">
            <span>Prompt cache eligible</span>
            <span>Max output {settings.maxTokens.toLocaleString()} tok</span>
          </div>
        </div>
      </SettingCard>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
          <BookOpen className="h-3 w-3 text-sky-600" />
          Prompt engineering for code
        </div>
        <ul className="mt-2 space-y-1.5 text-[10.5px] leading-relaxed text-slate-500">
          <li>• Put repo conventions before the task so the cache can reuse them.</li>
          <li>• Ask for a diff and a test, not an explanation.</li>
          <li>• Bound the tool loop explicitly when latency matters.</li>
        </ul>
      </div>
    </div>
  );
}

function ToolsTab() {
  const { settings, setTool, update } = useSettings();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[12px] font-semibold text-slate-900">Built-in tools</h3>
          <p className="mt-0.5 text-[10.5px] text-slate-500">Executed in the Harness sandbox.</p>
        </div>
        <Link
          to="/docs#tool-calling"
          className="shrink-0 text-[10px] text-violet-700 hover:text-violet-700"
        >
          Docs →
        </Link>
      </div>

      <div className="space-y-2">
        {toolDefs.map((tool) => (
          <div
            key={tool.key}
            className={cn(
              "rounded-xl border p-3 transition",
              settings.tools[tool.key]
                ? "border-violet-200 bg-violet-50"
                : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50">
                  <tool.icon className="h-3 w-3 text-violet-700" />
                </span>
                <div>
                  <div className="font-mono text-[11px] text-slate-800">{tool.name}</div>
                  <p className="mt-0.5 text-[10.5px] leading-relaxed text-slate-500">{tool.description}</p>
                </div>
              </div>
              <Toggle
                checked={settings.tools[tool.key]}
                onChange={(value) => setTool(tool.key, value)}
                label={tool.name}
              />
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer list-none text-[9.5px] text-slate-400 hover:text-slate-600 [&::-webkit-details-marker]:hidden">
                Configuration
              </summary>
              <pre className="mt-1.5 overflow-x-auto rounded border border-slate-200 bg-slate-50 p-2 font-mono text-[9px] leading-relaxed text-slate-500">
                {JSON.stringify(tool.schema, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>

      <SettingCard title="Tool policy">
        <div className="space-y-3">
          <div>
            <div className="mb-1.5 text-[11px] font-medium text-slate-600">Tool choice</div>
            <Segmented
              value={settings.toolChoice}
              onChange={(value) => update({ toolChoice: value })}
              options={[
                { value: "auto", label: "Auto" },
                { value: "required", label: "Required" },
                { value: "none", label: "None" },
              ]}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-slate-800">Parallel tool calls</div>
              <p className="text-[10.5px] text-slate-500">Allow several calls in one assistant turn.</p>
            </div>
            <Toggle
              checked={settings.parallelTools}
              onChange={(value) => update({ parallelTools: value })}
              label="Parallel tool calls"
            />
          </div>
          <Slider
            label="Max tool rounds"
            value={settings.maxToolRounds}
            min={1}
            max={20}
            step={1}
            onChange={(value) => update({ maxToolRounds: value })}
            help="The loop stops with finish_reason = tool_limit when this is reached."
          />
        </div>
      </SettingCard>
    </div>
  );
}

function KeysTab() {
  const { settings, update, addKey, revokeKey } = useSettings();
  const [label, setLabel] = useState("");
  const [scopes, setScopes] = useState<string[]>(["chat:write"]);
  const [created, setCreated] = useState<ApiKey | null>(null);

  const [providerUrl, setProviderUrl] = useState(settings.provider?.baseUrl ?? "");
  const [providerKey, setProviderKey] = useState(settings.provider?.apiKey ?? "");
  const [providerModel, setProviderModel] = useState(settings.provider?.model ?? "gpt-4.1-mini");
  const [savedProvider, setSavedProvider] = useState(false);

  const baseUrl = API_BASE[settings.environment];

  function createKey() {
    if (!scopes.length) return;
    const key = addKey(label.trim(), scopes);
    setCreated(key);
    setLabel("");
  }

  return (
    <div className="space-y-4">
      <SettingCard title="Environment">
        <Segmented
          value={settings.environment}
          onChange={(value) => update({ environment: value })}
          options={[
            { value: "sandbox", label: "Sandbox" },
            { value: "production", label: "Production" },
          ]}
          size="sm"
        />
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
          <span className="truncate font-mono text-[9.5px] text-slate-600">{baseUrl}</span>
          <CopyButton text={baseUrl} className="ml-auto shrink-0" />
        </div>
        <p className="mt-1.5 text-[9.5px] text-slate-400">
          Sandbox keys never touch production data or billing.
        </p>
      </SettingCard>

      <SettingCard
        title="Create API key"
        description="Scoped keys are shown once. This console stores them in your browser only."
      >
        <div className="space-y-2">
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="field text-[11px]"
            placeholder="Key name, e.g. ci-runner"
            aria-label="Key name"
          />
          <div className="grid grid-cols-2 gap-1.5">
            {allScopes.map((scope) => (
              <label key={scope} className="flex items-center gap-1.5 font-mono text-[9.5px] text-slate-500">
                <input
                  type="checkbox"
                  checked={scopes.includes(scope)}
                  onChange={() =>
                    setScopes((prev) =>
                      prev.includes(scope) ? prev.filter((item) => item !== scope) : [...prev, scope]
                    )
                  }
                  className="h-3 w-3 accent-violet-500"
                />
                {scope}
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={createKey}
            disabled={!scopes.length}
            className="btn-primary h-8 w-full px-3 text-[11px] disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
            Generate key
          </button>
        </div>
      </SettingCard>

      {created && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-700">
              <ShieldCheck className="h-3 w-3" />
              Key created — copy it now
            </span>
            <button
              type="button"
              onClick={() => setCreated(null)}
              className="text-slate-500 hover:text-slate-700"
              aria-label="Dismiss new key"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <code className="min-w-0 flex-1 break-all rounded border border-slate-200 bg-slate-50 p-2 font-mono text-[9.5px] leading-relaxed text-slate-700">
              {created.key}
            </code>
            <CopyButton text={created.key} className="shrink-0" />
          </div>
          <p className="mt-1.5 text-[9px] text-slate-500">
            Scopes: {created.scopes.join(", ")} · created {formatDate(created.created)}
          </p>
        </div>
      )}

      <SettingCard title={`Keys · ${settings.apiKeys.length}`}>
        <div className="space-y-2">
          {settings.apiKeys.map((key) => (
            <div key={key.id} className="rounded-lg border border-slate-200 bg-white p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[11.5px] font-medium text-slate-800">{key.label}</div>
                  <div className="mt-0.5 truncate font-mono text-[9px] text-slate-400">
                    {key.key.slice(0, 16)}••••••
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <CopyButton text={key.key} className="h-6 px-1.5 text-[9px]" />
                  <button
                    type="button"
                    onClick={() => revokeKey(key.id)}
                    className="rounded-md border border-slate-200 px-1.5 text-slate-500 hover:text-rose-600"
                    aria-label={`Revoke ${key.label}`}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                {key.scopes.map((scope) => (
                  <Badge key={scope}>{scope}</Badge>
                ))}
                <span className="ml-auto font-mono text-[8.5px] text-slate-400">
                  {key.lastUsed ? `used ${formatDate(key.lastUsed)}` : "never used"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard
        title="Connect a provider"
        description="Route the console to any OpenAI-compatible endpoint. Requests go straight from this browser."
      >
        {settings.provider ? (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1.5">
            <span className="truncate font-mono text-[9.5px] text-emerald-700">
              connected · {settings.provider.baseUrl}
            </span>
            <Badge tone="green">{settings.provider.model || "default"}</Badge>
          </div>
        ) : (
          <div className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[9.5px] text-amber-700/80">
            No provider connected. Chat replies come from the local simulation engine.
          </div>
        )}
        <div className="space-y-2">
          <input
            value={providerUrl}
            onChange={(event) => {
              setProviderUrl(event.target.value);
              setSavedProvider(false);
            }}
            className="field font-mono text-[10.5px]"
            placeholder="https://api.openai.com/v1"
            aria-label="Provider base URL"
          />
          <input
            value={providerKey}
            onChange={(event) => {
              setProviderKey(event.target.value);
              setSavedProvider(false);
            }}
            type="password"
            className="field font-mono text-[10.5px]"
            placeholder="Provider API key"
            aria-label="Provider API key"
          />
          <input
            value={providerModel}
            onChange={(event) => setProviderModel(event.target.value)}
            className="field font-mono text-[10.5px]"
            placeholder="Model id"
            aria-label="Provider model"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!providerUrl.trim() || !providerKey.trim()}
              onClick={() => {
                update({
                  provider: {
                    baseUrl: providerUrl.trim(),
                    apiKey: providerKey.trim(),
                    model: providerModel.trim(),
                  },
                });
                setSavedProvider(true);
              }}
              className="btn-primary h-8 flex-1 px-3 text-[10.5px] disabled:opacity-40"
            >
              {savedProvider ? <Check className="h-3 w-3" /> : null}
              {savedProvider ? "Connection saved" : "Save connection"}
            </button>
            {settings.provider && (
              <button
                type="button"
                onClick={() => {
                  update({ provider: null });
                  setProviderUrl("");
                  setProviderKey("");
                  setSavedProvider(false);
                }}
                className="rounded-lg border border-slate-200 px-2.5 text-[10px] text-slate-600 hover:text-rose-600"
              >
                Disconnect
              </button>
            )}
          </div>
          <p className="text-[9px] leading-relaxed text-slate-400">
            The key is kept in this browser&apos;s local storage. Many providers block browser requests
            with CORS — use a server proxy in production. Never embed a key in shipped client code.
          </p>
        </div>
      </SettingCard>
    </div>
  );
}

export function SettingsPanel({
  open,
  onClose,
  user,
  onUserChanged,
}: {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  onUserChanged?: () => void;
}) {
  const [tab, setTab] = useState<TabId>("model");
  const { reset } = useSettings();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[470px] flex-col border-l border-slate-200 bg-white shadow-[-30px_0_80px_-30px_rgba(15,23,42,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-label="Console settings"
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900">Console settings</h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-[9.5px] text-slate-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Saved locally · applies to the next request
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex gap-0.5 overflow-x-auto border-b border-slate-200 px-2 py-1.5">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-selected={tab === item.id}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10.5px] font-medium transition",
                tab === item.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {tab === "model" && <ModelTab />}
          {tab === "prompt" && <PromptTab />}
          {tab === "tools" && <ToolsTab />}
          {tab === "keys" && <KeysTab />}
          {tab === "security" && (
            <SecurityTab user={user ?? null} onUserChanged={onUserChanged ?? (() => {})} />
          )}
          {tab === "dev" && <DevToolsTab />}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5">
          <Link
            to="/docs#parameters"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-700"
          >
            <BookOpen className="h-3 w-3" />
            Parameter reference
          </Link>
          <button
            type="button"
            onClick={reset}
            className="text-[10px] text-slate-400 transition hover:text-rose-600"
          >
            Reset defaults
          </button>
        </footer>
      </aside>
    </>
  );
}
