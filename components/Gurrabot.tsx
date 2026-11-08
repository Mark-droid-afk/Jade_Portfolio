"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon, SparkleIcon, ThumbIcon } from "./Icons";

type Msg = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  local?: boolean; // shown in the chat but never sent to the AI
  chatId?: string;
  rating?: 1 | -1;
};

const GREETING =
  "Hi, I’m Gurrabot, Mark’s AI assistant. Ask me about his projects, skills, or background.";
const SUGGESTIONS = [
  "What has Mark built?",
  "What’s his tech stack?",
  "Tell me about Votera",
  "How can I contact him?",
];
const STORE = "gurrabot:msgs";
const SID = "gurrabot:sid";

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

function loadMessages(): Msg[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content && !m.error)
      .slice(-20);
  } catch {
    return [];
  }
}

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SID);
    if (!id) {
      id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      localStorage.setItem(SID, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export default function Gurrabot({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  const [view, setView] = useState<"chat" | "message">("chat");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore the visitor's last conversation.
  useEffect(() => {
    setMessages(loadMessages());
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(messages.filter((m) => m.content && !m.error).slice(-20)));
    } catch {
      /* private mode */
    }
  }, [messages]);

  // The greeting types itself in the first time the chat is opened.
  useEffect(() => {
    if (!active) return;
    const f = setTimeout(() => isDesktop() && view === "chat" && inputRef.current?.focus(), 60);
    if (!started.current) {
      started.current = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTyped(GREETING);
      } else {
        let i = 0;
        timer.current = setInterval(() => {
          i += 1;
          setTyped(GREETING.slice(0, i));
          if (i >= GREETING.length && timer.current) clearInterval(timer.current);
        }, 22);
      }
    }
    return () => clearTimeout(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typed, view]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const history = [...messages.filter((m) => !m.error && !m.local && m.content), { role: "user" as const, content }];
    setMessages([...messages, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Gurrabot is unavailable right now.");
      }
      const chatId = res.headers.get("X-Chat-Id") ?? undefined;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc, chatId }]);
      }
      if (!acc.trim()) throw new Error("Gurrabot sent an empty reply. Please try again.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: msg, error: true }]);
    } finally {
      setBusy(false);
      if (isDesktop()) inputRef.current?.focus();
    }
  }

  function rate(index: number, rating: 1 | -1) {
    const m = messages[index];
    if (!m?.chatId || m.rating) return;
    setMessages((all) => all.map((x, i) => (i === index ? { ...x, rating } : x)));
    void fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: m.chatId, rating }),
    }).catch(() => {});
  }

  function newChat() {
    setMessages([]);
    try {
      localStorage.removeItem(STORE);
    } catch {
      /* ignore */
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const greetingDone = typed.length >= GREETING.length;

  return (
    <div className="flex h-full min-h-0 flex-col text-white">
      <header className="flex items-center gap-3 border-b border-white/10 bg-abyss px-5 py-4">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-abyss">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold leading-tight">Gurrabot</h2>
          <p className="text-xs text-white/70">AI assistant. Answers from Mark’s profile.</p>
        </div>
        {view === "chat" && messages.length > 0 && (
          <button type="button" onClick={newChat} disabled={busy} className="text-xs font-medium text-white/70 hover:text-mint disabled:opacity-50">
            New chat
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      {view === "message" ? (
        <LeaveMessage
          onBack={() => setView("chat")}
          onSent={() => {
            setMessages((m) => [...m, { role: "assistant", content: "Thanks! Your message was sent to Mark.", local: true }]);
            setView("chat");
          }}
        />
      ) : (
        <>
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4 text-[15px] leading-relaxed"
          >
            {typed && <Bubble role="assistant">{typed}</Bubble>}
            {messages.map((m, i) => (
              <div key={i}>
                <Bubble role={m.role} error={m.error}>
                  {m.content || <Dots />}
                </Bubble>
                {m.role === "assistant" && m.chatId && m.content && !busy && (
                  <div className="mt-1.5 flex items-center gap-1 pl-1 text-white/50">
                    <button
                      type="button"
                      onClick={() => rate(i, 1)}
                      aria-label="Good answer"
                      aria-pressed={m.rating === 1}
                      disabled={!!m.rating}
                      className={`grid h-7 w-7 place-items-center rounded-full hover:bg-white/10 ${m.rating === 1 ? "text-mint" : ""}`}
                    >
                      <ThumbIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rate(i, -1)}
                      aria-label="Bad answer"
                      aria-pressed={m.rating === -1}
                      disabled={!!m.rating}
                      className={`grid h-7 w-7 place-items-center rounded-full hover:bg-white/10 ${m.rating === -1 ? "text-[#FF9C8B]" : ""}`}
                    >
                      <ThumbIcon className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {messages.length === 0 && greetingDone && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-mint/40 px-3 py-1.5 text-sm font-medium text-mint transition-colors hover:bg-mint/10"
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setView("message")}
                className="rounded-full bg-mint px-3 py-1.5 text-sm font-bold text-abyss"
              >
                Leave a message
              </button>
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t border-white/10 bg-abyss p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              disabled={busy}
              aria-label="Message Gurrabot"
              placeholder="Ask about Mark…"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-base text-white placeholder:text-white/60 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-abyss transition-opacity disabled:opacity-40"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function LeaveMessage({ onBack, onSent }: { onBack: () => void; onSent: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const shownAt = useRef(Date.now());
  const input = "mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/50";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.get("name"),
          email: d.get("email"),
          message: d.get("message"),
          website: d.get("website"),
          source: "gurrabot",
          t: shownAt.current,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) throw new Error(json.error ?? "Your message couldn’t be sent.");
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message couldn’t be sent.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
      <p className="text-sm text-white/80">Leave a message for Mark and he’ll get back to you.</p>
      <label className="block text-sm font-semibold">
        Name
        <input name="name" required maxLength={100} autoComplete="name" className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input name="email" type="email" required maxLength={150} autoComplete="email" className={input} />
      </label>
      <label className="block text-sm font-semibold">
        Message
        <textarea name="message" required minLength={3} maxLength={2000} rows={4} className={input} />
      </label>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && <p role="alert" className="text-sm text-[#FF9C8B]">{error}</p>}
      <div className="flex gap-2 pb-2">
        <button type="submit" disabled={busy} className="rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-abyss disabled:opacity-60">
          {busy ? "Sending…" : "Send"}
        </button>
        <button type="button" onClick={onBack} className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold">
          Back to chat
        </button>
      </div>
    </form>
  );
}

function Bubble({
  role,
  error,
  children,
}: {
  role: "user" | "assistant";
  error?: boolean;
  children: React.ReactNode;
}) {
  const base = "max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5";
  if (role === "user") return <div className={`pop-in ${base} ml-auto rounded-br-md bg-mint text-abyss`}>{children}</div>;
  return (
    <div className={`pop-in ${base} rounded-bl-md ${error ? "border border-[#FF9C8B]/60 text-[#FF9C8B]" : "bg-forest text-white"}`}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <span aria-label="Gurrabot is typing" className="inline-flex gap-1">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
