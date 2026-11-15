import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Menu,
  Plus,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { ChatMessageView } from "../components/console/ChatMessageView";
import { FirstRunGuide, LegalConsent } from "../components/console/CopilotOnboarding";
import { Logo, LogoMark } from "../components/Logo";
import { LegalLinks } from "../components/LegalLinks";
import { streamAssistant, titleForConversation, type ChatMessage } from "../lib/chat";
import { estimateTokens, useSettings } from "../lib/settings";
import {
  acceptCopilotTerms,
  hasAcceptedCopilotTerms,
  hasSeenCopilotGuide,
  markCopilotGuideSeen,
} from "../lib/copilotState";
import { cn } from "../lib/cn";

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const CHATS_KEY = "harness-conversations-v1";

const suggestions = [
  "Make the dashboard easier to scan",
  "The sign-up page feels a little plain",
  "Add a settings page with a profile photo",
  "Explain what this project does",
];

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function emptyConversation(): Conversation {
  return { id: uid(), title: "New chat", messages: [], updatedAt: Date.now() };
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
  const { settings, logRequest } = useSettings();
  const [acceptedTerms, setAcceptedTerms] = useState(hasAcceptedCopilotTerms);
  const [guideOpen, setGuideOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<{ convId: string; messageId: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cancelledRef = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Harness Copilot — AI workspace";
  }, []);

  useEffect(() => {
    if (!acceptedTerms) {
      setGuideOpen(false);
      return;
    }
    if (hasSeenCopilotGuide()) return;
    const timer = window.setTimeout(() => setGuideOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [acceptedTerms]);

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

  function acceptTerms() {
    acceptCopilotTerms();
    setAcceptedTerms(true);
  }

  function dismissGuide() {
    markCopilotGuideSeen();
    setGuideOpen(false);
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(query.trim().toLowerCase())
  );
  const isStreaming = streaming !== null;

  if (!acceptedTerms) {
    return <LegalConsent onAccept={acceptTerms} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f8f6] text-slate-800">
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

        <div className="space-y-2.5 border-t border-slate-200 p-2.5">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-200 bg-violet-50">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-800">Harness Copilot</div>
                <div className="text-[9px] text-slate-400">AI workspace</div>
              </div>
              <span className="ml-auto rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-violet-700">
                Demo
              </span>
            </div>
            <p className="mt-2 text-[9.5px] leading-relaxed text-slate-400">
              The full chat experience, with simulated replies. Chats stay in this browser.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 px-1 py-0.5">
            <span className="text-[9px] text-slate-400">Private to this browser.</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded p-1 text-[9px] text-slate-400 hover:text-slate-700"
            >
              <ArrowLeft className="h-3 w-3" />
              Site
            </Link>
          </div>
          <LegalLinks className="px-1 pt-0.5" showContact={false} />
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
            <span className="text-[12px] font-semibold text-slate-800">Harness Copilot</span>
            <span className="rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-violet-700">
              Demo
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              to="/docs"
              className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[10.5px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:flex"
            >
              <BookOpen className="h-3 w-3" />
              Guide
            </Link>
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
              <div className="animate-rise my-auto py-10">
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <LogoMark className="h-7 w-7" />
                  </div>
                  <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-slate-900 sm:text-[34px]">
                    What would you like to build?
                  </h1>
                  <p className="mx-auto mt-2.5 max-w-md text-[13.5px] leading-relaxed text-slate-500">
                    Describe a change in your own words. Harness Copilot will talk it through and
                    help you decide what to do next.
                  </p>
                  <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500">
                    <Sparkles className="h-2.5 w-2.5 text-violet-600" />
                    Demo workspace · replies are simulated
                  </div>
                </div>

                <div className="mx-auto mt-8 grid max-w-xl gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      style={{ animationDelay: `${120 + index * 65}ms` }}
                      className="stream-in group rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:text-violet-700">
                          <span className="text-[8px]">↗</span>
                        </span>
                                                  <span className="text-[12.5px] leading-relaxed text-slate-600 group-hover:text-slate-800">
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
                  <div key={message.id} className="stream-in">
                    <ChatMessageView
                      message={message}
                      streaming={streaming?.messageId === message.id}
                    />
                  </div>
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
                placeholder="Ask Harness Copilot to change, fix or explain something…"
                className="max-h-[180px] w-full resize-none bg-transparent px-0.5 py-0.5 text-[13px] leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Message Harness Copilot"
              />

              <div className="mt-2 flex items-center justify-end gap-1">
                <span className="mr-auto hidden text-[9.5px] text-slate-400 sm:block">
                  No special commands needed.
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
              <span>Enter to send · Shift+Enter for a new line</span>
              <span>Harness Copilot demo · replies are simulated</span>
            </div>
          </div>
        </div>
      </div>

      <FirstRunGuide open={guideOpen} onClose={dismissGuide} />
    </div>
  );
}
