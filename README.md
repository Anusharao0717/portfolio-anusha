# Anusha Pavanraj — Portfolio Website

A fast, accessible, fully responsive personal portfolio built with **Angular 21**, showcasing my skills,
experience and selected frontend projects, with a working contact form and downloadable resume.

**Live site:** https://anusharao0717.github.io/portfolio-anusha/

## Features

- Dark / light theme — instant switch, remembers your choice, follows the system setting
- Single-page home with About, Skills, Experience, Projects and Contact sections, plus detail pages
- Live project search and category filter
- Working contact form (Web3Forms) with validation and clear success / error messages
- Resume opens in a new tab
- Rich motion: smooth scrolling, text animation, parallax, 3D card tilt, magnetic buttons, page transitions (respects "reduce motion")
- Accessible: skip link, keyboard navigation, screen-reader announcements, AA contrast
- SEO-ready: per-page titles and descriptions, Open Graph / Twitter cards, structured data, sitemap
- Fast: lazy-loaded pages, deferred sections, WebP images, OnPush change detection

## Tech stack

Angular 21 (standalone components, signals) · TypeScript · RxJS · Reactive Forms · SCSS · Angular Router ·
GitHub Actions · GitHub Pages

## Run

```bat
nvm use 22.14.0
npm install
npm start
```

Open http://localhost:4200

## Project layout

| Path | What it is |
| --- | --- |
| `src/styles.scss` | Global styles and the **theme tokens** (`:root` = dark, `:root.light-theme` = light) |
| `src/app/core/theme.service.ts` | Theme state (signal) — adds/removes the `light-theme` class on `<html>` |
| `src/app/core/content.ts` | All visible site text (English) — edit wording here |
| `src/app/core/contact.service.ts` | Sends the contact form (Web3Forms, falls back to the visitor's mail app) |
| `src/app/core/icons.ts` | Inline SVG brand + UI icons (theme-aware, no image files to break) |
| `src/app/core/site.config.ts` | Email, phone, GitHub, LinkedIn, resume path, **contact form access key** |
| `public/` | Static files copied to the site root (`images/…`, `resume.pdf`) |

## Theming rule

Never hard-code colours in a component stylesheet — use the CSS variables (`var(--bg)`, `var(--surface)`,
`var(--text)`, `var(--muted)`, `var(--border)`, `var(--accent)`, `var(--accent-text)`…).
Selectors like `.light-theme .foo` inside a component's SCSS **do not work** because Angular's style
encapsulation adds an attribute to `.light-theme`; variables avoid that problem entirely.

## Deploy to GitHub Pages (https://github.com/Anusharao0717)

**1. Create the repository** on GitHub (github.com → **New**). Pick the name based on the URL you want:

| Repository name | Your site will be at |
| --- | --- |
| `Anusharao0717.github.io` (recommended — it is your main portfolio address) | `https://anusharao0717.github.io/` |
| `portfolio` (or any other name) | `https://anusharao0717.github.io/portfolio/` |

Leave it empty (no README / .gitignore / licence — this project already has them).

**2. Push the code** from the project folder:

```bash
git init
git add .
git commit -m "Add portfolio"
git branch -M main
git remote add origin https://github.com/Anusharao0717/portfolio-anusha.git
git push -u origin main
```

**3. Turn on Pages:** repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**4. Watch it deploy:** open the repository's **Actions** tab. When the "Deploy Angular Portfolio to GitHub Pages"
run turns green (about 1–2 minutes), your site is live at the URL in the table above.

Every later `git push` to `main` redeploys automatically.

The workflow works out the right base path and site URL for either repository name by itself, fills in the SEO
placeholders (`__SITE_URL__`), and copies `index.html` to `404.html` so direct links such as `/projects` still
load after a refresh. Do the contact-form key step below **before** you push, so the form works from day one.

## Contact form setup (one-time, 2 minutes)

The form works on a static site (GitHub Pages) without a backend by using [Web3Forms](https://web3forms.com) (free).

1. Go to https://web3forms.com, enter `anushapavanraj@gmail.com` and click **Create Access Key**.
2. Copy the key that arrives in your inbox.
3. Paste it into `src/app/core/site.config.ts` as `contactAccessKey: 'your-key'`. (This key is meant to be public, so it is safe to commit.)
4. Rebuild / push. Messages now arrive in your inbox with the visitor's address as Reply-To.

Until a key is set, the form falls back to opening the visitor's mail app (it still "works", but only for visitors who have a mail app configured).

## Resume

`public/resume.pdf` opens in a new browser tab from the header, hero button and mobile menu. Replace the file to update it.

## What this project demonstrates — and where to find it

| Skill | Where it lives |
| --- | --- |
| **Standalone components** | Every component is `standalone: true` (no NgModules) — `src/app/**` |
| **Lazy loading** | Every page is its own chunk via `loadComponent` in `app.routes.ts`; below-the-fold home sections use `@defer (on viewport)` so the contact form code only loads when needed; `PreloadAllModules` fetches the other pages in the background |
| **Angular routing** | `app.routes.ts` (titles + SEO data per route), `withInMemoryScrolling` for `#section` links, `routerLink` + `fragment` navigation |
| **RxJS** | `core/scroll-spy.service.ts` (`fromEvent`, `auditTime`, `switchMap`, `merge`, `shareReplay`, `distinctUntilChanged` → active nav link + back-to-top) and `pages/projects` (`BehaviorSubject` + debounced `valueChanges` + `combineLatest` → live search/filter) |
| **Reactive forms** | `shared/contact-form` (validators, async submit, status signal) and the project search `FormControl` |
| **Reusable components** | `app-icon`, `app-contact-form`, `app-header`, `app-footer`, plus the `appReveal` directive |
| **Animations** | See the *Animations* section below — page-load, scroll-reveal, smooth scrolling, text animation, parallax, card hover, stagger, magnetic buttons, page transitions and 3D tilt; all disabled for `prefers-reduced-motion` |
| **Responsive design** | Mobile-first CSS with breakpoints at 1050 / 800 / 760 / 600 / 430 px, fluid type with `clamp()`, collapsible mobile menu |
| **Dark / light theme** | `core/theme.service.ts` (signal + `effect`) and the CSS variable tokens in `styles.scss`; follows the system setting, remembers the choice, no flash on load |
| **Accessibility** | Skip link, focus moved + page title announced on route change, `aria-current` on the active section, `role="switch"` theme toggle, labelled landmarks/sections, real lists, `aria-invalid`/`aria-describedby` on the form, Escape closes the mobile menu, visible focus rings, AA colour contrast in both themes, reduced-motion support |
| **SEO** | Per-route `<title>`, description, Open Graph, Twitter and canonical tags (`core/seo.service.ts`); static OG/Twitter tags + JSON-LD `Person` in `index.html`; `robots.txt` and `sitemap.xml` |
| **Performance** | `OnPush` everywhere + signals, lazy routes + `@defer`, WebP images (hero 191 KB → 17 KB), hero preload, explicit image sizes (no layout shift), lazy-loaded below-fold images, font `display=swap` + preconnect, production budgets |

### SEO notes

- `index.html`, `robots.txt` and `sitemap.xml` contain `__SITE_URL__` / `__BUILD_DATE__` placeholders. The GitHub Actions workflow replaces them with your real GitHub Pages URL on every deploy. If you use a custom domain, edit the `SITE_URL` logic in `.github/workflows/deploy.yml`.
- GitHub Pages cannot serve SPA routes natively, so deep links (`/about`, `/projects`) are served through `404.html`. Browsers show them fine, but search engines see an HTTP 404 for them — that is why the sitemap lists only the home page, which already contains every section. For full per-page indexing, add server-side prerendering (`@angular/ssr`) as a next step.

## Animations

| Animation | Where you see it | How it is built |
| --- | --- | --- |
| **Page-load** | Hero heading, text, buttons and photo animate in when the site opens | `TextRevealDirective` (`appTextReveal="load"`) + CSS keyframes in `home.component.scss` |
| **Scroll-reveal** | Sections, cards and stats fade/slide in as you scroll | `RevealDirective` (`appReveal`) — Intersection Observer |
| **Smooth scrolling** | Wheel/trackpad scrolling glides; nav links and back-to-top scroll smoothly | **Lenis**, driven by GSAP's ticker (`core/motion.service.ts`) |
| **Text animation** | Words slide up out of a mask, one after another (hero + every section heading) | `TextRevealDirective` — custom word splitter, screen readers still get the full text |
| **Parallax** | Hero photo, glows and dotted grid drift at different speeds while scrolling | **GSAP ScrollTrigger** via `ParallaxDirective` (`[appParallax]="px"`) |
| **Project-card hover** | Cards lift, tilt toward the mouse and light up their border | CSS + `TiltDirective` (`[appTilt]="degrees"`) |
| **Staggered** | Skills, stats and project cards appear one after another | `[appReveal]="delayMs"` with an increasing delay per item |
| **Magnetic buttons** | Primary buttons drift toward the cursor | `MagneticDirective` (`appMagnetic`) |
| **Page transitions** | Pages fade/slide between routes; header stays fixed | Angular `withViewTransitions()` + `::view-transition` CSS in `styles.scss` (older browsers get a CSS fade) |
| **3D effects** | Hero photo and cards rotate in 3D with the mouse | CSS 3D transforms (`perspective`) in `TiltDirective` |

Good to know:

- **Performance:** GSAP, ScrollTrigger and Lenis are loaded as separate chunks *after* the first paint (`MotionService.load()`), so they never delay the first render.
- **Accessibility:** with `prefers-reduced-motion` nothing is split, tilted or smooth-scrolled, no animation libraries are downloaded, and all content is simply visible. Tilt and magnetic effects are also off on touch devices.
- **Three.js is intentionally not included.** It adds roughly 170 KB (gzipped) for a decorative effect; the CSS 3D tilt gives the "interactive 3D" feel at zero cost. It can be added later as a lazy-loaded hero scene if you want a real 3D object.
- All motion directives are standalone and reusable — add `appReveal`, `appTilt`, `appMagnetic`, `appParallax` or `appTextReveal` to any element.
