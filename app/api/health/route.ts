import { adminEnabled } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { emailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

// Shows which features are configured. Booleans only, never secrets.
export function GET() {
  const key = process.env.GROQ_API_KEY ?? "";
  const model = (process.env.GROQ_MODEL ?? "").trim();
  return Response.json({
    ok: true,
    gurrabot: { apiKeySet: Boolean(key), apiKeyLooksValid: key.startsWith("gsk_"), modelEnvLooksLikeKey: model.startsWith("gsk_") },
    contact: { database: dbConfigured(), email: emailConfigured(), web3forms: Boolean(process.env.NEXT_PUBLIC_WEB3FORMS_KEY) },
    admin: adminEnabled(),
    githubToken: Boolean(process.env.GITHUB_TOKEN),
  });
}
