"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Row = Record<string, unknown>;
type Data = {
  status: { database: boolean; email: boolean; groq: boolean };
  messages: Row[];
  chats: Row[];
  events: Record<string, Record<string, number>>;
  errors: Row[];
  ratings: { up: number; down: number };
};

const KEYS = ["profile", "projects", "skills", "involvement", "certifications", "testimonials", "notes", "knowledge"] as const;
const TABS = ["Messages", "Gurrabot", "Activity", "Content", "Status"] as const;
const btn = "rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-mint hover:text-mint";
const primary = "rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-abyss disabled:opacity-60";
const when = (v: unknown) => new Date(String(v)).toLocaleString();

export default function AdminApp() {
  const [phase, setPhase] = useState<"loading" | "login" | "disabled" | "in">("loading");
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Messages");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/data");
    if (res.status === 503) return setPhase("disabled");
    if (res.status === 401) return setPhase("login");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not load data.");
      return setPhase("in");
    }
    setData(json);
    setPhase("in");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
    });
    if (!res.ok) return setError((await res.json()).error ?? "Login failed.");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setData(null);
    setPhase("login");
  }

  const shell = "mx-auto min-h-dvh max-w-5xl px-5 py-10 text-white";

  if (phase === "loading") return <main className={shell}>Loading…</main>;
  if (phase === "disabled")
    return (
      <main className={shell}>
        <h1 className="font-display text-4xl">Admin is off</h1>
        <p className="mt-3 text-white/70">Set the ADMIN_PASSWORD environment variable and redeploy to turn it on.</p>
      </main>
    );
  if (phase === "login")
    return (
      <main className={shell}>
        <form onSubmit={login} className="mx-auto mt-20 max-w-sm space-y-4 rounded-3xl border border-white/10 bg-forest p-6">
          <h1 className="font-display text-3xl">Admin</h1>
          <label className="block text-sm font-semibold">
            Password
            <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base" />
          </label>
          {error && <p role="alert" className="text-sm text-[#FF9C8B]">{error}</p>}
          <button className={primary}>Sign in</button>
        </form>
      </main>
    );

  return (
    <main className={shell}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Admin</h1>
        <div className="flex gap-2">
          <a href="/home" className={btn}>View site</a>
          <button onClick={logout} className={btn}>Sign out</button>
        </div>
      </div>
      <div role="tablist" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2 text-sm font-bold ${tab === t ? "bg-mint text-abyss" : "bg-forest text-white/80"}`}>
            {t}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 text-[#FF9C8B]">{error}</p>}
      <div className="mt-8">
        {!data?.status.database && tab !== "Content" && tab !== "Status" ? (
          <p className="text-white/70">Connect Supabase (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) to collect and view this data.</p>
        ) : tab === "Messages" ? (
          <Messages rows={data!.messages} reload={load} />
        ) : tab === "Gurrabot" ? (
          <Chats rows={data!.chats} ratings={data!.ratings} />
        ) : tab === "Activity" ? (
          <Activity events={data!.events} errors={data!.errors} />
        ) : tab === "Content" ? (
          <Content />
        ) : (
          <Status data={data} />
        )}
      </div>
    </main>
  );
}

function Messages({ rows, reload }: { rows: Row[]; reload: () => Promise<void> }) {
  if (!rows.length) return <p className="text-white/70">No messages yet.</p>;
  const mark = async (id: string, read: boolean) => {
    await fetch("/api/admin/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, read }) });
    await reload();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    await reload();
  };
  return (
    <ul className="space-y-3">
      {rows.map((m) => (
        <li key={String(m.id)} className={`rounded-2xl border p-4 ${m.read ? "border-white/10 bg-forest/50" : "border-mint/50 bg-forest"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="font-bold">
              {String(m.name)} <a className="font-normal text-mint underline" href={`mailto:${String(m.email)}`}>{String(m.email)}</a>
            </p>
            <p className="text-white/60">{when(m.created_at)} · {String(m.source)}</p>
          </div>
          <p className="mt-2 whitespace-pre-wrap">{String(m.message)}</p>
          <div className="mt-3 flex gap-2">
            <button className={btn} onClick={() => mark(String(m.id), !m.read)}>{m.read ? "Mark unread" : "Mark read"}</button>
            <button className={btn} onClick={() => del(String(m.id))}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Chats({ rows, ratings }: { rows: Row[]; ratings: { up: number; down: number } }) {
  return (
    <>
      <p className="mb-4 text-white/80">Helpful: {ratings.up} · Not helpful: {ratings.down} · Showing the latest {rows.length}</p>
      {!rows.length && <p className="text-white/70">No chats yet.</p>}
      <ul className="space-y-3">
        {rows.map((c) => (
          <li key={String(c.id)} className="rounded-2xl border border-white/10 bg-forest p-4">
            <p className="text-xs text-white/60">{when(c.created_at)} · {String(c.model ?? "")} {c.rating === 1 ? "· 👍" : c.rating === -1 ? "· 👎" : ""}</p>
            <p className="mt-2 font-bold">{String(c.question)}</p>
            <p className="mt-1 whitespace-pre-wrap text-white/80">{String(c.answer ?? "(no answer recorded)")}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

function Activity({ events, errors }: { events: Data["events"]; errors: Row[] }) {
  const types = Object.keys(events);
  return (
    <>
      <h2 className="font-display text-2xl">Last 30 days</h2>
      {!types.length && <p className="mt-3 text-white/70">No activity yet.</p>}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {types.map((t) => (
          <section key={t} className="rounded-2xl border border-white/10 bg-forest p-4">
            <h3 className="font-bold text-mint">{t.replace(/_/g, " ")} ({Object.values(events[t]).reduce((a, b) => a + b, 0)})</h3>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {Object.entries(events[t]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, n]) => (
                <li key={label} className="flex justify-between gap-4"><span>{label}</span><span>{n}</span></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Recent errors</h2>
      {!errors.length && <p className="mt-3 text-white/70">None. 🎉</p>}
      <ul className="mt-3 space-y-2 text-sm">
        {errors.map((e, i) => (
          <li key={i} className="rounded-xl border border-[#FF9C8B]/40 p-3">
            <span className="text-white/60">{when(e.created_at)}</span> · <b>{String(e.label)}</b> · {String((e.meta as Row | null)?.message ?? "")}
          </li>
        ))}
      </ul>
    </>
  );
}

function Content() {
  const [key, setKey] = useState<(typeof KEYS)[number]>("profile");
  const [text, setText] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (k: string) => {
    setMsg("");
    const res = await fetch(`/api/admin/content?key=${k}`);
    const json = await res.json();
    if (!res.ok) return setMsg(json.error ?? "Could not load.");
    setText(typeof json.value === "string" ? json.value : JSON.stringify(json.value, null, 2));
    setIsDefault(json.isDefault);
  }, []);
  useEffect(() => {
    void load(key);
  }, [key, load]);

  async function save() {
    setBusy(true);
    setMsg("");
    let value: unknown = text;
    if (key !== "knowledge") {
      try {
        value = JSON.parse(text);
      } catch {
        setBusy(false);
        return setMsg("That isn’t valid JSON. Check commas and quotes.");
      }
    }
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    const json = await res.json();
    setBusy(false);
    setMsg(res.ok ? "Saved. The site updates within a minute." : json.error ?? "Could not save.");
    if (res.ok) setIsDefault(false);
  }

  async function reset() {
    if (!confirm("Reset this section back to the defaults in the code?")) return;
    const res = await fetch(`/api/admin/content?key=${key}`, { method: "DELETE" });
    setMsg(res.ok ? "Reset to defaults." : (await res.json()).error ?? "Could not reset.");
    await load(key);
  }

  return (
    <>
      <p className="text-white/70">Edit a section as JSON (or plain text for “knowledge”, extra facts Gurrabot should know, such as your CV text). Images and videos must be files in the site’s public folder.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {KEYS.map((k) => (
          <button key={k} onClick={() => setKey(k)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${key === k ? "bg-mint text-abyss" : "bg-forest text-white/80"}`}>{k}</button>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/60">{isDefault ? "Using the defaults from the code." : "Customised in the database."}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label={`Edit ${key}`}
        className="mt-3 h-[28rem] w-full rounded-2xl border border-white/15 bg-abyss p-4 font-mono text-sm leading-relaxed"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={busy} className={primary}>{busy ? "Saving…" : "Save"}</button>
        <button onClick={reset} className={btn}>Reset to defaults</button>
        {msg && <p role="status" className="text-sm text-white/80">{msg}</p>}
      </div>
    </>
  );
}

function Status({ data }: { data: Data | null }) {
  const rows: [string, boolean | undefined, string][] = [
    ["Database (Supabase)", data?.status.database, "Needed for messages, chat history, activity, and editing content."],
    ["Email alerts (Resend)", data?.status.email, "Emails you new messages and errors."],
    ["Gurrabot (Groq key)", data?.status.groq, "Needed for the chatbot."],
  ];
  return (
    <ul className="space-y-3">
      {rows.map(([name, ok, note]) => (
        <li key={name} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-forest p-4">
          <span aria-hidden className={`mt-1.5 h-3 w-3 rounded-full ${ok ? "bg-mint" : "bg-[#FF9C8B]"}`} />
          <span><b>{name}</b>: {ok ? "connected" : "not set"}<br /><span className="text-sm text-white/60">{note}</span></span>
        </li>
      ))}
      <li className="text-sm text-white/60">Public status page: <a className="text-mint underline" href="/api/health">/api/health</a></li>
    </ul>
  );
}
