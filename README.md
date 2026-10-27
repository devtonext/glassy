# Glass Portfolio — Next.js + Supabase template

A frosted-glass portfolio website with its own admin dashboard. Edit your profile, projects, highlights and testimonials, and read contact-form messages, all from `/admin`. No code needed after setup.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (database, auth, storage)

---

## Quick start (about 5 minutes)

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a **new project**. The free plan is enough.
2. Open **SQL Editor → New query**, paste the whole of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   This creates the tables, security rules, the image storage bucket and demo content.
   It is safe to run again later; it never deletes your content.

### 3. Add your keys

Copy the example env file:

```bash
cp .env.example .env.local
```

Fill it in from **Supabase → Project Settings → API Keys** (the project URL is under **Data API**):

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / **publishable** key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` / **secret** key. Keep it private. |
| `NEXT_PUBLIC_SITE_URL` | Your site's URL (used for social previews) |

### 4. Create your admin account

```bash
npm run dev
```

Open [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup) and choose your email and password.
The setup page checks each step for you, and it locks itself once an admin exists.

You're done. Edit everything at **/admin**.

> **Recommended:** in Supabase, go to **Authentication → Sign In / Providers** and turn off **Allow new users to sign up**.
> Your admin account was already created by the setup page, so nobody else needs to sign up.
> (Even with sign-ups on, other users can't edit anything; the database rules only allow your admin account.)

---

## Deploy to Vercel

1. Push this project to your own GitHub repository.
2. On [vercel.com](https://vercel.com) click **Add New → Project** and import the repository.
3. Add the same 4 environment variables from your `.env.local` (set `NEXT_PUBLIC_SITE_URL` to your real domain).
4. Click **Deploy**. If you haven't created your admin yet, visit `https://your-domain.com/admin/setup`.

It also works on Netlify, Railway or any Node.js host (`npm run build && npm start`).

---

## What you can edit in /admin

| Page | What it controls |
| --- | --- |
| **Site & profile** | Name, role, intro, portrait, buttons, About text and stats, section headings, contact details, social links, logo text, SEO |
| **Highlights** | The small glass cards next to your photo (2 at a time; arrows appear when you add more) |
| **Projects** | Portfolio cards. The first 3 are shown and "Explore" reveals the rest. Untick *Published* to hide one. |
| **Testimonials** | Quotes with photos |
| **Messages** | Contact-form inbox: reply, mark read/unread, delete |
| **Account** | Change your password |

Images you upload go to your Supabase Storage bucket `media` (max 5 MB each).
Use ▲ ▼ to reorder items. Changes appear on the live site as soon as you save.

---

## Demo mode

Without Supabase keys, the site runs with built-in demo content from `src/lib/demo-content.ts`.
That makes it easy to preview the design first. The contact form and admin are disabled until you connect Supabase.

---

## Customizing

**Colors & glass effect:** `src/app/globals.css`. Change the `@theme` colors (`--color-ink` is the dark navy), the page gradient (`--page-bg`), or the `glass` utilities.

**Font:** `src/app/layout.tsx` (uses Inter Tight from Google Fonts via `next/font`).

**Sections:** each part of the page is one file in `src/components/site/`:

```
Navbar.tsx    Hero.tsx    About.tsx    Work.tsx    People.tsx    Contact.tsx    Footer.tsx
```

Reorder or remove them in `src/app/page.tsx`.

**Add a field to the admin** (example: a "year" on projects):

1. Add the column in Supabase: `alter table public.projects add column year text;`
2. Add the field in `src/lib/admin/collections.ts`:
   `{ name: "year", label: "Year", type: "text", half: true }`
3. Show it in `src/components/site/Work.tsx` (`p.year`) and add it to the `Project` type in `src/lib/types.ts`.

The admin form is generated from that config, so no admin code changes are needed.
Fields on the *Site & profile* page work the same way via `src/lib/admin/site-fields.ts` and the `site` table.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 ← the public website
│   ├── actions/contact.ts       ← contact form handler
│   └── admin/
│       ├── actions.ts           ← all admin save/delete/login logic
│       ├── (auth)/login, setup  ← login + first-time setup
│       └── (panel)/…            ← dashboard pages
├── components/
│   ├── site/                    ← website sections
│   └── admin/                   ← admin UI (forms, image upload, sidebar)
├── lib/
│   ├── admin/                   ← admin field configs
│   ├── supabase/                ← Supabase clients
│   ├── content.ts               ← loads site content
│   └── demo-content.ts          ← fallback demo content
└── proxy.ts                     ← keeps the admin session fresh
supabase/
└── schema.sql                   ← run once in Supabase
```

## Security notes

- Every table uses **Row Level Security**. Visitors can only read public content and send messages; only users listed in the `admins` table can change anything or read messages.
- `SUPABASE_SERVICE_ROLE_KEY` is used **only on the server**, and only by the one-time setup page. Never prefix it with `NEXT_PUBLIC_`.
- Add a second admin: create the user in **Supabase → Authentication → Users**, then run
  `insert into public.admins (user_id, email) select id, email from auth.users where email = 'them@example.com';`
- Forgot your password? Reset it from **Supabase → Authentication → Users**, or send a recovery email from there.

## Local Supabase (optional, for developers)

With Docker installed, `npx supabase start` runs Supabase locally. Apply the schema with
`psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/schema.sql`
and use the keys printed by `npx supabase status`.
