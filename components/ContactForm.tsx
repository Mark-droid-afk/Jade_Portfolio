"use client";

import { FormEvent, useState } from "react";

// Uses Web3Forms (free). Set NEXT_PUBLIC_WEB3FORMS_KEY to enable; without it the form is hidden.
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/50";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  if (!KEY) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KEY,
          subject: "New message from your portfolio",
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck") ? true : "",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? "The message could not be sent.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The message could not be sent. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-deep p-5 md:p-7">
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
        <textarea id="cf-message" name="message" required maxLength={2000} rows={5} className={field} />
      </div>
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-aqua px-6 py-3.5 text-sm font-bold text-midnight transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" className="min-h-[1.5rem] text-sm">
        {status === "sent" && "Message sent. Thanks, I’ll get back to you soon."}
        {status === "error" && <span className="text-peach">{error}</span>}
      </p>
    </form>
  );
}
