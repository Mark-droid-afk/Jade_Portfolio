// Lightweight first-party event logging (stored only if the database is configured).
export function track(type: string, label?: string) {
  try {
    const body = JSON.stringify({ type, label });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }));
    else void fetch("/api/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch {
    /* ignore */
  }
}
