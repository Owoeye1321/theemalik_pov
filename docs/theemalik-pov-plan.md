# theemalik pov — Implementation Plan (RPI Stage 2)

**Feature:** `theemalik-pov`
**Target directory:** `/Users/owoeyesamuel/Desktop/others/theemalik_pov`
**Pairs with:** `docs/theemalik-pov-context.md` (Stage 1)
**Date:** 2026-08-18
**Status:** Approved by user. Ready for `/implement-task`.

> This plan is **self-contained**. Every value needed to build the app is transcribed here.
> You do not need to read the context file or the original source to execute it.

---

## 1. Context / why

The deliverable is a production React rebuild of a single-page marketing site for **theemalik pov**,
a Lagos-based photography studio (founded 2019, Instagram `@theemalik_pov`,
`hello@theemalikpov.com`).

The source is a self-contained HTML artifact at
`/Users/owoeyesamuel/Downloads/theemalik pov (standalone).html`. It is **not** readable markup — it
is a bundle whose line 398 holds the JSON-encoded real document. It renders as one flat 336-line
block of inline styles driven by a proprietary template runtime (`dc-runtime`), with zero `@media`
queries and no component structure at all.

"Implement just as it is" therefore means **visual and behavioural fidelity, not structural
transcription**. The runtime, its template directives and the bundler wrapper are a delivery
mechanism and are explicitly discarded. What carries over is every colour, size, `clamp()`,
animation, easing and interaction.

**Outcome:** a Vite + TypeScript + Tailwind app in Feature-Sliced Design with reusable components,
Cloudinary-delivered images, rendering identically to the source at `lg` and above, and collapsing
gracefully below it.

### 1.1 Regenerating the source (reference only — not required to execute this plan)

```bash
node -e "const fs=require('fs');\
const l=fs.readFileSync('/Users/owoeyesamuel/Downloads/theemalik pov (standalone).html','utf8').split('\n');\
fs.writeFileSync('app.html',JSON.parse(l[397]))"
```

Produces `app.html` — 1141 lines, 59,522 bytes. Markup lives at lines 635–971, component logic at
972–1139. All `app.html:N` citations below refer to this decoded file.

**The original bundle renders standalone in a browser.** That is the visual-fidelity reference —
see §8.2.

---

## 2. Goal

> Build the theemalik pov React app: Vite + TypeScript + Tailwind, FSD architecture, reusable
> components, Cloudinary images, pixel-faithful to the source at `lg`+ with responsive collapse below.

---

## 3. Locked decisions

| Decision | Choice | Notes |
|---|---|---|
| Build tool | **Vite 8** | `npm create vite@latest . -- --template react-ts` |
| Language | **TypeScript** (scaffold ships ~6.0.2) | `strict: true` added explicitly — the scaffold omits it |
| Styling | **Tailwind CSS v4.3.3** | CSS-first `@theme`. **No `tailwind.config.js`, no PostCSS config** |
| React | **19.2.x** | No version-specific APIs used |
| Linter | **oxlint** | Ships with the scaffold; replaces ESLint |
| Architecture | **Feature-Sliced Design** | `app → pages → widgets → features → entities → shared`, imports flow down only |
| Routing | **None** | Single page; native hash-anchor scrolling |
| State | **Local only** | Two values total: `filter` and `reel`. No state manager |
| Images | **Cloudinary** via `cloudinaryUrl()` | Raw URLs must never be hardcoded in components |
| Fonts | **Google Fonts** | Scoped to weights actually used |
| Placeholder copy | **Carry over verbatim** | POC tagline, dummy `tel:`, and `#` social links all stay — user decision |
| Responsive | **Add breakpoints below `lg` only** | The one deliberate deviation. See Step 10 |

### 3.1 Verified environment facts

These were confirmed empirically before this plan was written — do not re-derive:

- Node v22.23.2, npm 10.9.8 available.
- **`baseUrl` is deprecated and hard-errors** (`TS5101`) under the scaffold's TypeScript. The `@/*`
  alias **must** use `paths` *without* `baseUrl`.
- Tailwind v4 `@theme` tokens, arbitrary values (`text-[clamp(46px,7.4vw,112px)]`) and
  `lg:grid-cols-[1.05fr_.95fr]` all compile correctly with `strict: true`. The last emits exactly
  `grid-template-columns:1.05fr .95fr`, matching the source hero grid.
- Cloudinary assets are live and byte-identical to the originals. `f_auto,q_auto,w_1200` returns
  143 KB against 2,295 KB raw for the largest image.

---

## 4. Target file tree

```
theemalik_pov/
  docs/theemalik-pov-context.md
  docs/theemalik-pov-plan.md
  index.html
  package.json
  vite.config.ts
  tsconfig.json  tsconfig.app.json  tsconfig.node.json
  src/
    main.tsx
    app/
      App.tsx
      index.css                    @theme tokens, keyframes, globals
    pages/
      home/HomePage.tsx            composes the 12 widgets; owns the reveal hook
    widgets/
      header/Header.tsx
      hero/Hero.tsx
      marquee/Marquee.tsx
      studio/Studio.tsx
      reel/Reel.tsx
      services/Services.tsx
      gallery/Gallery.tsx
      process/Process.tsx
      testimonial/Testimonial.tsx
      brand-system/BrandSystem.tsx
      contact/Contact.tsx
      footer/Footer.tsx
    features/
      gallery-filter/useGalleryFilter.ts  FilterChips.tsx
      reel-carousel/useReelCarousel.ts    ReelStage.tsx  ReelDots.tsx  geometry.ts
    entities/
      gallery-item/types.ts  reel-item/types.ts  service/types.ts
      process-step/types.ts  swatch/types.ts
    shared/
      ui/Button.tsx Chip.tsx SectionLabel.tsx ImageSlot.tsx Stat.tsx RevealOnScroll.tsx
      lib/useIntersectionReveal.ts useInterval.ts cn.ts
      config/images.ts content.ts
```

**FSD import rule:** a layer may only import from layers strictly below it. `shared` imports nothing
from the app. Widgets never import other widgets.

---

## 5. Design tokens & global CSS

### 5.1 Brand palette (named by the source's own Brand System section)

| Token | Hex | Role |
|---|---|---|
| Ink | `#14110F` | Dark background, primary text |
| Paper | `#F5F2EC` | Light background, text on dark |
| Bronze | `#B0754C` | Accent, rules, active states |
| Clay | `#EFEAE0` | Alt light background (marquee, process) |

### 5.2 Secondary colours — required for fidelity, not part of the official palette

Use as arbitrary values (`text-[#4A453D]`) or add as extra `@theme` entries; do **not** approximate
them with the four brand tokens.

| Hex | Used for |
|---|---|
| `#8F5A35` | Bronze-dark: links, section labels on light |
| `#C8955F` | Bronze label on dark backgrounds |
| `#4A453D` | Body copy |
| `#857C72` | Muted meta (nav "pov", stat labels, scroll cue) |
| `#8A8178` | Muted on dark (marquee text, column headings, footer bottom) |
| `#3A352E` | Nav links |
| `#E6E1D7` | Footer links |
| `#B8B1A6` | Footer blurb |
| `#DED7CA` | Image placeholder background |
| `#0A0908` | Reel slide background |
| `#E6C9A6` | Gallery caption category |

### 5.3 Typography

| Family | Weights to load | Role |
|---|---|---|
| Cormorant Garamond | 400, 500, 600 + italic 400, 500 | Display / headlines; italic for accent words |
| Manrope | 400, 500, 600 | Body / interface; default root family |
| Space Mono | 400 | Labels / meta; heavy tracking `.12em`–`.34em`, uppercase |

Google Fonts URL (latin only — the page has no Cyrillic/Greek/Vietnamese text):

```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&family=Space+Mono&display=swap
```

Add the `preconnect` pair to `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) in
`index.html`.

### 5.4 Keyframes — port verbatim

```css
@keyframes riseIn  { from { opacity:0; transform:translateY(26px) scale(.985) } to { opacity:1; transform:none } }
@keyframes fadeUp  { from { opacity:0; transform:translateY(18px) }            to { opacity:1; transform:none } }
@keyframes marquee { from { transform:translateX(0) }                          to { transform:translateX(-50%) } }
@keyframes bob     { 0%,100% { transform:translateY(0) } 50% { transform:translateY(7px) } }
@keyframes grow    { from { width:0 }                                          to { width:100% } }
```

### 5.5 Globals

```css
*    { box-sizing:border-box; margin:0; padding:0 }
html { scroll-behavior:smooth }
body { background:#14110F; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility }
a         { color:#8F5A35; text-decoration:none }
a:hover   { color:#B0754C }
::selection { background:#B0754C; color:#F5F2EC }
```

The app root carries `font-family:Manrope`, `background:#F5F2EC`, `color:#14110F`,
`overflow-x:hidden`.

### 5.6 `@theme` block

Declare the four brand colours, three font families, the five animations, and one spacing token:

```css
--spacing-gutter: clamp(20px, 5vw, 72px);
```

The horizontal gutter is **identical in all 11 sections** — tokenise it (`px-gutter`). Vertical
padding differs per section and stays as arbitrary values.

---

## 6. Step-by-step implementation

### Step 1 — Scaffold

Run in `/Users/owoeyesamuel/Desktop/others/theemalik_pov` (the `docs/` folder already exists and
must be preserved):

```bash
npm create vite@latest . -- --template react-ts
npm install
```

Then delete the boilerplate: `src/App.css`, `src/assets/`, `public/icons.svg`, and the demo body of
`src/App.tsx`. Remove the `import './App.css'` line from `src/main.tsx`.

Move `App.tsx` to `src/app/App.tsx` and update the import in `main.tsx`. Rename `src/index.css` to
`src/app/index.css` and update its import in `main.tsx`.

### Step 2 — Tailwind v4 + path alias + strict

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

`tsconfig.app.json` — add inside `compilerOptions`:

```jsonc
"strict": true,
"paths": { "@/*": ["./src/*"] }
```

> **Do not add `baseUrl`.** It is deprecated and fails the build with `TS5101`. `paths` resolves
> relative to the tsconfig file without it.

There is **no** `tailwind.config.js` and **no** `postcss.config.js` in Tailwind v4. Do not create them.

### Step 3 — `src/app/index.css`

```css
@import "tailwindcss";

@theme { /* §5.6 tokens */ }

/* §5.4 keyframes, §5.5 globals */
```

### Step 4 — `shared/config`

**`images.ts`** — cloud name `dlyryea3n`, base
`https://res.cloudinary.com/dlyryea3n/image/upload`.

```ts
export function cloudinaryUrl(publicId: string, opts?: { w?: number }): string
```

Composes `${BASE}/f_auto,q_auto${opts?.w ? `,w_${opts.w}` : ''}/${publicId}`. Also export a
`srcSet(publicId, widths)` helper.

The eight public IDs, keyed `u1`–`u8`:

| Key | Public ID |
|---|---|
| u1 | `v1787091064/Screenshot_2026-08-18_at_22.31.35_kmmygs.png` |
| u2 | `v1787091106/Screenshot_2026-08-18_at_22.34.09_j8xq9n.png` |
| u3 | `v1787091149/Screenshot_2026-08-18_at_22.34.36_pqei0s.png` |
| u4 | `v1787091164/Screenshot_2026-08-18_at_22.35.00_xiiznz.png` |
| u5 | `v1787091199/Screenshot_2026-08-18_at_22.35.22_gsokmv.png` |
| u6 | `v1787091241/Screenshot_2026-08-18_at_22.36.22_kzvtna.png` |
| u7 | `v1787091250/Screenshot_2026-08-18_at_22.37.08_vivqvs.png` |
| u8 | `v1787091268/Screenshot_2026-08-18_at_22.37.36_vq7zcg.png` |

Slot widths: hero main `1200`, reel `800`, studio `800`, gallery cards `600`, avatar `96`.

**Fixed image assignments** (8 photos cover 17 slots — the repetition is faithful to the source):

| Slot | Image |
|---|---|
| Hero main frame | u1 |
| Hero inset frame | **u7** |
| Studio image 1 | u5 |
| Studio image 2 | u7 |
| Testimonial avatar | u7 |

> The source hardcoded a small `.webp` in the hero inset and computed an unused `heroSub` binding —
> both are dead. **The hero inset uses u7.** The webp is dropped and was never uploaded.

**`content.ts`** — all static data, typed by `entities/`. See §6.1 for the full data tables.

### Step 5 — `entities/`

Types only, no logic. Use **string union types, not enums** — the scaffold sets
`erasableSyntaxOnly: true`, which bans enums.

```ts
export type Category = 'All' | 'Weddings' | 'Birthdays' | 'Portraits' | 'Family' | 'Events'
export type GalleryItem  = { slot: string; title: string; cat: Exclude<Category,'All'>; ph: string; src: string }
export type ReelItem     = { slot: string; title: string; cat: string; ph: string; src: string }
export type Service      = { no: string; title: string; desc: string; tag: string }
export type ProcessStep  = { no: string; title: string; desc: string }
export type Swatch       = { name: string; hex: string }
```

### Step 6 — `shared/ui` primitives

| Component | Props | Covers |
|---|---|---|
| `Button` | `variant: 'solid' \| 'outline'`, `tone: 'light' \| 'dark'`, `href`, `size` | 5 pill CTAs: nav, hero ×2, contact ×2 |
| `Chip` | `label`, `active`, `onClick` | Gallery filter chips + Brand System showcase chip |
| `SectionLabel` | `children`, `centered`, `tone: 'light' \| 'dark'` | 6 usages — see below |
| `ImageSlot` | `src?`, `alt`, `shape: 'rect' \| 'circle'`, `placeholder?`, `width?` | Every image |
| `Stat` | `value`, `label` | 3 studio stats |
| `RevealOnScroll` | `as?`, `className?`, `children` | Thin wrapper emitting `data-reveal` |

**`SectionLabel`** renders a 34px × 1px bronze rule + Space Mono `11px` / `ls .32em` / uppercase
label, `gap:14px`. When `centered`, a second rule follows the label. Label colour is `#8F5A35` on
light and `#C8955F` on dark.

| Usage | Text | Centered | Tone |
|---|---|---|---|
| Hero | Weddings · Portraits · Every Occasion | no | light |
| Studio | The Studio | no | light |
| Reel | In Motion | **yes** | dark |
| Services | What we shoot | no | light |
| Gallery | Selected Work | **yes** | light |
| Brand System | Brand System | no | dark |

**`ImageSlot`** is purely presentational: renders `<img>` with `object-fit:cover` filling its
container, falls back to a `#DED7CA` background when `src` is absent. It builds its `src` through
`cloudinaryUrl()`. **The source's authoring/upload affordance is a bundler feature — do not
recreate it.**

### Step 6b — `shared/lib` hooks

**`useIntersectionReveal(rootRef)`** — a faithful port of the source's imperative reveal
(`app.html:1049`). Called **once** in `HomePage`, not per component.

On mount, inside a **double `requestAnimationFrame`** (a deliberate wait for layout to settle —
keep it, or elements already in view will flash):

1. Query every `[data-reveal]` inside the root; set each to `opacity:0`,
   `transform:translateY(30px)`,
   `transition:opacity .85s cubic-bezier(.2,.7,.2,1), transform .85s cubic-bezier(.2,.7,.2,1)`,
   `will-change:opacity, transform`.
2. Observe with `IntersectionObserver`, `threshold: 0.12`, `rootMargin: '0px 0px -8% 0px'`.
3. On intersect: compute the element's index among its **parent's** `[data-reveal]` children, set
   `transitionDelay = Math.min(index, 6) * 90 + 'ms'`, set `opacity:1` / `transform:none`, then
   **`io.unobserve(el)`** — reveal is once-only.
4. Disconnect the observer and cancel any pending rAF on cleanup.

> The stagger depends on **sibling index**, which is why this is one root-level effect rather than a
> per-component hook — no call site needs to know its own position.

**`useInterval(callback, delayMs)`** — a self-cleaning interval that exposes a `restart()`.

**`cn(...)`** — trivial class-name joiner.

---

### 6.1 Static content — `shared/config/content.ts`

**Services** (`app.html:1013`):

| no | title | tag | desc |
|---|---|---|---|
| 01 | Weddings | Full day | From the first look to the last dance — a calm, unobtrusive eye on the whole day, and a gallery you will actually revisit. |
| 02 | Birthdays & Parties | Events | Milestone birthdays, surprises and celebrations, shot candidly so the energy of the room is what you keep. |
| 03 | Portraits | Studio · Outdoor | Individual, couple and creative portraits — relaxed direction that still looks like you on your best day. |
| 04 | Family & Maternity | Sessions | Warm, unhurried sessions for growing families and new arrivals — the ordinary moments you will miss later. |
| 05 | Events & Graduation | Coverage | Graduations, naming ceremonies, dinners and get-togethers — full coverage delivered while it still feels fresh. |

**Process steps** (`app.html:1021`):

| no | title | desc |
|---|---|---|
| STEP 01 | Enquiry | You send the date, the occasion and a few references. We reply with availability and a fixed quote. |
| STEP 02 | Planning | We map the shot list, locations and timing together, so the day runs without a hitch. |
| STEP 03 | The Shoot | A relaxed session — gentle direction, and the real moments caught exactly as they happen. |
| STEP 04 | Delivery | Colour-graded and retouched in a private online gallery — ready to download, print and share. |

**Swatches:** Ink `#14110F` · Paper `#F5F2EC` · Bronze `#B0754C` · Clay `#EFEAE0`

**Reel items** (`app.html:991`) — order matters:

| slot | title | cat | ph | src |
|---|---|---|---|---|
| reel1 | The Vows | Wedding · 2026 | Feature frame 01 | u2 |
| reel2 | Golden Hour | Portrait · 2026 | Feature frame 02 | u4 |
| reel3 | First Steps | Family · 2025 | Feature frame 03 | u8 |
| reel4 | Sweet Sixteen | Birthday · 2025 | Feature frame 04 | u1 |
| reel5 | Homecoming | Event · 2025 | Feature frame 05 | u6 |

**Gallery** (`app.html:1035`) — order matters:

| slot | title | cat | ph | src |
|---|---|---|---|---|
| g1 | The Vows | Weddings | Wedding frame | u2 |
| g2 | Golden Hour | Portraits | Portrait | u1 |
| g3 | First Steps | Family | Family frame | u7 |
| g4 | Sweet Sixteen | Birthdays | Birthday frame | u6 |
| g5 | The Toast | Events | Event frame | u8 |
| g6 | Two of Us | Portraits | Couple portrait | u5 |
| g7 | The Reception | Weddings | Wedding frame | u4 |
| g8 | Cake & Confetti | Birthdays | Birthday frame | u3 |
| g9 | Homecoming | Family | Family frame | u2 |

**Categories:** `All`, `Weddings`, `Birthdays`, `Portraits`, `Family`, `Events`

**Marquee terms:** Weddings · Birthdays · Portraits · Family · Graduation · Events — separated by `✳`
in Bronze.

**Stats:** `120+` Shoots delivered · `7 yrs` In the field · `40k` Frames delivered

**Testimonial:** "theemalik pov captured our wedding exactly how it felt — not posed, just us. We
open the gallery and we're right back in the day." — **Amara & Tobi**, *Wedding · Lagos*

---

### Step 7 — Features

#### 7a. `features/gallery-filter`

`useGalleryFilter(items)` holds `filter` state (default `'All'`) and returns the filtered list.

- Predicate: `active === 'All' || item.cat === active`
- **Each rendered figure is keyed `` `${active}-${item.slot}` ``.** The key changes on every filter
  change, forcing React to remount the figures so `animation: riseIn .6s both` replays. **This is
  the entire reason the grid animates on filter change — it must be preserved.**

`FilterChips` renders the six categories via `shared/ui/Chip`.

Chip styling — Space Mono `11px`, `ls .16em`, uppercase, `padding:10px 18px`, `border-radius:100px`,
`cursor:pointer`, `transition:all .25s`, `border:1px solid`:

| State | border | background | color |
|---|---|---|---|
| active | `#14110F` | `#14110F` | `#F5F2EC` |
| inactive | `rgba(20,17,15,.22)` | transparent | `#4A453D` |

#### 7b. `features/reel-carousel`

`useReelCarousel(count)` holds the active index and autoplay.

- Autoplay: advance `(reel + 1) % 5` every **3800 ms**.
- `goReel(i)` sets the index **and restarts the timer** — clicking a dot resets the countdown. This
  behaviour must survive the port.
- Clear the interval on unmount.

**`geometry.ts`** — per-slide transform from **circular** distance with wrap-around:

```ts
let d = i - active
if (d >  n / 2) d -= n
if (d < -n / 2) d += n
const abs = Math.abs(d)

translateX     : d * 64            // percent
scale          : abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6
rotateY        : d === 0 ? 0 : d > 0 ? -34 : 34      // degrees
opacity        : abs  >  2 ? 0 : abs === 0 ? 1 : abs === 1 ? 0.9 : 0.5
zIndex         : 20 - abs
cursor         : abs === 0 ? 'default' : 'pointer'
pointerEvents  : abs  >  2 ? 'none' : 'auto'
scrimOpacity   : abs === 0 ? 0 : abs === 1 ? 0.3 : 0.55
```

Full transform string:
`translate(-50%,-50%) translateX(<tx>%) scale(<scale>) rotateY(<rot>deg)`

Transitions: `transform .7s cubic-bezier(.2,.7,.2,1), opacity .6s ease`; scrim `background .6s ease`.

> **These values must be applied as an inline `style` prop, never as a template-literal class
> name.** Tailwind's scanner cannot see dynamically constructed class strings and would emit no CSS
> for them. The same applies to the dot widths and the scrim opacity.

---

### Step 8 — Widgets

Build in DOM order. Universal: horizontal padding is `clamp(20px,5vw,72px)` (the `gutter` token).

#### 8.1 `Header` (`app.html:636`)

`sticky top-0 z-50`, flex, `justify-between`, `align-items:center`,
`padding:18px <gutter>`, `background:rgba(245,242,236,.82)`, `backdrop-filter:blur(14px)`,
`border-bottom:1px solid rgba(20,17,15,.1)`.

- Wordmark → `#top`: "theemalik" Cormorant 600 `26px` `ls .12em`; "pov" Space Mono `10px`
  `ls .34em` `#857C72` uppercase. Row is `flex items-baseline gap-[12px]`.
- Nav: `gap:clamp(18px,3vw,40px)`. Links Work / Studio / Services / System — `13px`, `ls .04em`,
  `#3A352E`, targeting `#work` `#studio` `#services` `#system`.
- CTA → `#contact`: "Book a session", solid pill, `12px`, `ls .12em`, uppercase,
  `padding:11px 20px`, `radius:100px`; hover `background:#B0754C`, `color:#14110F`.

Render as `<header>`; the nav as `<nav>`.

#### 8.2 `Hero` (`app.html:650`) — `id="top"`

Section padding `clamp(40px,6vw,86px) <gutter> clamp(30px,4vw,56px)`.
Grid `1.05fr .95fr`, `gap:clamp(24px,4vw,64px)`, `align-items:end`, `max-width:1400px`, centred.

Left column:
- Eyebrow: `SectionLabel`, `margin-bottom:26px`, `animation:fadeUp .7s both`.
- `h1` Cormorant 500 `clamp(46px,7.4vw,112px)`, `line-height:.94`, `ls -.02em`,
  `animation:fadeUp .8s .05s both`:
  `Your `*moments*`,` / `framed to` / `last a lifetime.` — "moments" is italic `#8F5A35`, with
  explicit `<br>` breaks after "moments," and "framed to".
- Paragraph `max-width:460px`, `margin-top:30px`, `16px`, `lh 1.7`, `#4A453D`,
  `animation:fadeUp .8s .15s both`:
  "theemalik pov is a photography studio for people and the moments that matter — weddings,
  birthdays, portraits and every shoot in between, captured with warmth and delivered ready to
  share."
- Buttons `gap:14px`, `margin-top:34px`, `flex-wrap`, `animation:fadeUp .8s .25s both`:
  - **"View the work →"** → `#work`, solid: `#14110F`/`#F5F2EC`, `13px`, `ls .1em`, uppercase,
    `padding:15px 26px`, `radius:100px`; hover `#B0754C`/`#14110F`.
  - **"What we shoot"** → `#services`, outline: `border:1px solid rgba(20,17,15,.28)`, `#14110F`;
    hover `border-color:#14110F`, `background:#14110F`, `color:#F5F2EC`.

Right column — `position:relative`, `animation:riseIn 1s .1s both`:
- Main frame: `width:100%`, `aspect-ratio:4/5`, `radius:6px`, `overflow:hidden`, image **u1**.
- Inset frame: `position:absolute`, `left:-42px`, `bottom:44px`, `width:38%`, `aspect-ratio:1/1`,
  `border:8px solid #F5F2EC`, `radius:6px`, `overflow:hidden`,
  `box-shadow:0 24px 60px rgba(20,17,15,.22)`, image **u7**.
- Pill: `position:absolute`, `top:18px`, `right:18px`, Space Mono `10px`, `ls .2em`, `#F5F2EC`,
  `background:rgba(20,17,15,.5)`, `backdrop-filter:blur(4px)`, `padding:7px 12px`,
  `radius:100px` — text `EST. 2019 · WORLDWIDE`.

Scroll cue: centred, `gap:10px`, `margin-top:clamp(30px,4vw,58px)`, `#857C72`. "Scroll" in Space
Mono `10px` `ls .28em` uppercase, then `↓` with `animation:bob 1.8s ease-in-out infinite`.

#### 8.3 `Marquee` (`app.html:686`)

`border-top` / `border-bottom` `1px solid rgba(20,17,15,.12)`, `padding:20px 0`,
`overflow:hidden`, `background:#EFEAE0`.

Track: `display:flex`, `width:max-content`, `animation:marquee 34s linear infinite`. **Two identical
groups** — the second carries `aria-hidden="true"`. Each group: `flex`, `gap:56px`,
`padding-right:56px`, Cormorant `30px` italic `#8A8178`, `white-space:nowrap`, with `✳` separators
in `#B0754C` (including a trailing separator).

> Both groups must be identical in width or the `translateX(-50%)` loop will not be seamless.

#### 8.4 `Studio` (`app.html:698`) — `id="studio"`

Padding `clamp(56px,8vw,130px) <gutter>`, `max-width:1400px`, centred.
Grid `.9fr 1.1fr`, `gap:clamp(28px,5vw,80px)`, `align-items:center`.

Left (`data-reveal`): grid `1fr 1fr`, `gap:16px`. Image 1 **u5** `aspect-ratio:3/4`, `radius:6px`,
`margin-top:40px`. Image 2 **u7** same, no offset.

Right (`data-reveal`):
- `SectionLabel` "The Studio", `margin-bottom:26px`.
- `h2` Cormorant 500 `clamp(30px,4vw,58px)`, `lh 1.05`, `ls -.01em`: "We don't just take
  photographs. We keep the *moment* exactly as it felt." — "moment" italic `#8F5A35`.
- Paragraph `margin-top:26px`, `16px`, `lh 1.8`, `#4A453D`, `max-width:560px`: "Founded in 2019,
  theemalik pov is the studio people call for the days worth remembering — weddings, birthdays,
  portraits and family sessions. Every frame is gently directed, colour-graded and delivered in a
  private gallery, ready to print and share."
- Stats: grid `repeat(3,1fr)`, `gap:24px`, `margin-top:44px`, `padding-top:32px`,
  `border-top:1px solid rgba(20,17,15,.14)`. Value Cormorant `44px` `lh 1` `#14110F`; label Space
  Mono `11px` `ls .12em` `#857C72` `margin-top:8px` uppercase. Use `shared/ui/Stat`.

#### 8.5 `Reel` (`app.html:734`) — `id="motion"`

`background:#14110F`, `color:#F5F2EC`, padding `clamp(56px,8vw,120px) <gutter>`,
inner `max-width:1500px`.

Header: centred, `margin-bottom:clamp(28px,4vw,52px)`. `SectionLabel` "In Motion" centred, dark
tone, `margin-bottom:18px`. `h2` Cormorant 500 `clamp(34px,5vw,72px)` `lh 1` `ls -.01em` — "The Reel".

Stage: `position:relative`, `width:100%`, `height:clamp(440px,66vh,620px)`, `perspective:1800px`,
`overflow:hidden`.

- Progress track: `absolute`, `left:0 right:0 top:0`, `height:3px`, `z-index:20`,
  `background:rgba(245,242,236,.12)`. Bar: `height:100%`, `max-width:1500px`, centred,
  `background:#B0754C`, `animation:grow 3.8s linear both`, **keyed `` `reel-${active}` ``** so it
  refills on each slide.
- Slides: `absolute`, `top:50% left:50%`, `width:clamp(230px,30vw,368px)`, `aspect-ratio:3/4`, plus
  the computed geometry from Step 7b. Inner: `radius:10px`, `overflow:hidden`, `background:#0A0908`,
  `box-shadow:0 30px 70px rgba(0,0,0,.5)`. Scrim: `absolute inset-0`,
  `background:rgba(10,9,8,<scrimOpacity>)`, `pointer-events:none`.

Caption block: column, centred, `gap:18px`, `margin-top:clamp(24px,3vw,40px)`. Inner **keyed
`` `reel-${active}` ``**, `animation:fadeUp .6s both`:
- `● Now Showing` — Space Mono `10px` `ls .28em` uppercase `#8A8178`, `margin-bottom:8px`.
- Title Cormorant `clamp(26px,3.4vw,44px)` `lh 1` `#F5F2EC`; category Space Mono `11px` `ls .16em`
  uppercase `#C8955F`. Row `flex items-baseline gap-[14px] justify-center flex-wrap`.

Dots: `flex gap-[10px]`. Each a `<button>` with `aria-label="Show frame"`, `height:12px`,
`radius:100px`, `border:none`, `padding:0`, `cursor:pointer`, `transition:all .4s`; active
`width:34px` `background:#B0754C`, inactive `width:12px` `background:rgba(245,242,236,.25)`.

> The `3.8s` bar animation is coupled to the `3800ms` interval. **Change one and the other must
> change with it.**

#### 8.6 `Services` (`app.html:777`) — `id="services"`

`background:#F5F2EC`, padding `clamp(56px,8vw,130px) <gutter>`, inner `max-width:1400px`.

Header (`data-reveal`): `flex`, `flex-wrap`, `justify-between`, `align-items:flex-end`, `gap:24px`,
`margin-bottom:clamp(36px,5vw,72px)`. `SectionLabel` "What we shoot" `margin-bottom:22px`; `h2`
Cormorant 500 `clamp(30px,4.4vw,64px)` `lh 1` `ls -.01em` — "Every shoot, covered". Trailing
paragraph `max-width:360px`, `15px`, `lh 1.7`, `#4A453D`: "From a quiet portrait to a full wedding
day — planned, shot and delivered with care, whatever the occasion."

Rows container: `border-top:1px solid rgba(20,17,15,.16)`.

Each row (`data-reveal`): grid `64px minmax(180px,1fr) 1.5fr 150px`, `gap:clamp(14px,3vw,48px)`,
`align-items:center`, `padding:clamp(20px,2.6vw,34px) 0`,
`border-bottom:1px solid rgba(20,17,15,.12)`, hover `background:rgba(20,17,15,.03)`.

Cells: `no` Space Mono `13px` `#8F5A35` · `h3` Cormorant 500 `clamp(24px,2.6vw,38px)` `lh 1.05` ·
`desc` `14px` `lh 1.7` `#4A453D` `max-width:420px` · `tag` Space Mono `11px` `ls .14em` `#8F5A35`
`white-space:nowrap` uppercase `text-align:right`.

#### 8.7 `Gallery` (`app.html:803`) — `id="work"`

Padding `clamp(56px,8vw,120px) <gutter>`, `max-width:1500px`, centred.

Header (`data-reveal`): centred, `margin-bottom:clamp(28px,4vw,54px)`. `SectionLabel` "Selected
Work" centred, `margin-bottom:22px`. `h2` Cormorant 500 `clamp(34px,5vw,72px)` `lh 1` `ls -.01em` —
"The Media Library".

Chips row: `flex`, `flex-wrap`, `gap:10px`, `justify-content:center`,
`margin-bottom:clamp(28px,4vw,48px)`.

Grid: `repeat(auto-fill, minmax(min(100%,290px), 1fr))`, `gap:clamp(12px,1.4vw,20px)`.

Each `<figure>` — **keyed `` `${active}-${slot}` ``**: `position:relative`, `aspect-ratio:4/5`,
`radius:6px`, `overflow:hidden`, `background:#DED7CA`, `animation:riseIn .6s both`,
`cursor:pointer`, `transition:box-shadow .4s, transform .4s`; hover
`box-shadow:0 26px 55px rgba(20,17,15,.32)` + `transform:translateY(-6px)`.

`<figcaption>`: `absolute`, `left:0 right:0 bottom:0`, `flex`, `justify-between`,
`align-items:flex-end`, `padding:16px`,
`background:linear-gradient(to top, rgba(20,17,15,.72), transparent)`, `color:#F5F2EC`,
**`pointer-events:none`**. Title Cormorant `20px`; category Space Mono `10px` `ls .16em` uppercase
`#E6C9A6`.

#### 8.8 `Process` (`app.html:833`)

`background:#EFEAE0`, padding `clamp(56px,8vw,120px) <gutter>`, inner `max-width:1400px`.

`h2` (`data-reveal`) Cormorant 500 `clamp(30px,4.4vw,60px)` `lh 1` `ls -.01em`, centred,
`margin-bottom:clamp(36px,5vw,72px)` — "How a shoot comes together".

Grid `repeat(auto-fit, minmax(220px,1fr))`, `gap:clamp(20px,3vw,48px)`.

Each step (`data-reveal`): `no` Space Mono `12px` `#8F5A35` `ls .2em`; divider `height:1px`
`background:rgba(20,17,15,.2)` `margin:16px 0 22px`; `h3` Cormorant 500 `26px`
`margin-bottom:12px`; `p` `14px` `lh 1.7` `#4A453D`.

#### 8.9 `Testimonial` (`app.html:850`)

Padding `clamp(60px,9vw,140px) <gutter>`, `max-width:1000px`, centred, `text-align:center`.

- Quote mark `“` — Cormorant `80px` `#B0754C`, `line-height:0`, `display:block`, `height:40px`.
- `<blockquote>` (`data-reveal`) Cormorant **400** `clamp(26px,3.6vw,46px)` `lh 1.25` `ls -.01em`
  `#14110F`.
- Attribution `margin-top:34px`, `flex`, `align-items:center`, `gap:14px`, centred. Avatar
  `46×46`, `radius:100px`, `overflow:hidden`, `shape="circle"`, image **u7**. Name "Amara & Tobi"
  `14px` weight 600; meta "Wedding · Lagos" Space Mono `11px` `#857C72` `ls .06em`. The text block
  is `text-align:left`.

#### 8.10 `BrandSystem` (`app.html:865`) — `id="system"`

`background:#14110F`, `color:#F5F2EC`, padding `clamp(56px,8vw,120px) <gutter>`, inner
`max-width:1400px`.

`SectionLabel` "Brand System" (dark tone, not centred), `margin-bottom:22px`. `h2` (`data-reveal`)
Cormorant 500 `clamp(30px,4.4vw,60px)` `lh 1` `ls -.01em`, `max-width:800px` — "The kit every page
is built from — so the brand stays consistent everywhere."

Grid `1fr 1fr`, `gap:clamp(28px,4vw,64px)`, `margin-top:clamp(40px,5vw,72px)`.

Column headings — Space Mono `11px` `ls .2em` `#8A8178` uppercase `margin-bottom:20px`:
`01 · Palette`, `02 · Typography`, `03 · Components`.

**Palette** (`data-reveal`): grid `repeat(2,1fr)` `gap:14px`. Each swatch
`border:1px solid rgba(245,242,236,.14)`, `radius:8px`, `overflow:hidden`; colour block
`height:96px`; row `padding:12px 14px` `flex justify-between items-center`; name `13px`, hex Space
Mono `11px` `#8A8178`.

**Typography** (`data-reveal`): column, `gap:22px`. Items 1 and 2 carry
`border-bottom:1px solid rgba(245,242,236,.14)` and `padding-bottom:20px`; item 3 has none.

| Sample | Caption (Space Mono `11px` `#8A8178`) |
|---|---|
| `Aa Bb Cc` — Cormorant `52px` `lh 1` | Cormorant Garamond · Display / Headlines *(margin-top 8px)* |
| `The quick studio moves light.` — Manrope `26px` weight 500 | Manrope · Body / Interface *(margin-top 10px)* |
| `LABEL · META · 2026` — Space Mono `16px` `ls .14em` | Space Mono · Labels / Meta *(margin-top 10px)* |

**Components** (`data-reveal`, `margin-top:clamp(36px,4vw,56px)`): `flex`, `flex-wrap`, `gap:16px`,
`align-items:center`:

- `Primary` — `background:#B0754C`, `color:#14110F`, `13px`, `ls .1em`, uppercase,
  `padding:14px 26px`, `radius:100px`
- `Outline` — `border:1px solid rgba(245,242,236,.4)`, `color:#F5F2EC`, same metrics
- `Chip · tag` — `background:rgba(245,242,236,.08)`, `#F5F2EC`, Space Mono `11px`, `ls .16em`,
  `padding:9px 16px`, `radius:100px`, uppercase
- `Section label` — inline-flex, `gap:10px`, `13px`, `#C8955F`, preceded by a `26px × 1px`
  `#B0754C` rule

> These are static showcase swatches. Render them with the real `Button` / `Chip` / `SectionLabel`
> primitives where the metrics match, so the showcase stays honest.

#### 8.11 `Contact` (`app.html:920`) — `id="contact"`

`position:relative`, padding `clamp(70px,10vw,150px) <gutter>`, `text-align:center`,
`background:#F5F2EC`. Inner (`data-reveal`) `max-width:900px`, centred.

- Eyebrow Space Mono `11px` `ls .32em` uppercase `#8F5A35` `margin-bottom:24px` — "Let's make
  something worth looking at".
- `h2` Cormorant 500 `clamp(40px,7vw,104px)` `lh .98` `ls -.02em` — "Book the *studio*", where
  "studio" is italic `#8F5A35`.
- Paragraph `margin:28px auto 0`, `max-width:520px`, `16px`, `lh 1.7`, `#4A453D`: "Tell us about
  your shoot — the date, the occasion and the people. We reply within two working days with
  availability and a tailored quote."
- Buttons `flex-wrap`, `gap:16px`, centred, `margin-top:40px`, both `14px` `ls .08em` uppercase
  `padding:17px 34px` `radius:100px`:
  - `mailto:hello@theemalikpov.com` — solid `#14110F`/`#F5F2EC`; hover `#B0754C`/`#14110F`
  - `tel:+10000000000` — outline `border:1px solid rgba(20,17,15,.28)`, `#14110F`; hover
    `border-color:#14110F`. Label `+1 (000) 000 0000`

#### 8.12 `Footer` (`app.html:934`)

`background:#14110F`, `color:#F5F2EC`, padding `clamp(48px,6vw,88px) <gutter> 40px`, inner
`max-width:1400px`.

Top grid `1.4fr 1fr 1fr`, `gap:40px`, `padding-bottom:52px`,
`border-bottom:1px solid rgba(245,242,236,.14)`.

- **Brand:** wordmark row `flex items-baseline gap-[12px]` — "theemalik" Cormorant 600 `34px`
  `ls .12em`; "pov" Space Mono `10px` `ls .34em` `#8A8178` uppercase. Blurb `margin-top:20px`,
  `max-width:340px`, `15px`, `lh 1.7`, `#B8B1A6`: "A photography studio for people, moments and
  every shoot worth remembering. Available worldwide."
- **Explore:** heading Space Mono `11px` `ls .2em` `#8A8178` uppercase `margin-bottom:20px`. Links
  column `gap:12px`, `#E6E1D7`, `14px`, hover `#B0754C`: Work → `#work`, Studio → `#studio`,
  Services → `#services`, Contact → `#contact`.
- **Follow:** same heading style. `Instagram · @theemalik_pov ↗` →
  `https://www.instagram.com/theemalik_pov/` with `target="_blank" rel="noopener"`; then
  `Behance ↗`, `Vimeo ↗`, `Pinterest ↗` — all three `href="#"` (**carried over verbatim per user
  decision**).

Bottom row: `flex`, `flex-wrap`, `justify-between`, `gap:14px`, `padding-top:26px`, Space Mono
`11px`, `ls .08em`, `#8A8178`. Left `© 2026 theemalik pov. All rights reserved.` Right
`Crafted with light · Contract proposal POC` (**verbatim, per user decision**).

---

### Step 9 — Page + app shell

`pages/home/HomePage.tsx` composes the 12 widgets in DOM order, holds the root `ref`, and calls
`useIntersectionReveal(rootRef)` once. Root element carries `font-family:Manrope`,
`background:#F5F2EC`, `color:#14110F`, `overflow-x:hidden`.

`app/App.tsx` renders `<HomePage />`.

`index.html` — set `<title>theemalik pov — Photography Studio</title>` (the bundle's title is
literally "Bundled Page"), `lang="en"`, add the font `preconnect` + stylesheet links, and a
`<meta name="description">`.

Use semantic landmarks: `<header>`, `<main>` wrapping sections 2–11, `<footer>`. Give every
`ImageSlot` real `alt` text derived from its title, and add visible `focus-visible` states to the
chips, dots and buttons.

---

### Step 10 — Responsive collapse (the one approved deviation)

The source has **zero `@media` queries** and eight layouts hard-locked to desktop columns. Add
breakpoints that **only** change behaviour below `lg`:

| Section | Source | Ported |
|---|---|---|
| Hero | `1.05fr .95fr` | `grid-cols-1 lg:grid-cols-[1.05fr_.95fr]` |
| Studio | `.9fr 1.1fr` | `grid-cols-1 lg:grid-cols-[.9fr_1.1fr]` |
| Studio image pair | `1fr 1fr` | `grid-cols-2` (already fine) |
| Stats | `repeat(3,1fr)` | `grid-cols-3` (already fine) |
| Services row | `64px minmax(180px,1fr) 1.5fr 150px` | `grid-cols-1 gap-3 md:grid-cols-[64px_1fr] lg:grid-cols-[64px_minmax(180px,1fr)_1.5fr_150px]` |
| Brand System | `1fr 1fr` | `grid-cols-1 lg:grid-cols-2` |
| Palette | `repeat(2,1fr)` | `grid-cols-2` (already fine) |
| Footer | `1.4fr 1fr 1fr` | `grid-cols-1 md:grid-cols-3` |

Gallery (`auto-fill`) and Process (`auto-fit`) already reflow naturally — leave them alone.

When the Services row collapses below `lg`, drop the `text-align:right` on the tag so it aligns left
with the rest of the stacked content.

> **Rule: at `lg` and above the rendering must match the source exactly.** Breakpoints may only
> *add* behaviour below `lg`.

---

## 7. Edge cases & gotchas

1. **Dynamic values must be inline styles, not class names.** Tailwind's JIT scanner only sees
   literal class strings in source. Any computed value — reel transforms, scrim opacity, dot width,
   swatch background — must go through the `style` prop.
2. **`baseUrl` is deprecated** and fails the build with `TS5101`. Use `paths` alone.
3. **`erasableSyntaxOnly: true`** bans TypeScript enums and constructor parameter properties. Use
   string union types.
4. **`verbatimModuleSyntax: true`** requires `import type { … }` for type-only imports. Mixing a
   type into a value import will fail the build.
5. **`noUnusedLocals` / `noUnusedParameters` are on.** Unused imports break `npm run build`.
6. **The `key` remount trick is load-bearing in two places** — the gallery figures and the reel
   progress bar/caption. Removing or stabilising those keys silently kills the animations without
   any error.
7. **Reel timing is coupled:** the `grow` animation is `3.8s` and the interval is `3800ms`.
8. **Reveal must not re-run on filter change.** It is a mount-once effect. Gallery figures are not
   `data-reveal` (they use `riseIn` instead), so there is no interaction between the two systems —
   keep it that way.
9. **Keep the double `requestAnimationFrame`** in the reveal setup, or elements already in view on
   load will flash visible before being hidden.
10. **Marquee seamlessness** depends on the two track groups being identical.
11. **`figcaption` needs `pointer-events:none`** or it will swallow hover on the gallery cards.
12. **8 images cover 17 slots** — u2 appears 3×, u7 appears 4×. This repetition is faithful to the
    source, not a mistake to "fix".
13. **`overflow-x:hidden`** on the root is required — the hero inset is deliberately positioned at
    `left:-42px` and would otherwise create a horizontal scrollbar.
14. Do **not** create `tailwind.config.js` or `postcss.config.js`. Tailwind v4 is CSS-first.

---

## 8. Verification

### 8.1 Mechanical

```bash
npm run build     # runs `tsc -b` (type + strict clean) then `vite build`
npx oxlint        # scaffold's linter
npm run dev       # dev server
```

All three must pass with no errors.

### 8.2 Visual fidelity — the primary gate

The original bundle **renders standalone in a browser**:

```bash
open "/Users/owoeyesamuel/Downloads/theemalik pov (standalone).html"
```

Open it beside `npm run dev` at a viewport **≥1440px** and compare section by section against the
12 widget specs in Step 8. At `lg` and above there must be no visible difference in layout, type size,
colour, spacing or shadow.

### 8.3 Behavioural checklist

- [ ] Reel autoplays, advancing every ~3.8s, and wraps 5 → 1.
- [ ] Clicking a dot jumps to that slide **and restarts the countdown**.
- [ ] The progress bar refills from zero on every slide change.
- [ ] Side slides are rotated, scaled and scrimmed; slides more than 2 away are invisible and
      non-interactive.
- [ ] Changing a gallery filter **re-runs the `riseIn` animation** on the grid.
- [ ] Filter chips show the correct active/inactive styling.
- [ ] Scroll-reveal elements fade up once, with a visible stagger between siblings, and never
      re-hide on scroll back.
- [ ] No reveal flash on initial load.
- [ ] Marquee scrolls continuously with no visible seam.
- [ ] All nav and footer anchors scroll smoothly to their sections.
- [ ] Gallery cards lift on hover; the caption does not block the hover.
- [ ] `mailto:` and `tel:` links resolve.

### 8.4 Responsive

- [ ] At ≥`lg`, rendering is identical to the source.
- [ ] Below `lg`, the 8 layouts in Step 10 collapse without squashing or overflow.
- [ ] No horizontal scrollbar at any width (watch the hero inset and the marquee).

### 8.5 Performance

- [ ] Network panel shows Cloudinary serving WebP/AVIF, not PNG.
- [ ] Total image weight is well under 1 MB (raw PNGs would be ~11 MB).
- [ ] No raw `res.cloudinary.com` URL appears in any component — all go through `cloudinaryUrl()`.

---

## 9. Out of scope

- **Testing.** No framework is installed by this plan. RPI Stage 4
  (`/unit-test-implementation`) settles Vitest + React Testing Library.
- **Deployment.** Target unspecified.
- **Favicon.** None supplied; the scaffold's default `favicon.svg` stays unless the user provides one.
- **Committing.** `/implement-task` stops before any commit.
