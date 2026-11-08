"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/50";

// mode "api": the site's own /api/contact route. mode "web3forms": free no-backend fallback.
export default function ContactForm({ mode }: { mode: "api" | "web3forms" | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  if (!mode || (mode === "web3forms" && !WEB3FORMS_KEY)) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res =
        mode === "api"
          ? await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: data.get("name"),
                email: data.get("email"),
                message: data.get("message"),
                website: data.get("website"),
                t: shownAt.current,
              }),
            })
          : await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                access_key: WEB3FORMS_KEY,
                subject: "New message from your portfolio",
                name: data.get("name"),
                email: data.get("email"),
                message: data.get("message"),
                botcheck: data.get("website") ? true : "",
              }),
            });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false || json.error) throw new Error(json.error ?? json.message ?? "The message could not be sent.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The message could not be sent. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-forest p-5 text-white md:p-7">
      <div>
        <label htmlFor="cf-name" className="text-sm font-semibold">
          Name
        </label>
        <input id="cf-name" name="name" required maxLength={100} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="cf-email" className="text-sm font-semibold">
          Email
        </label>
        <input id="cf-email" name="email" type="email" required maxLength={150} autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="cf-message" className="text-sm font-semibold">
          Message
        </label>
        <textarea id="cf-message" name="message" required minLength={3} maxLength={2000} rows={5} className={field} />
      </div>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-mint px-6 py-3.5 text-sm font-bold text-abyss transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" className="min-h-[1.5rem] text-sm">
        {status === "sent" && "Message sent. Thanks, I’ll get back to you soon."}
        {status === "error" && <span className="text-[#FF9C8B]">{error}</span>}
      </p>
    </form>
  );
}
