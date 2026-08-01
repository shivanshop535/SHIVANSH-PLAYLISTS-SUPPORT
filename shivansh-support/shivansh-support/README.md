# Shivansh Playlists — Support Vault

A support/leaderboard site for **Shivansh Playlists**. Viewers "unlock" a
GPLinks link to register as a supporter. Every verified unlock counts
toward a **daily goal of 50 supporters**, shows up on a **leaderboard**,
and builds each supporter's **daily streak**.

Stack: **Next.js 14 (App Router)** · **Tailwind CSS** · **Supabase**
(Postgres) · **GPLinks API** · deployed on **Vercel**.

---

## 1. How it works

1. A visitor types a name and clicks **Unlock & Support**.
2. The server creates a `pending` row in Supabase and asks the **GPLinks
   API** to shorten a one-time verify link (`/api/support/verify?id=...`).
3. The visitor is sent to that GPLinks shortlink, completes it as usual.
4. GPLinks redirects the visitor back to `/api/support/verify?id=...`,
   which marks that row `verified` — this is the only place a support is
   actually counted, so it can't be faked by refreshing the homepage.
5. The homepage polls `/api/stats` (today's count vs. goal) and
   `/api/leaderboard` (totals + streaks) every 15 seconds.

Streaks and "today" are calculated in **IST (Asia/Kolkata)** — change the
`TIMEZONE` constant in `lib/date.js` if your audience is elsewhere.

---

## 2. Set up Supabase (free tier is enough)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ this key is powerful — it's only ever used server-side, never
     in the browser)

---

## 3. Set up GPLinks

1. Sign up at [gplinks.in](https://gplinks.in) and open
   **Tools → Developer API** to grab your API key.
2. Put it in `GPLINKS_API_KEY`.
3. That's it — the site calls GPLinks' quick-link API per click, so you
   don't need to pre-create any links by hand.

**Don't have a GPLinks key yet?** Leave `GPLINKS_API_KEY` blank. The site
runs in **demo mode**: clicking "Unlock & Support" sends the visitor
straight to the verify step (no ad wall) so you can test the counter,
leaderboard, and streaks end-to-end before wiring up real monetization.

---

## 4. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your real values
npm run dev
```

Visit `http://localhost:3000`.

---

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Shivansh Playlists support vault"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## 6. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub
   repo you just pushed.
2. Framework preset: **Next.js** (auto-detected).
3. Add these **Environment Variables** in the Vercel project settings
   (same names as `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GPLINKS_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL, e.g.
     `https://shivansh-playlists.vercel.app` (add this **after** the
     first deploy, once you know the URL, then redeploy)
   - `NEXT_PUBLIC_DAILY_GOAL` → `50` (or whatever you want)
4. Click **Deploy**.

---

## 7. Project structure

```
app/
  layout.js               root layout, fonts, metadata
  page.js                 homepage (hero, vault ring, support form, leaderboard)
  globals.css             theme base styles
  api/
    support/start/route.js    creates a pending support + GPLinks shortlink
    support/verify/route.js   GPLinks redirects here — marks it verified
    leaderboard/route.js      totals + streaks per supporter
    stats/route.js            today's count vs. daily goal
components/
  Navbar.js, Footer.js
  VaultRing.js             circular unlock-progress signature visual
  SupportPanel.js          name input + unlock button
  Leaderboard.js           ranked list with streak flames
lib/
  supabase.js              server-only Supabase client (service role)
  gplinks.js                GPLinks shortlink helper
  date.js                  IST day keys + streak calculation
supabase/
  schema.sql               run once in Supabase SQL Editor
```

---

## 8. Customizing

- **Daily goal** — change `NEXT_PUBLIC_DAILY_GOAL` in your env vars.
- **Colors** — edit the palette in `tailwind.config.js`
  (`amethyst`, `orchid`, `pulse`, `ember`).
- **Copy** — edit the hero text directly in `app/page.js`.
- **Timezone** — edit `TIMEZONE` in `lib/date.js`.
