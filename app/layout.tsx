import type { Metadata, Viewport } from "next";
import "@fontsource/gloock/400.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { profile } from "@/lib/data";
import { SpeedInsights } from "@vercel/speed-insights/next";

function getSiteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    "";
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return new URL("http://localhost:3000");
  }
}

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title,
  description: profile.summary,
  openGraph: { title, description: profile.summary, type: "website", siteName: profile.name },
  twitter: { card: "summary_large_image", title, description: profile.summary },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A1A36",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
