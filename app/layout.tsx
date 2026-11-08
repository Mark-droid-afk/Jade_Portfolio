import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/gloock/400.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { profile } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.summary,
  openGraph: { title, description: profile.summary, type: "website", siteName: profile.name },
  twitter: { card: "summary_large_image", title, description: profile.summary },
  appleWebApp: { capable: true, title: "Mark Jade", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#04201A",
};

// Runs before first paint so the saved (or system) theme never flashes.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
