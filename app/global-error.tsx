"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#04201A", color: "#fff", fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", padding: 24 }}>
          <h1>Something went wrong</h1>
          <button type="button" onClick={reset} style={{ marginTop: 16, padding: "12px 24px", borderRadius: 999, border: 0, background: "#72F2B0", fontWeight: 700 }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
