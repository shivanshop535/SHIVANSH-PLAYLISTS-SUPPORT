# Shivansh Playlists — Support Vault

Plain **HTML + CSS + vanilla JS** support/leaderboard site for **Shivansh
Playlists**. Viewers "unlock" a GPLinks link to register as a supporter.
Every verified unlock counts toward a **daily goal of 50 supporters**,
shows up on a **leaderboard**, and builds each supporter's **daily streak**.

No React, no build step, no bundler. The only backend pieces are four tiny
files in `/api` — Vercel runs these as serverless functions automatically.
They exist only because your Supabase and GPLinks secret keys can never sit
in the browser; everything else is a static site.

---

## 1. How it works

1. A visitor types a name and clicks **Unlock & Support**.
2. `api/support-start.js` creates a `pending` row in Supabase and asks the
   **GPLinks API** to shorten a one-time verify link
   (`/api/support-verify?id=...`).
3. The visitor is sent to that GPLinks shortlink, completes it as usual.
4. GPLinks redirects the visitor back to `/api/support-verify?id=...`,
   which marks that row `verified` — this is the only place a support is
   actually counted, so it can't be faked by refreshing the homepage.
5. `js/main.js` polls `/api/stats` (today's count vs. goal) and
   `/api/leaderboard` (totals + streaks) every 15 seconds.

Streaks and "today" use **IST (Asia/Kolkata)** — change `TIMEZONE` in
`lib/date.js` if your audience is elsewhere.

---

## 2. Set up Supabase (free tier is enough)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and click **Run**.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ powerful key, only ever used inside `/api`, never in the browser)

---

## 3. Set up GPLinks

1. Sign up at [gplinks.in](https://gplinks.in) and open
   **Tools → Developer API** to grab your API key.
2. Put it in `GPLINKS_API_KEY`.

**Don't have a GPLinks key yet?** Leave `GPLINKS_API_KEY` blank. The site
runs in **demo mode**: clicking "Unlock & Support" sends the visitor
straight to the verify step (no ad wall) so you can test the counter,
leaderboard, and streaks end-to-end first.

---

## 4. Run locally

You need the [Vercel CLI](https://vercel.com/docs/cli) to run the `/api`
functions locally (a plain `index.html` double-click won't run them).

```bash
npm install -g vercel     # one-time
npm install                # installs @supabase/supabase-js for /api
cp .env.example .env       # then fill in your real values
vercel dev
```

Visit the URL it prints (usually `http://localhost:3000`).

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
2. Framework preset: **Other** (Vercel auto-detects the `/api` functions —
   no build command needed).
3. Add these **Environment Variables** in the Vercel project settings
   (same names as `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GPLINKS_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL, e.g.
     `https://shivansh-playlists.vercel.app` (add after the first deploy,
     once you know the URL, then redeploy)
   - `DAILY_GOAL` → `50` (or whatever you want)
4. Click **Deploy**.

---

## 7. Project structure

```
index.html                    the whole page
css/style.css                 all styling (purple vault theme)
js/main.js                    polling, form submit, ring animation, confetti
api/
  support-start.js            creates a pending support + GPLinks shortlink
  support-verify.js           GPLinks redirects here — marks it verified
  stats.js                    today's count vs. daily goal
  leaderboard.js               totals + streaks per supporter
lib/
  supabase.js                 server-only Supabase client (service role)
  gplinks.js                  GPLinks shortlink helper
  date.js                     IST day keys + streak calculation
supabase/
  schema.sql                  run once in Supabase SQL Editor
```

---

## 8. Customizing

- **Daily goal** — change `DAILY_GOAL` in your env vars.
- **Colors** — edit the CSS variables at the top of `css/style.css`
  (`--amethyst`, `--orchid`, `--pulse`, `--ember`).
- **Copy** — edit the text directly in `index.html`.
- **Timezone** — edit `TIMEZONE` in `lib/date.js`.
