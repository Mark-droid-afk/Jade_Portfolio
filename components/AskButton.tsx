"use client";

// Opens the Gurrabot chat from anywhere on the page.
export default function AskButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("gurrabot:open"))}
      className={className}
    >
      {children}
    </button>
  );
}
