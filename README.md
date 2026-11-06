# Mark Jade D. Gurrobat: Personal Website

Next.js 14, TypeScript, and Tailwind CSS, with **Gurrabot**, an AI chatbot powered by the Groq API.

Pages: `/` is the welcome screen (goes to `/home` after 4 seconds). `/home` is the portfolio.

## Run locally

```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3000
```

| Variable | Needed for | Where to get it |
|---|---|---|
| `GROQ_API_KEY` | Gurrabot (required for the chatbot) | https://console.groq.com/keys (free) |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Contact form (hidden if empty) | https://web3forms.com (free) |
| `NEXT_PUBLIC_SITE_URL` | Share previews (optional on Vercel) | Your live URL, including `https://` |

## Make it yours

1. **Content:** edit `lib/data.ts`. The page and Gurrabot both read from it.
   - Fill in `email`, `github`, `linkedin` (empty values stay hidden). `school` and `location` are optional too.
   - Add `github` / `live` / `image` to any project (`image` is a file in `public/`, e.g. `/projects/votera.png`).
   - Add entries to `certifications` and a Certifications section appears.
2. **Photo:** add `public/photo.jpg` (square or portrait). A monogram shows until then.
3. **CV:** add the PDF to `public/` and set `cvUrl: "/YourCV.pdf"`.
4. **Welcome screen time:** change `DELAY_MS` in `components/Welcome.tsx`.
5. **Colors and fonts:** `tailwind.config.ts` (colors) and `app/layout.tsx` (fonts: Gloock and Plus Jakarta Sans).

## Deploy (Vercel, free)

1. Push this folder to GitHub.
2. Import the repo at https://vercel.com/new.
3. Add the environment variables above, then deploy. Redeploy after changing any variable.

## Layout notes

- **Desktop and tablet:** pill navigation bar, hero with portrait and floating cards, two-column project grid, Gurrabot as a floating chat panel.
- **Phones:** app-style bottom tab bar, circular profile hero, swipeable stat chips and project cards, Gurrabot as a bottom sheet.

## How Gurrabot works

- `components/Gurrabot.tsx`: chat UI, streams replies as they arrive.
- `components/GurrabotDock.tsx`: floating panel (desktop) and bottom sheet (phones).
- `app/api/chat/route.ts`: keeps the API key on the server, limits each visitor to 20 messages per 10 minutes, and sends Groq a system prompt built from `lib/data.ts` so it only answers from your profile.
