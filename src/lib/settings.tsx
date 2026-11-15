import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ApiKey = {
  id: string;
  label: string;
  key: string;
  created: string;
  lastUsed: string | null;
  scopes: string[];
};

export type Webhook = {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  lastDelivery: string | null;
};

export type RequestLog = {
  id: string;
  ts: string;
  endpoint: string;
  model: string;
  status: number;
  latency: number;
  ttft: number;
  tokensIn: number;
  tokensOut: number;
  stream: boolean;
};

export type ToolFlags = {
  web: boolean;
  code: boolean;
  files: boolean;
  browser: boolean;
};

export type ProviderConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

export type Settings = {
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  seed: number | null;
  stop: string;
  stream: boolean;
  responseFormat: "text" | "json_object";
  systemPrompt: string;
  promptPreset: string;
  tools: ToolFlags;
  toolChoice: "auto" | "required" | "none";
  parallelTools: boolean;
  maxToolRounds: number;
  cacheEnabled: boolean;
  logRequests: boolean;
  environment: "sandbox" | "production";
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  logs: RequestLog[];
  provider: ProviderConfig | null;
};

export const DEFAULT_SYSTEM_PROMPT =
  "You are Harness Copilot, the friendly AI teammate from Harness Studio. You help people build software by talking things through in plain language. Ask before making big changes, explain what you did simply, and keep the person in control of the result.";

const STORAGE_KEY = "harness-console-settings-v1";

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export function generateApiKey(env: "sandbox" | "production"): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let body = "";
  const bytes = new Uint8Array(36);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  for (let i = 0; i < bytes.length; i++) body += alphabet[bytes[i] % alphabet.length];
  return `hns_${env === "production" ? "live" : "sb"}_${body}`;
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function seedLogs(): RequestLog[] {
  const rows: Array<[number, string, number, number, number, number, number, boolean]> = [
    [0.4, "harness-code-1", 200, 1240, 310, 4820, 612, true],
    [1.1, "harness-code-1", 200, 2100, 540, 12330, 1450, false],
    [2.6, "harness-code-1-mini", 200, 430, 120, 880, 96, true],
    [5.2, "harness-code-1", 429, 18, 0, 9640, 0, true],
    [8.4, "harness-reason-1", 200, 6400, 1750, 2110, 3020, false],
    [19.3, "harness-code-1-mini", 200, 380, 98, 512, 64, true],
  ];
  return rows.map(([h, model, status, latency, ttft, tin, tout, stream]) => ({
    id: uid(),
    ts: hoursAgo(h),
    endpoint: "/v1/chat/completions",
    model,
    status,
    latency,
    ttft,
    tokensIn: tin,
    tokensOut: tout,
    stream,
  }));
}

function defaults(): Settings {
  return {
    model: "harness-code-1",
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
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    promptPreset: "default",
    tools: { web: true, code: true, files: false, browser: false },
    toolChoice: "auto",
    parallelTools: true,
    maxToolRounds: 8,
    cacheEnabled: true,
    logRequests: true,
    environment: "sandbox",
    apiKeys: [
      {
        id: uid(),
        label: "Development key",
        key: generateApiKey("sandbox"),
        created: hoursAgo(72),
        lastUsed: hoursAgo(0.4),
        scopes: ["chat:write", "models:read"],
      },
    ],
    webhooks: [
      {
        id: uid(),
        url: "https://example.com/hooks/harness",
        events: ["response.completed", "batch.failed"],
        active: true,
        lastDelivery: hoursAgo(19),
      },
    ],
    logs: seedLogs(),
    provider: null,
  };
}

function loadSettings(): Settings {
  const base = defaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...base,
      ...parsed,
      tools: { ...base.tools, ...(parsed.tools ?? {}) },
      apiKeys: Array.isArray(parsed.apiKeys) ? parsed.apiKeys : base.apiKeys,
      webhooks: Array.isArray(parsed.webhooks) ? parsed.webhooks : base.webhooks,
      logs: Array.isArray(parsed.logs) ? parsed.logs : base.logs,
      provider: parsed.provider ?? null,
    };
  } catch {
    return base;
  }
}

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  setTool: (tool: keyof ToolFlags, value: boolean) => void;
  reset: () => void;
  addKey: (label: string, scopes: string[]) => ApiKey;
  revokeKey: (id: string) => void;
  addWebhook: (url: string, events: string[]) => void;
  removeWebhook: (id: string) => void;
  toggleWebhook: (id: string) => void;
  logRequest: (log: Omit<RequestLog, "id" | "ts">) => void;
  clearLogs: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable — keep session state only */
    }
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTool = useCallback((tool: keyof ToolFlags, value: boolean) => {
    setSettings((prev) => ({ ...prev, tools: { ...prev.tools, [tool]: value } }));
  }, []);

  const reset = useCallback(() => {
    setSettings((prev) => ({
      ...defaults(),
      apiKeys: prev.apiKeys,
      webhooks: prev.webhooks,
      provider: prev.provider,
      logs: prev.logs,
      environment: prev.environment,
    }));
  }, []);

  const addKey = useCallback((label: string, scopes: string[]) => {
    const key: ApiKey = {
      id: uid(),
      label: label || "Untitled key",
      key: generateApiKey("production"),
      created: new Date().toISOString(),
      lastUsed: null,
      scopes,
    };
    setSettings((prev) => ({ ...prev, apiKeys: [key, ...prev.apiKeys] }));
    return key;
  }, []);

  const revokeKey = useCallback((id: string) => {
    setSettings((prev) => ({ ...prev, apiKeys: prev.apiKeys.filter((k) => k.id !== id) }));
  }, []);

  const addWebhook = useCallback((url: string, events: string[]) => {
    const hook: Webhook = {
      id: uid(),
      url,
      events,
      active: true,
      lastDelivery: null,
    };
    setSettings((prev) => ({ ...prev, webhooks: [hook, ...prev.webhooks] }));
  }, []);

  const removeWebhook = useCallback((id: string) => {
    setSettings((prev) => ({ ...prev, webhooks: prev.webhooks.filter((w) => w.id !== id) }));
  }, []);

  const toggleWebhook = useCallback((id: string) => {
    setSettings((prev) => ({
      ...prev,
      webhooks: prev.webhooks.map((w) => (w.id === id ? { ...w, active: !w.active } : w)),
    }));
  }, []);

  const logRequest = useCallback((log: Omit<RequestLog, "id" | "ts">) => {
    setSettings((prev) => ({
      ...prev,
      logs: [{ ...log, id: uid(), ts: new Date().toISOString() }, ...prev.logs].slice(0, 60),
    }));
  }, []);

  const clearLogs = useCallback(() => {
    setSettings((prev) => ({ ...prev, logs: [] }));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      update,
      setTool,
      reset,
      addKey,
      revokeKey,
      addWebhook,
      removeWebhook,
      toggleWebhook,
      logRequest,
      clearLogs,
    }),
    [
      settings,
      update,
      setTool,
      reset,
      addKey,
      revokeKey,
      addWebhook,
      removeWebhook,
      toggleWebhook,
      logRequest,
      clearLogs,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  return Math.max(1, Math.round(text.trim().length / 4));
}
