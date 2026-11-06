"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon, SparkleIcon } from "./Icons";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const GREETING =
  "Hi, I’m Gurrabot, Mark’s AI assistant. Ask me about his projects, skills, or background.";
const SUGGESTIONS = [
  "What has Mark built?",
  "What’s his tech stack?",
  "Tell me about Votera",
  "How can I contact him?",
];

const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

export default function Gurrabot({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // The greeting types itself in the first time the chat is opened.
  useEffect(() => {
    if (!active) return;
    const f = setTimeout(() => isDesktop() && inputRef.current?.focus(), 60);
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
  }, [messages, typed]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const history: Msg[] = [
      ...messages.filter((m) => !m.error && m.content),
      { role: "user", content },
    ];
    setMessages([...messages, { role: "user", content }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error ?? "Gurrabot is unavailable right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const greetingDone = typed.length >= GREETING.length;

  return (
    <div className="flex h-full min-h-0 flex-col text-white">
      <header className="flex items-center gap-3 border-b border-white/10 bg-midnight px-5 py-4">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-aqua text-midnight"
        >
          <SparkleIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold leading-tight">Gurrabot</h2>
          <p className="text-xs text-white/70">AI assistant. Answers from Mark’s profile.</p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            disabled={busy}
            className="text-xs font-medium text-white/70 hover:text-aqua disabled:opacity-50"
          >
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

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4 text-[15px] leading-relaxed"
      >
        {typed && <Bubble role="assistant">{typed}</Bubble>}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} error={m.error}>
            {m.content || <Dots />}
          </Bubble>
        ))}
      </div>

      {messages.length === 0 && greetingDone && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-aqua/40 px-3 py-1.5 text-sm font-medium text-aqua transition-colors hover:bg-aqua/10"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-white/10 bg-midnight p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-aqua text-midnight transition-opacity disabled:opacity-40"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
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
  if (role === "user") return <div className={`${base} ml-auto rounded-br-md bg-aqua text-midnight`}>{children}</div>;
  return (
    <div
      className={`${base} rounded-bl-md ${
        error ? "border border-peach/60 text-peach" : "bg-deep text-white"
      }`}
    >
      {children}
    </div>
  );
}

function Dots() {
  return (
    <span aria-label="Gurrabot is typing" className="inline-flex gap-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}
