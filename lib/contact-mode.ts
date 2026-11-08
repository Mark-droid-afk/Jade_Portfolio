import { dbConfigured } from "./db";
import { emailConfigured } from "./email";

// "api" uses the site's own contact route (database and/or email). "web3forms" is the no-backend fallback.
export function contactMode(): "api" | "web3forms" | null {
  if (dbConfigured() || emailConfigured()) return "api";
  if (process.env.NEXT_PUBLIC_WEB3FORMS_KEY) return "web3forms";
  return null;
}

export const cvHref = (cvUrl: string) => cvUrl || "/cv?download=1";
