# Anusha Pavanraj — Angular 21 Portfolio

- Responsive mobile / tablet / desktop layout
- **Dark / light theme** — toggle in the header, applied instantly (no reload), saved in `localStorage`,
  defaults to the visitor's system preference
- Lazy-loaded Angular routing, project filtering, working contact form (delivers to your inbox via Web3Forms — see below)
- Resume download, GitHub Pages deployment workflow

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

## Deploy (GitHub Pages)

Push to `main`. The workflow builds with `--base-href /<repo-name>/` and copies `index.html` to `404.html`
so deep links such as `/<repo-name>/projects` work after a refresh.

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
| **Animations** | `shared/reveal` (IntersectionObserver scroll-reveal with stagger), hero entrance keyframes, page-transition fade, `animate.enter` on form messages and back-to-top, theme toggle slide — all disabled for `prefers-reduced-motion` |
| **Responsive design** | Mobile-first CSS with breakpoints at 1050 / 800 / 760 / 600 / 430 px, fluid type with `clamp()`, collapsible mobile menu |
| **Dark / light theme** | `core/theme.service.ts` (signal + `effect`) and the CSS variable tokens in `styles.scss`; follows the system setting, remembers the choice, no flash on load |
| **Accessibility** | Skip link, focus moved + page title announced on route change, `aria-current` on the active section, `role="switch"` theme toggle, labelled landmarks/sections, real lists, `aria-invalid`/`aria-describedby` on the form, Escape closes the mobile menu, visible focus rings, AA colour contrast in both themes, reduced-motion support |
| **SEO** | Per-route `<title>`, description, Open Graph, Twitter and canonical tags (`core/seo.service.ts`); static OG/Twitter tags + JSON-LD `Person` in `index.html`; `robots.txt` and `sitemap.xml` |
| **Performance** | `OnPush` everywhere + signals, lazy routes + `@defer`, WebP images (hero 191 KB → 17 KB), hero preload, explicit image sizes (no layout shift), lazy-loaded below-fold images, font `display=swap` + preconnect, production budgets |

### SEO notes

- `index.html`, `robots.txt` and `sitemap.xml` contain `__SITE_URL__` / `__BUILD_DATE__` placeholders. The GitHub Actions workflow replaces them with your real GitHub Pages URL on every deploy. If you use a custom domain, edit the `SITE_URL` logic in `.github/workflows/deploy.yml`.
- GitHub Pages cannot serve SPA routes natively, so deep links (`/about`, `/projects`) are served through `404.html`. Browsers show them fine, but search engines see an HTTP 404 for them — that is why the sitemap lists only the home page, which already contains every section. For full per-page indexing, add server-side prerendering (`@angular/ssr`) as a next step.
