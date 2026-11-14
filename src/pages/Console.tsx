import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  LogIn,
  LogOut,
  FileText,
  Globe,
  Menu,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Square,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { ChatMessageView } from "../components/console/ChatMessageView";
import { SettingsPanel } from "../components/console/SettingsPanel";
import { Logo, LogoMark } from "../components/Logo";
import { LegalLinks } from "../components/LegalLinks";
import { models } from "../data/site";
import { streamAssistant, titleForConversation, type ChatMessage } from "../lib/chat";
import { estimateTokens, useSettings } from "../lib/settings";
import { cn } from "../lib/cn";
import { initialsFor, providerLabel, useAuth } from "../lib/auth";

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const CHATS_KEY = "harness-conversations-v1";

const suggestions = [
  "Debug a flaky test that only fails in CI",
  "Refactor auth to rotate refresh tokens safely",
  "Add rate limiting to an API route",
  "Write a Postgres migration for soft deletes",
];

const quickTools = [
  { key: "web" as const, label: "Web", icon: Globe },
  { key: "code" as const, label: "Code", icon: Terminal },
  { key: "files" as const, label: "Files", icon: FileText },
  { key: "browser" as const, label: "Browser", icon: Compass },
];

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function emptyConversation(): Conversation {
  return { id: uid(), title: "New conversation", messages: [], updatedAt: Date.now() };
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Conversation[];
      if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].messages)) {
        return parsed;
      }
    }
  } catch {
    /* ignore corrupted storage */
  }
  return [emptyConversation()];
}

function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function Console() {
  const { settings, update, setTool, logRequest } = useSettings();
  const { user, signOut } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<{ convId: string; messageId: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cancelledRef = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Console — Harness Studio";
  }, []);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? conversations[0] ?? null;

  useEffect(() => {
    if (!conversations.some((conversation) => conversation.id === activeId)) {
      setActiveId(conversations[0]?.id ?? "");
    }
  }, [conversations, activeId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(CHATS_KEY, JSON.stringify(conversations));
      } catch {
        /* storage quota — ignore */
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [conversations]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  const lastMessage = activeConversation?.messages[activeConversation.messages.length - 1];

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [
    activeConversation?.id,
    activeConversation?.messages.length,
    lastMessage?.content,
    lastMessage?.thinking?.length,
    lastMessage?.toolCalls?.length,
    streaming?.messageId,
  ]);

  function patchMessage(convId: string, messageId: string, patch: (message: ChatMessage) => ChatMessage) {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id !== convId
          ? conversation
          : {
              ...conversation,
              updatedAt: Date.now(),
              messages: conversation.messages.map((message) =>
                message.id === messageId ? patch(message) : message
              ),
            }
      )
    );
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || streaming) return;

    const conv = activeConversation ?? emptyConversation();
    if (!activeConversation) {
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
    }

    const history = conv.messages;
    const userMessage: ChatMessage = { id: uid(), role: "user", content: text };
    const assistantId = uid();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      model: settings.model,
      thinking: [],
      toolCalls: [],
    };

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id !== conv.id
          ? conversation
          : {
              ...conversation,
              title:
                conversation.messages.length === 0
                  ? titleForConversation(text)
                  : conversation.title,
              messages: [...conversation.messages, userMessage, assistantMessage],
              updatedAt: Date.now(),
            }
      )
    );

    setStreaming({ convId: conv.id, messageId: assistantId });
    cancelledRef.current = false;
    const snapshot = settings;

    try {
      for await (const event of streamAssistant({
        prompt: text,
        settings: snapshot,
        history,
        isCancelled: () => cancelledRef.current,
      })) {
        if (event.type === "thinking") {
          patchMessage(conv.id, assistantId, (message) => ({
            ...message,
            thinking: [...(message.thinking ?? []), event.text],
          }));
        } else if (event.type === "tool") {
          patchMessage(conv.id, assistantId, (message) => ({
            ...message,
            toolCalls: [...(message.toolCalls ?? []), event.call],
          }));
        } else if (event.type === "tool_result") {
          patchMessage(conv.id, assistantId, (message) => ({
            ...message,
            toolCalls: (message.toolCalls ?? []).map((call) =>
              call.id === event.id
                ? { ...call, status: "done" as const, result: event.result, durationMs: event.durationMs }
                : call
            ),
          }));
        } else if (event.type === "token") {
          patchMessage(conv.id, assistantId, (message) => ({
            ...message,
            content: message.content + event.text,
          }));
        } else if (event.type === "done") {
          patchMessage(conv.id, assistantId, (message) => ({
            ...message,
            usage: event.usage,
            latencyMs: event.latencyMs,
          }));
          if (snapshot.logRequests) {
            logRequest({
              endpoint: "/v1/chat/completions",
              model: snapshot.model,
              status: 200,
              latency: event.latencyMs,
              ttft: event.ttftMs,
              tokensIn: event.usage.in,
              tokensOut: event.usage.out,
              stream: snapshot.stream,
            });
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      patchMessage(conv.id, assistantId, (current) => ({
        ...current,
        error: true,
        content: `${current.content}\n\n**Request failed.** \`${message}\``,
      }));
      if (snapshot.logRequests) {
        logRequest({
          endpoint: "/v1/chat/completions",
          model: snapshot.model,
          status: 500,
          latency: 0,
          ttft: 0,
          tokensIn: estimateTokens(text),
          tokensOut: 0,
          stream: snapshot.stream,
        });
      }
    } finally {
      if (cancelledRef.current) {
        patchMessage(conv.id, assistantId, (current) => ({ ...current, stopped: true }));
      }
      setStreaming((prev) => (prev?.messageId === assistantId ? null : prev));
      cancelledRef.current = false;
    }
  }

  function submit() {
    if (!input.trim() || streaming) return;
    const text = input;
    setInput("");
    void send(text);
  }

  function createConversation() {
    const conversation = emptyConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setSidebarOpen(false);
    setQuery("");
    window.setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function deleteConversation(id: string) {
    const remaining = conversations.filter((conversation) => conversation.id !== id);
    if (remaining.length === 0) {
      const conversation = emptyConversation();
      setConversations([conversation]);
      setActiveId(conversation.id);
      return;
    }
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  }

  const tokensUsed = settings.logs.reduce((sum, log) => sum + log.tokensIn + log.tokensOut, 0);
  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(query.trim().toLowerCase())
  );
  const isStreaming = streaming !== null;
  const providerConnected = Boolean(settings.provider?.baseUrl && settings.provider?.apiKey);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f8fb] text-slate-800">
      {/* sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] shrink-0 flex-col border-r border-slate-200 bg-[#fbfcfe] transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-3.5">
          <Link to="/" aria-label="Harness Studio home">
            <Logo markClassName="h-7 w-7" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-slate-500 hover:text-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-2.5">
          <button
            type="button"
            onClick={createConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-[11.5px] font-medium text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" />
            New chat
          </button>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              className="field pl-7 text-[11px]"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="px-2 pb-1 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Recent
          </div>
          <div className="space-y-0.5">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-1 transition",
                  conversation.id === activeId ? "bg-slate-100" : "hover:bg-slate-50"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.id);
                    setSidebarOpen(false);
                  }}
                  className="min-w-0 flex-1 px-1.5 py-2 text-left"
                >
                  <div
                    className={cn(
                      "truncate text-[11.5px]",
                      conversation.id === activeId ? "text-slate-900" : "text-slate-600"
                    )}
                  >
                    {conversation.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-slate-400">
                    <span>{formatRelative(conversation.updatedAt)}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                    <span>{conversation.messages.length} msg</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteConversation(conversation.id)}
                  className="mr-1 rounded p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-rose-600 group-hover:opacity-100"
                  aria-label={`Delete ${conversation.title}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {filteredConversations.length === 0 && (
              <p className="px-2 py-4 text-[10.5px] text-slate-400">No conversations match.</p>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 p-2.5">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="flex items-center justify-between text-[9.5px]">
              <span className="text-slate-500">Tokens this month</span>
              <span className="font-mono text-slate-600">{tokensUsed.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-slate-100">
              <div
                className="h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                style={{ width: `${Math.min(100, Math.max(2, (tokensUsed / 5_000_000) * 100))}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="mt-2 text-[9.5px] text-violet-700 hover:text-violet-700"
            >
              Manage keys &amp; limits →
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg px-1 py-1">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold text-slate-700",
                user
                  ? "bg-gradient-to-br from-sky-500/30 to-violet-500/30"
                  : "border border-slate-200 bg-slate-50"
              )}
            >
              {user ? initialsFor(user.name) : "GS"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10.5px] text-slate-700">
                {user ? user.name : "Guest workspace"}
              </div>
              <div className="truncate text-[9px] text-slate-400">
                {user ? `${providerLabel(user.provider)} · preview session` : "Not signed in"}
              </div>
            </div>
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="rounded p-1 text-slate-400 hover:text-slate-700"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-3 w-3" />
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded p-1 text-slate-400 hover:text-slate-700"
                aria-label="Sign in"
                title="Sign in"
              >
                <LogIn className="h-3 w-3" />
              </Link>
            )}
            <Link
              to="/"
              className="rounded p-1 text-slate-400 hover:text-slate-700"
              aria-label="Back to website"
              title="Back to website"
            >
              <ArrowLeft className="h-3 w-3" />
            </Link>
          </div>
          <LegalLinks className="px-1 pt-0.5" />
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-3 backdrop-blur">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md border border-slate-200 p-1.5 text-slate-600 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden text-[11.5px] font-medium text-slate-700 sm:block">Harness Code</span>
            <span className="hidden h-3.5 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-1.5">
              <select
                value={settings.model}
                onChange={(event) => update({ model: event.target.value })}
                aria-label="Active model"
                className="field h-8 py-0 pr-7 text-[10.5px] font-medium text-slate-700"
                style={{ width: "auto" }}
              >
                {models
                  .filter((model) => model.id !== "harness-embed-1")
                  .map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
              </select>
            </div>
            <span
              className={cn(
                "hidden items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] sm:flex",
                settings.environment === "sandbox"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              )}
            >
              <span className="h-1 w-1 rounded-full bg-current" />
              {settings.environment}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-2 py-0.5 text-[9px] text-slate-500 md:flex">
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  providerConnected ? "bg-emerald-400" : "bg-violet-400"
                )}
              />
              {providerConnected ? "live provider" : "demo engine"}
            </span>
            <Link
              to="/docs"
              className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[10.5px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:flex"
            >
              <BookOpen className="h-3 w-3" />
              Docs
            </Link>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <Link
              to="/"
              className="hidden rounded-lg p-1.5 text-slate-500 hover:text-slate-800 sm:block"
              aria-label="Back to website"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <div ref={threadRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6">
            {!activeConversation || activeConversation.messages.length === 0 ? (
              <div className="my-auto py-10">
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <LogoMark className="h-7 w-7" />
                  </div>
                  <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                    What are we shipping today?
                  </h1>
                  <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-slate-500">
                    Harness Code reads, runs and edits. Ask for a fix, a plan or a review — then tune
                    the request in Settings.
                  </p>
                  <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9.5px] text-slate-500">
                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                    {providerConnected ? "connected to your provider" : "local demo engine · no key needed"}
                  </div>
                </div>

                <div className="mx-auto mt-8 grid max-w-xl gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:text-violet-700">
                          <span className="text-[8px]">↗</span>
                        </span>
                        <span className="text-[11.5px] leading-relaxed text-slate-600 group-hover:text-slate-800">
                          {suggestion}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {activeConversation.messages.map((message) => (
                  <ChatMessageView
                    key={message.id}
                    message={message}
                    streaming={streaming?.messageId === message.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-[#f7f8fb]">
          <div className="mx-auto w-full max-w-3xl px-4 py-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_-10px_40px_-30px_rgba(15,23,42,0.15)] transition focus-within:border-violet-300 focus-within:shadow-[0_8px_30px_-20px_rgba(15,23,42,0.25)]">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask Harness Code to build, debug or explain…"
                className="max-h-[180px] w-full resize-none bg-transparent px-0.5 py-0.5 text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Message Harness Code"
              />

              <div className="mt-2 flex items-center gap-1">
                {quickTools.map((tool) => (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => setTool(tool.key, !settings.tools[tool.key])}
                    title={`${settings.tools[tool.key] ? "Disable" : "Enable"} ${tool.label}`}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-1.5 py-1 text-[9.5px] transition",
                      settings.tools[tool.key]
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-transparent text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <tool.icon className="h-2.5 w-2.5" />
                    {tool.label}
                  </button>
                ))}

                <span className="ml-auto hidden font-mono text-[9px] text-slate-400 sm:block">
                  {estimateTokens(input).toLocaleString()} tok
                </span>

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={() => {
                      cancelledRef.current = true;
                    }}
                    className="ml-1 flex h-7 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2 text-[10px] text-slate-700 hover:bg-slate-200"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!input.trim()}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-white transition hover:brightness-110 disabled:opacity-30"
                    aria-label="Send message"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 px-1 text-[9px] text-slate-400">
              <span>
                Enter to send · Shift+Enter for a new line
                {!providerConnected && " · responses are simulated locally"}
              </span>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="text-slate-500 hover:text-slate-700"
              >
                {models.find((model) => model.id === settings.model)?.name ?? settings.model} ·{" "}
                {settings.maxTokens.toLocaleString()} max tokens
              </button>
            </div>
          </div>
        </div>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
