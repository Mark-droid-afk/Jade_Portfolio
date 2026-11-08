# Mark Jade D. Gurrobat: Personal Website

Next.js 14, TypeScript, and Tailwind CSS, with **Gurrabot**, an AI chatbot powered by the Groq API.

Pages: `/` welcome (goes to `/home` after 4 seconds), `/home`, `/projects/<slug>` case studies, `/notes`, `/cv` (generated PDF), `/admin`.

Everything works with only a Groq key. Each extra service below turns on more features, and the site degrades gracefully without it.

## Run locally

```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3000
```

## What each service unlocks

| Service (free) | Env variables | Unlocks |
|---|---|---|
| Groq | `GROQ_API_KEY` | Gurrabot |
| Supabase | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Your own contact form, saved messages, chat history and thumbs feedback, activity counts, shared rate limiting, editing the site from `/admin` |
| Resend | `RESEND_API_KEY`, `OWNER_EMAIL` | Email for new messages and for site errors |
| Admin | `ADMIN_PASSWORD` (+ optional `ADMIN_SECRET`) | The `/admin` page |
| GitHub | `GITHUB_TOKEN` (optional) | Higher limit for live repo stats |
| Web3Forms | `NEXT_PUBLIC_WEB3FORMS_KEY` | Contact form only, if you skip Supabase and Resend |

### Supabase setup (5 minutes)
1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it. All tables are locked; only your server can read them.
3. Open **Project Settings > API** and copy the **Project URL** and the **service_role** key into `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service_role key in browser code or screenshots.

### Resend setup
1. Create a key at https://resend.com. Set `RESEND_API_KEY` and `OWNER_EMAIL` (the email you signed up with).
2. The free test sender can only email your own address, which is exactly what you need.

### Admin
Set `ADMIN_PASSWORD`, redeploy, then open `/admin`. You can read and manage messages, review Gurrabot chats and thumbs, see activity and errors, and edit sections of the site as JSON (projects, skills, involvement, notes, testimonials, profile text, and extra facts for Gurrabot). **Reset to defaults** restores what is in `lib/data.ts`. Images and videos must be files inside `public/`.

### Analytics
Page views use Vercel Web Analytics: open your project on Vercel, then **Analytics > Enable**. Project clicks, CV downloads, and Gurrabot opens are counted by your own database and shown in `/admin`.

## Make it yours

1. **Content:** `lib/data.ts` holds the defaults (or use `/admin` once Supabase is connected). Fill in `email`, `github`, `linkedin`; `school` and `location` are optional.
2. **Photos and logo:** `public/photo-formal.jpg`, `public/photo-casual.jpg`, `public/logo.png`. The tab icon is `app/icon.png`.
3. **Project images and videos:** drop files in `public/projects/`, then set `image` (and optionally `gallery`, `video`, `frame`) on the project.
4. **CV:** `/cv` is generated from the same content. To use your own PDF instead, add it to `public/` and set `cvUrl`.
5. **Colors and fonts:** `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`.

## Deploy (Vercel)

Push to GitHub, import at https://vercel.com/new, add the environment variables, deploy. Redeploy after changing a variable.

## Gurrabot

- Answers only from your profile, project notes, and the READMEs of your public GitHub repos (school, country, and credential lines are filtered out).
- Tries `GROQ_MODEL`, then `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.6-27b`. Groq retired `llama-3.3-70b-versatile` on 2026-08-16.
- Visitors can resume their last conversation, rate answers, and leave you a message from inside the chat.
- Check configuration at `/api/health` (shows which features are on, never secrets).

## Tests and checks

```bash
npm run typecheck     # TypeScript
npm test              # unit tests (auth, rate limit, validation, markdown, CV, knowledge filter)
npx playwright install chromium && npm run build && npm run test:e2e   # browser smoke tests
```

GitHub Actions (`.github/workflows/ci.yml`) runs typecheck, unit tests, and the build on every push.

## Security

Security headers (CSP, frame blocking, HSTS), a signed httpOnly admin cookie, login rate limiting, input validation and length caps on every form, a honeypot and timing check against spam bots, and a locked-down database (no public access).
