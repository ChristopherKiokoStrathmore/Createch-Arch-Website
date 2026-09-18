# Createch Architects — website

Portfolio site for [Createch Architects](https://createch.co.ke), a Nairobi
practice working in hospitality, F&B, lifestyle and high-end residential
architecture and interior design.

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Fraunces + Inter.
Deployed on **Vercel**; the domain and mailboxes stay at **Truehost** — see
[Deploying](#deploying).

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in NEXT_PUBLIC_SITE_URL
npm run dev                    # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Generates image variants, then builds the site |
| `npm run start` | Runs the production build locally |
| `npm run lint` | ESLint |
| `npm run images:variants` | Regenerates responsive WebP variants only |

---

## Architecture

### Rendering

Every page is prerendered at build (`○` static, `●` SSG) — the content never
changes between deploys, so nothing needs to be rendered per request. The one
piece of server code is the enquiry Server Action in `app/contact/actions.ts`,
which runs as a Vercel Function only when someone submits the form.

Security headers and image cache-control are set in `next.config.ts` under
`headers()`. There is no `vercel.json` and no `.htaccess`; keeping them in
`next.config.ts` means they also apply under `npm run start` locally.

### Content

Visitor-facing words live in **`content/copy.ts`**. Case studies live in
**`content/seed.ts`**. Import either file, or the barrel `@/content`. There is
no CMS: eleven projects that change once or twice a year did not justify one.

To change copy (hero, principles, contact labels, enquiry messages), edit
`content/copy.ts`. To add a case study, edit `content/seed.ts` and drop
photographs in `public/images/{slug}/`. Push — Vercel rebuilds on commit.

Project shape (`content/seed.ts`):

- `slug`, `title`, `location`, `country`, `year?`, `typology`, `cover`,
  `gallery`, `brief` (short description)
- `order` drives sequence; `featured: true` puts a project on the homepage
- `placeholder: true` marks a demo plate — never a claimed Createch building
- `underCreatech` marks work delivered under the practice

`site` in `content/copy.ts` holds email, phone, WhatsApp, and social URLs.
**A social link with an empty URL does not render.** Street address
(`site.address.line1`) is blank until the practice confirms one — do not
invent a Nairobi street.

> **Attribution integrity.** `underCreatech` marks the one project delivered
> under the practice. The other ten are Anvi's earlier work with other firms and
> the site says so — on the Work index, on each case study, and in the JSON-LD,
> where `creator` is only the practice when the flag is true. Do not set this
> flag to make the portfolio look bigger.

### Images

```
assets-src/    original files (gitignored, ~800 MB)
   ↓ scripts/prepare-images.mjs
assets-web/    processed candidates (gitignored)
   ↓ scripts/finalize-assets.mjs
public/images/ the 68 curated keepers (.jpg — COMMITTED)
   ↓ scripts/build-image-variants.mjs   ← runs in `npm run build`
public/images/**.{640,1280,1920}.webp   (gitignored, build output)
```

`content/image-dimensions.json` holds intrinsic sizes so every frame can
declare an `aspect-ratio` before the photo loads — the site has no layout
shift by construction.

`lib/image-loader.ts` maps a request for any width onto the nearest generated
variant. **The widths in that file, in `next.config.ts` (`deviceSizes`) and in
`scripts/build-image-variants.mjs` must stay in sync** — the loader can only
address files the script actually wrote.

---

## Deploying

**Vercel serves the site. Truehost holds the domain, DNS and email.** Do not
move the MX records — `anvi@createch.co.ke` lives at Truehost and is printed on
every page of this site.

1. **Import the repo into Vercel.** Framework preset: Next.js. No build-command
   override — `npm run build` already generates the image variants first.

2. **Set the environment variables** in Vercel → Settings → Environment
   Variables (see `.env.example`):

   | Variable | Notes |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://createch.co.ke`. Baked in at build time — changing it needs a redeploy, not a restart. |
   | `RESEND_API_KEY` | Required to send. Without it the form does not silently fail; it tells the visitor to email directly. |
   | `ENQUIRY_TO_EMAIL` | Where enquiries land. Falls back to `CONTACT_TO_EMAIL`, then `anvi@createch.co.ke`. |
   | `ENQUIRY_FROM_EMAIL` | Must be on a domain **verified in Resend**, or delivery is rejected. Falls back to `MAIL_FROM`. |

3. **Point the domain at Vercel.** In Truehost's DNS, add the A / CNAME records
   Vercel gives you for the apex and `www`. Leave MX and any mail-related TXT
   (SPF/DKIM) records exactly as they are.

4. **Verify createch.co.ke in Resend** and add its DKIM records to Truehost DNS,
   alongside the existing mail records. Until this is done the form will accept
   submissions and Resend will reject them.

5. **Pick one canonical host** in Vercel's domain settings — apex or `www`, with
   the other redirecting. Two live hosts means every page indexed twice.

### Verifying a deploy

```
/            /work            /studio          /contact       → 200
/sitemap.xml → 15 URLs        /robots.txt      → sitemap link
/nonsense    → the site's own 404, not a platform error page
```

Then paste the homepage into WhatsApp and confirm the card renders `og.jpg`,
and **send one real enquiry through the form** — that is the only way to know
the Resend domain verification actually went through.

## Analytics

Vercel Analytics and Speed Insights, mounted in `app/layout.tsx`. Both are
cookieless, so the site needs no consent banner, and both are served from
`/_vercel/*` on this origin — which is why the CSP can stay at `'self'`.

Speed Insights reports real Core Web Vitals from actual visitors. Watch LCP on
the homepage in particular: the hero reveal is the site's one signature moment
and this is how you find out whether it costs you anything.

To remove tracking entirely, delete the two components from `app/layout.tsx`
and uninstall `@vercel/analytics` and `@vercel/speed-insights`.

---

## Known gaps

These are content and brand decisions, not code:

- **The logo is a placeholder.** `components/logo.tsx` says so in its own header
  comment. It also drives `app/icon.svg`, `app/apple-icon.png` and `og.jpg`
  (via `scripts/build-og-image.mjs`) — replace all four when the real SVG lands.
- **No social URLs.** `siteSettings.socials` is empty, so the footer renders no
  social links at all. Fill them in and they appear.
- **No project years.** No entry in `content/seed.ts` sets `year`, so the Year
  cell in `SpecBlock` and `ProjectCard` never renders. Undated work reads as
  older than it is.
- **Some photography is below web resolution.** 21 of 68 images are under
  1000 px wide and 12 under 700 px; they were extracted from the portfolio PDF,
  so that is a hard ceiling. `components/gallery.tsx` already caps anything
  narrow at ~700 px rather than stretching it.
