# SEO changes — what I did and why

Study notes for the SEO pass on this portfolio. Everything below lives in
`index.html` and `public/`.

## 1. Meta description

```html
<meta name="description" content="..." />
```

This is the single most important tag you were missing. It's not a ranking
factor by itself anymore, but it's the snippet Google shows under your title
in search results, and it's what a human reads to decide whether to click.
Without it, Google just grabs a random chunk of your page text — often ugly,
sometimes irrelevant.

**Rule of thumb:** 120–160 characters, written for a human, not stuffed with
keywords. I pulled mine straight from your own "About" copy so it sounds like
you, not SEO-speak.

## 2. `<title>`

Was `manthan`. Now `Manthan — ML Engineer & Developer`.

The `<title>` tag is still one of the strongest on-page ranking signals, and
it's the literal text shown as the browser tab title and the blue link in
search results. A bare first name tells Google (and a human scanning 10
search results) nothing about what the page is. Pattern to follow on other
pages if you add more: `<Thing> — <Site Name>`.

## 3. Canonical URL

```html
<link rel="canonical" href="https://pmanthan.vercel.app/" />
```

Tells search engines "this is the one true URL for this page," even if the
same content is reachable at multiple URLs (e.g. with/without trailing
slash, `?utm=` tracking params, a staging domain, etc). Prevents duplicate-
content dilution, where Google splits ranking signal across near-identical
URLs instead of crediting one.

## 4. `robots.txt` + `sitemap.xml`

- `public/robots.txt` — tells crawlers they're allowed to index everything
  (`Allow: /`) and points them at the sitemap.
- `public/sitemap.xml` — a flat list of every real URL on the site
  (homepage, project pages, blogs, shaped), so crawlers don't have to
  discover pages purely by following links. Helps new/changed pages get
  indexed faster.

Both are plain static files served at the domain root — Vite's `public/`
folder copies them as-is into the build with no processing.

**Maintenance note:** if you add a new project or route, add its URL to
`sitemap.xml` manually — it's not auto-generated from `src/content/projects`.

## 5. Open Graph + Twitter Card tags

```html
<meta property="og:title" ... />
<meta property="og:description" ... />
<meta property="og:image" ... />
<meta name="twitter:card" content="summary_large_image" />
```

These aren't read by Google — they're read by the *link unfurlers* on
LinkedIn, Slack, Discord, iMessage, Twitter/X, WhatsApp, etc. Without them,
pasting your portfolio link anywhere shows either nothing or a broken/ugly
preview. With them, it shows your name, a one-line pitch, and a preview
image. This matters a lot for a portfolio specifically, since the main way
people find it is someone else sharing the link.

`og:image` points at `/og-image.png` (a 1200×1200 resize of your profile
photo — see below). Social platforms generally want ≥1200px wide images;
below that they get upscaled and look blurry in previews.

## 6. Favicons

Before: a single `<link rel="icon">` pointing at `pfp.PNG` — a 1024×1024,
438KB photo, used directly as the browser tab icon. Browsers *can* downscale
that on the fly, but:
- it's wasteful (downloading 438KB just to show a 16px icon)
- some browsers/platforms don't resize gracefully and it looks fuzzy
- there's no Apple touch icon, so "Add to Home Screen" on iOS falls back to
  an ugly auto-generated screenshot

I generated a proper icon set from the same source photo with `sips`
(macOS's built-in image tool, no extra deps needed):

| File | Size | Used for |
|---|---|---|
| `favicon.ico` | 16/32px multi-size | Legacy browser tab icon |
| `favicon-16x16.png` | 16×16 | Modern browser tab icon |
| `favicon-32x32.png` | 32×32 | Modern browser tab icon (retina) |
| `apple-touch-icon.png` | 180×180 | iOS "Add to Home Screen" |
| `icon-192.png` / `icon-512.png` | 192/512 | PWA manifest icons (Android home screen) |

## 7. `site.webmanifest`

```json
{ "name": "Manthan — Portfolio", "icons": [...], "theme_color": "#111111", ... }
```

A small JSON file that makes the site a minimally "installable" web app —
mainly relevant on Android, where Chrome uses it to generate a proper home
screen icon + splash screen if someone adds your site. Not critical for SEO
ranking, but it's a 10-line file that costs nothing and fills in a gap
Lighthouse/SEO audits flag.

## 8. `theme-color` meta tag

```html
<meta name="theme-color" content="#111111" />
```

Colors the browser chrome (the address bar area on mobile Chrome/Safari,
task-switcher card header) to match your site's dark background instead of
showing default white — small polish detail, not an SEO signal, but free.

## 9. `robots` meta tag

```html
<meta name="robots" content="index, follow" />
```

Explicit is better than implicit — this is actually the default behavior
already, but stating it directly avoids ambiguity and is what most SEO
audit tools expect to see present.

---

## What I deliberately did NOT do (and why)

- **No `og:image` at a real 1200×630 (1.91:1) crop.** I used your square
  profile photo at 1200×1200 instead. It works fine as a preview image, but
  a proper landscape banner (name + tagline designed as an image) would
  look noticeably more polished on Twitter/LinkedIn. Worth doing by hand in
  Figma/Canva later — not something to script.
- **No `manifest`-driven PWA offline support** (service worker, caching).
  The manifest here only gives you a nice icon; a real installable/offline
  PWA is a much bigger scope decision, not a default SEO task.
- **No structured data (JSON-LD `Person` schema).** This can make Google
  show a richer result (knowledge panel style) for your name, but it's a
  bigger, more opinionated addition — happy to add it if you want to go
  further.
- **Didn't touch per-project meta tags.** Right now every route shares the
  same `index.html` meta tags (this is a client-rendered SPA, no
  server-side rendering), so `/projects/instigpt` shows the same title/
  description/OG image as the homepage when shared. Fixing that properly
  needs either SSR/prerendering (e.g. `vite-plugin-ssr`, Next.js) or
  per-route `<Helmet>`-style dynamic head tags — a real project in itself,
  not a quick fix.

## Quick way to verify it worked

- Google's rich result test / PageSpeed Insights — checks title+description
  are present.
- https://www.opengraph.xyz/ or paste your deployed URL into a LinkedIn/
  Slack message — confirms the OG image/title/description render correctly.
- Browser tab + bookmark + "Add to Home Screen" — confirms favicons show up
  properly at every size.
