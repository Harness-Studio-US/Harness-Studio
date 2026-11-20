import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronUp,
  Code,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { ChatMessageView } from "../components/console/ChatMessageView";
import { CodeWorkspace } from "../components/console/CodeWorkspace";
import { FirstRunGuide, LegalConsent } from "../components/console/CopilotOnboarding";
import { CopilotAuthLoading, CopilotLogin } from "../components/console/CopilotLogin";
import { SettingsPanel } from "../components/console/SettingsPanel";
import { VerifyEmail } from "../components/console/VerifyEmail";
import { Logo, LogoMark } from "../components/Logo";
import { streamAssistant, titleForConversation, type ChatMessage } from "../lib/chat";
import { streamCodeAssistant } from "../lib/codeChat";
import { applyReplyToProject, replayConversation, type ProjectFile } from "../lib/codeFiles";
import {
  acceptCopilotTerms,
  hasAcceptedCopilotTerms,
  hasSeenCopilotGuide,
  markCopilotGuideSeen,
} from "../lib/copilotState";
import { auth } from "../lib/firebase";
import { cn } from "../lib/cn";

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

const chatsKey = (userId: string) => `harness-copilot-conversations-v1:${userId}`;
const codeChatKey = (userId: string) => `harness-code-chat-v1:${userId}`;
const codeProjectKey = (userId: string) => `harness-code-project-v1:${userId}`;

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

function loadConversations(userId: string): Conversation[] {
  try {
    const raw = localStorage.getItem(chatsKey(userId));
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

function loadCodeMessages(userId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(codeChatKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore corrupted storage */
  }
  return [];
}

function loadCodeProject(userId: string): ProjectFile[] {
  try {
    const raw = localStorage.getItem(codeProjectKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as ProjectFile[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore corrupted storage */
  }
  return [];
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
  const [authReady, setAuthReady] = useState(!auth);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [verifiedNow, setVerifiedNow] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsReady, setTermsReady] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatsReady, setChatsReady] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState<{ convId: string; messageId: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [view, setView] = useState<"copilot" | "code">("copilot");
  const [codeMessages, setCodeMessages] = useState<ChatMessage[]>([]);
  const [codeProject, setCodeProject] = useState<ProjectFile[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [codeStreamingId, setCodeStreamingId] = useState<string | null>(null);
  const [codeUndo, setCodeUndo] = useState<ChatMessage[] | null>(null);
  const [query, setQuery] = useState("");
  const cancelledRef = useRef(false);
  const codeCancelledRef = useRef(false);
  const codeUndoTimer = useRef<number | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = !authReady
      ? "Harness Copilot"
      : !firebaseUser
        ? "Sign in — Harness Copilot"
        : view === "code"
          ? "Harness Code — coding chat"
          : "Harness Copilot — AI workspace";
  }, [authReady, firebaseUser, view]);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setFirebaseUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setConversations([]);
      setChatsReady(false);
      setVerifiedNow(false);
      setAcceptedTerms(false);
      setTermsReady(false);
      setActiveId("");
      setCodeMessages([]);
      setCodeProject([]);
      setCodeStreamingId(null);
      return;
    }
    setConversations(loadConversations(firebaseUser.uid));
    const replayed = replayConversation(loadCodeMessages(firebaseUser.uid));
    setCodeMessages(replayed.messages);
    const storedProject = loadCodeProject(firebaseUser.uid);
    setCodeProject(storedProject.length > 0 ? storedProject : replayed.project);
    setActiveId("");
    setChatsReady(true);
    setAcceptedTerms(hasAcceptedCopilotTerms(firebaseUser.uid));
    setTermsReady(true);
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (!acceptedTerms || !firebaseUser) {
      setGuideOpen(false);
      return;
    }
    if (hasSeenCopilotGuide()) return;
    const timer = window.setTimeout(() => setGuideOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [acceptedTerms, firebaseUser]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? conversations[0] ?? null;

  useEffect(() => {
    if (!conversations.some((conversation) => conversation.id === activeId)) {
      setActiveId(conversations[0]?.id ?? "");
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (!firebaseUser || !chatsReady) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(chatsKey(firebaseUser.uid), JSON.stringify(conversations));
      } catch {
        /* storage quota — ignore */
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [conversations, firebaseUser, chatsReady]);

  useEffect(() => {
    if (!firebaseUser || !chatsReady) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(codeChatKey(firebaseUser.uid), JSON.stringify(codeMessages));
      } catch {
        /* storage quota — ignore */
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [codeMessages, firebaseUser, chatsReady]);

  useEffect(() => {
    if (!firebaseUser || !chatsReady) return;
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(codeProjectKey(firebaseUser.uid), JSON.stringify(codeProject));
      } catch {
        /* storage quota — ignore */
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [codeProject, firebaseUser, chatsReady]);

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

    try {
      for await (const event of streamAssistant({
        prompt: text,
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
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      patchMessage(conv.id, assistantId, (current) => ({
        ...current,
        error: true,
        content: `${current.content}\n\n**Request failed.** \`${message}\``,
      }));
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

  function patchCodeMessage(id: string, patch: (message: ChatMessage) => ChatMessage) {
    setCodeMessages((prev) =>
      prev.map((message) => (message.id === id ? patch(message) : message))
    );
  }

  async function sendCode(raw: string) {
    const text = raw.trim();
    if (!text || codeStreamingId) return;

    const history = codeMessages;
    const userMessage: ChatMessage = { id: uid(), role: "user", content: text };
    const assistantId = uid();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      thinking: [],
      toolCalls: [],
    };

    setCodeMessages((prev) => [...prev, userMessage, assistantMessage]);
    setCodeInput("");
    setCodeStreamingId(assistantId);
    codeCancelledRef.current = false;
    let reply = "";

    try {
      for await (const event of streamCodeAssistant({
        prompt: text,
        history,
        isCancelled: () => codeCancelledRef.current,
      })) {
        if (event.type === "thinking") {
          patchCodeMessage(assistantId, (message) => ({
            ...message,
            thinking: [...(message.thinking ?? []), event.text],
          }));
        } else if (event.type === "tool") {
          patchCodeMessage(assistantId, (message) => ({
            ...message,
            toolCalls: [...(message.toolCalls ?? []), event.call],
          }));
        } else if (event.type === "tool_result") {
          patchCodeMessage(assistantId, (message) => ({
            ...message,
            toolCalls: (message.toolCalls ?? []).map((call) =>
              call.id === event.id
                ? { ...call, status: "done" as const, result: event.result, durationMs: event.durationMs }
                : call
            ),
          }));
        } else if (event.type === "token") {
          reply += event.text;
          patchCodeMessage(assistantId, (message) => ({
            ...message,
            content: message.content + event.text,
          }));
        } else if (event.type === "done") {
          patchCodeMessage(assistantId, (message) => ({
            ...message,
            usage: event.usage,
            latencyMs: event.latencyMs,
          }));
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      patchCodeMessage(assistantId, (current) => ({
        ...current,
        error: true,
        content: `${current.content}\n\n**Request failed.** \`${message}\``,
      }));
    } finally {
      if (codeCancelledRef.current) {
        patchCodeMessage(assistantId, (current) => ({ ...current, stopped: true }));
      } else if (reply.trim()) {
        // The reply's code blocks become files in the project.
        const applied = applyReplyToProject(codeProject, {
          id: assistantId,
          role: "assistant",
          content: reply,
        });
        if (applied.edits.length > 0) {
          setCodeProject(applied.project);
          patchCodeMessage(assistantId, (current) => ({ ...current, edits: applied.edits }));
        }
      }
      setCodeStreamingId((prev) => (prev === assistantId ? null : prev));
      codeCancelledRef.current = false;
    }
  }

  function startCodeChat() {
    if (codeMessages.length === 0) return;
    codeCancelledRef.current = true;
    setCodeStreamingId(null);
    setCodeInput("");
    // Keep the cleared thread so a single click can be taken back.
    setCodeUndo(codeMessages);
    setCodeMessages([]);
    if (codeUndoTimer.current) window.clearTimeout(codeUndoTimer.current);
    codeUndoTimer.current = window.setTimeout(() => setCodeUndo(null), 15000);
  }

  function undoCodeChat() {
    const restore = codeUndo;
    if (!restore) return;
    if (codeUndoTimer.current) window.clearTimeout(codeUndoTimer.current);
    setCodeUndo(null);
    setCodeMessages((current) => (current.length === 0 ? restore : current));
  }

  function createConversation() {
    const conversation = emptyConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setSidebarOpen(false);
    setQuery("");
    setView("copilot");
    window.setTimeout(() => textareaRef.current?.focus(), 50);
  }

  function openCopilot() {
    setView("copilot");
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
    if (firebaseUser) acceptCopilotTerms(firebaseUser.uid);
    setAcceptedTerms(true);
  }

  function dismissGuide() {
    markCopilotGuideSeen();
    setGuideOpen(false);
  }

  function signOutUser() {
    cancelledRef.current = true;
    codeCancelledRef.current = true;
    setStreaming(null);
    setCodeStreamingId(null);
    setCodeMessages([]);
    setCodeProject([]);
    setCodeUndo(null);
    setSidebarOpen(false);
    setSettingsOpen(false);
    setGuideOpen(false);
    if (auth) void firebaseSignOut(auth);
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.messages.length > 0 &&
      conversation.title.toLowerCase().includes(query.trim().toLowerCase())
  );
  const lastCodePrompt = [...codeMessages].reverse().find((message) => message.role === "user");
  const codeChatTitle = lastCodePrompt ? titleForConversation(lastCodePrompt.content) : "Code chat";
  const isStreaming = streaming !== null;
  const userEmail = firebaseUser?.email ?? "Signed in";
  const userInitial = (firebaseUser?.displayName?.trim().charAt(0) || userEmail.charAt(0)).toUpperCase();

  if (!authReady) {
    return <CopilotAuthLoading />;
  }

  if (!firebaseUser) {
    return <CopilotLogin />;
  }

  if (!firebaseUser.emailVerified && !verifiedNow) {
    return (
      <VerifyEmail
        user={firebaseUser}
        onVerified={() => setVerifiedNow(true)}
        onSignOut={signOutUser}
      />
    );
  }

  if (!termsReady) {
    return <CopilotAuthLoading />;
  }

  if (!acceptedTerms) {
    return (
      <LegalConsent onAccept={acceptTerms} email={userEmail} onSignOut={signOutUser} />
    );
  }

  if (!chatsReady) {
    return <CopilotAuthLoading />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface text-ink">
      {/* sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="anim-fade-in fixed inset-0 z-30 bg-[#0F172A]/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-slate-200 bg-[#fbfcfe] text-slate-800 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link to="/" aria-label="Harness Studio home">
            <Logo markClassName="h-7 w-7" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={createConversation}
            className="press flex h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" />
            New chat
          </button>
          <div className="relative mt-2.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              className="field h-9 pl-8 text-[12px]"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5 pb-2">
          <div className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Recent
          </div>
          <div className="space-y-0.5">
            {codeMessages.length > 0 && (
              <div
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-1 transition",
                  view === "code" ? "bg-slate-100" : "hover:bg-slate-50"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setView("code");
                    setSidebarOpen(false);
                  }}
                  className="min-w-0 flex-1 px-2 py-2.5 text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <Code className="h-3 w-3 shrink-0 text-violet-600" />
                    <span
                      className={cn(
                        "truncate text-[12px]",
                        view === "code" ? "text-slate-900" : "text-slate-700"
                      )}
                    >
                      {codeChatTitle}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 pl-[18px] text-[10px] text-slate-600">
                    <span>Code</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400" />
                    <span>{codeMessages.length} msg</span>
                  </div>
                </button>
              </div>
            )}
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
                    setView("copilot");
                    setSidebarOpen(false);
                  }}
                  className="min-w-0 flex-1 px-2 py-2.5 text-left"
                >
                  <div
                    className={cn(
                      "truncate text-[12px]",
                      conversation.id === activeId ? "text-slate-900" : "text-slate-700"
                    )}
                  >
                    {conversation.title}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span>{formatRelative(conversation.updatedAt)}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-400" />
                    <span>{conversation.messages.length} msg</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteConversation(conversation.id)}
                  className="mr-1 rounded p-1 text-slate-500 opacity-0 transition hover:bg-slate-100 hover:text-rose-700 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Delete ${conversation.title}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {filteredConversations.length === 0 && codeMessages.length === 0 && (
              query.trim() ? (
                <p className="px-2 py-4 text-[11.5px] text-slate-500">No conversations match.</p>
              ) : (
                <div className="mt-2 rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center">
                  <MessageSquare className="mx-auto h-4 w-4 text-slate-400" />
                  <p className="mt-2 text-[11.5px] font-medium text-slate-700">No chats yet</p>
                  <p className="mt-1 text-[10.5px] leading-[1.6] text-slate-500">
                    Copilot conversations and your code chat appear here.
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 p-2.5">
          {accountOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} aria-hidden />
          )}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((value) => !value)}
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              title="Account, terms and settings"
                              className="press relative z-20 flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 text-left transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-[10px] font-semibold text-violet-700">
                {userInitial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium text-slate-800">
                  {userEmail}
                </span>
                <span className="block text-[9.5px] text-slate-500">
                  Account · terms · settings
                </span>
              </span>
              <ChevronUp
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-slate-400 transition",
                  accountOpen && "rotate-180 text-slate-700"
                )}
              />
            </button>

            {accountOpen && (
              <div
                role="menu"
                aria-label="Account"
                className="anim-pop absolute bottom-full left-0 right-0 z-30 mb-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.4)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11.5px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </button>
                <Link
                  role="menuitem"
                  to="/terms"
                  onClick={() => setAccountOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[11.5px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Terms &amp; Conditions
                </Link>
                <Link
                  role="menuitem"
                  to="/privacy"
                  onClick={() => setAccountOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[11.5px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  Privacy Policy
                </Link>
                <Link
                  role="menuitem"
                  to="/"
                  onClick={() => setAccountOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[11.5px] text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                  Back to website
                </Link>
                <div className="my-1 h-px bg-slate-100" aria-hidden />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    void signOutUser();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[11.5px] text-slate-700 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="anim-fade-in flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md border border-slate-200 p-1.5 text-slate-600 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <span className="truncate text-[13.5px] font-semibold text-slate-900">
              {view === "code" ? "Harness Code" : "Harness Copilot"}
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Workspace view"
            className="flex shrink-0 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100/80 p-0.5"
          >
            {([
              { value: "copilot" as const, label: "Copilot", icon: Sparkles },
              { value: "code" as const, label: "Code", icon: Code },
            ]).map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={view === value}
                aria-label={`${label} view`}
                title={`${label} view`}
                onClick={() => setView(value)}
                className={cn(
                  "press flex h-7 items-center gap-1.5 rounded-md px-2 text-[11.5px] font-medium transition",
                  view === value
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="press flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Settings
            </button>
            <Link
              to="/docs"
              className="hidden items-center gap-1.5 rounded-md px-2.5 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:flex"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Guide
            </Link>
            <Link
              to="/"
              className="hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:block"
              aria-label="Back to website"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {view === "code" && (
          <CodeWorkspace
            messages={codeMessages}
            project={codeProject}
            streamingId={codeStreamingId}
            input={codeInput}
            onInputChange={setCodeInput}
            onSend={(text) => void sendCode(text)}
            onStop={() => {
              codeCancelledRef.current = true;
            }}
            onNewChat={startCodeChat}
            canUndo={codeUndo !== null}
            onUndo={undoCodeChat}
            onBackToCopilot={openCopilot}
          />
        )}

        <div
          ref={threadRef}
          className={cn("flex-1 overflow-y-auto", view === "code" && "hidden")}
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6">
            {!activeConversation || activeConversation.messages.length === 0 ? (
              <div className="animate-rise my-auto py-10">
                <div className="mx-auto max-w-xl text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-[#fbfcfe]">
                    <LogoMark className="h-8 w-8" />
                  </div>
                  <span className="eyebrow eyebrow--plain">New conversation</span>
                  <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-slate-900 sm:text-[42px]">
                    What would you like to build?
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-[1.7] text-slate-600">
                    Describe a change in your own words. Harness Copilot will talk it through and
                    help you decide what to do next.
                  </p>
                </div>

                <div className="mx-auto mt-9 grid max-w-xl gap-2.5 sm:grid-cols-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      style={{ animationDelay: `${120 + index * 65}ms` }}
                      className="stream-in group rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-violet-300 hover:bg-violet-50/50"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:border-violet-200 group-hover:text-violet-700">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                        <span className="text-[13px] leading-[1.6] text-slate-700 transition group-hover:text-slate-900">
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

        <div
          className={cn(
            "shrink-0 border-t border-slate-200 bg-[#fbfcfe]",
            view === "code" && "hidden"
          )}
        >
          <div className="mx-auto w-full max-w-3xl px-4 py-3.5">
            <div className="rounded-xl border border-slate-300 bg-white px-3.5 py-3 shadow-[0_-8px_30px_-26px_rgba(15,23,42,0.2)] transition focus-within:border-violet-400 focus-within:shadow-[0_8px_30px_-22px_rgba(15,23,42,0.28)]">
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
                placeholder="Ask Copilot to change, fix or explain something…"
                className="composer-input max-h-[180px] w-full resize-none overflow-hidden bg-transparent px-0.5 py-0.5 text-[14px] leading-[1.7] text-slate-800 outline-none placeholder:text-slate-500"
                aria-label="Message Harness Copilot"
              />

              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="mr-auto hidden text-[11px] text-slate-600 sm:block">
                  No special commands needed.
                </span>
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={() => {
                      cancelledRef.current = true;
                    }}
                    className="ml-1 flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-sky-600 to-violet-700 text-white transition hover:brightness-110 disabled:opacity-30"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 px-1 text-[10.5px] text-slate-600">
              <span>Enter to send · Shift+Enter for a new line</span>
            </div>
          </div>
        </div>
      </div>

      <FirstRunGuide open={guideOpen} onClose={dismissGuide} />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={firebaseUser}
        onUserChanged={() => setFirebaseUser(auth?.currentUser ?? firebaseUser)}
      />
    </div>
  );
}
