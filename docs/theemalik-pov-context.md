# theemalik pov — Context (RPI Stage 1)

**Feature name:** `theemalik-pov`
**Target app directory:** `/Users/owoeyesamuel/Desktop/others/theemalik_pov`
**Date:** 2026-08-18
**Status:** Research complete — approved by user. No source files modified; no app code written yet.

---

## 1. Resources studied

| # | Resource | Type | How it was used |
|---|---|---|---|
| 1 | `/Users/owoeyesamuel/Downloads/theemalik pov (standalone).html` (15,719,616 bytes, 400 lines) | Local file | **DIRECT SUBJECT — source of truth.** Every layout value, copy string, colour, animation and behaviour in the target is transcribed from this file. |
| 2 | dc-runtime / omelette starter / bundler wrapper *(embedded inside #1)* | Local file (decoded) | **DELIVERY MECHANISM ONLY — explicitly NOT ported.** Studied to understand semantics so they can be translated to React, then discarded. |
| 3 | 8 Cloudinary URLs supplied by the user | External URLs | **SUBJECT.** Verified live (HTTP 200) and byte-identical to the images embedded in #1. Replace the embedded assets entirely. |
| 4 | "create a robust react application using a FSD and re-usable component architecture; Implement just as it is in the resource. The shared resource is the source of truth." | Free text | **THE GOAL**, not a resource to resolve. |

### 1.1 How to regenerate the decoded source

Resource #1 is a bundle, not a readable page: line 386 is a single 15.6 MB JSON asset manifest and
line 398 is the JSON-encoded real document. Everything cited in this file as `app.html:N` refers to
the **decoded** document. Regenerate it deterministically with:

```bash
node -e "const fs=require('fs');\
const l=fs.readFileSync('/Users/owoeyesamuel/Downloads/theemalik pov (standalone).html','utf8').split('\n');\
fs.writeFileSync('app.html',JSON.parse(l[397]))"
```

Produces `app.html` — 1141 lines, 59,522 bytes (59,432 characters). Line map:

| Lines | Contents |
|---|---|
| 1–16 | `<head>`, dc-runtime `<script src>` |
| 17–20 | `<x-dc>` / `<helmet>` open, Google Fonts preconnect |
| 21–615 | `<style>` — 66 `@font-face` rules (Google Fonts, 6 unicode subsets) |
| 616 | omelette starter `<script src>` (provides `<image-slot>`) |
| 617–630 | `<style>` — global reset, `a`/`::selection`, 5 `@keyframes` |
| 635–971 | **Page markup** — the 12 sections |
| 972–1139 | **`<script type="text/x-dc">`** — the `DCLogic` component (state, data, behaviour) |

The 9 embedded images were extracted to `~/Desktop/theemalik_pov_images/` and uploaded to Cloudinary
by the user. That folder is now redundant and may be deleted.

---

## 2. Clarified intent / target

Rebuild the page in resource #1 as a **production React application** — Vite + TypeScript + Tailwind
CSS, organised by **Feature-Sliced Design** with reusable components — that renders **identically to
the source at desktop widths**.

The source is the source of truth for *what the page is*. It is **not** a source of truth for *how
the code is organised*: its markup is one flat 336-line block of inline styles driven by a
proprietary template runtime. "Implement just as it is" is therefore read as **visual and behavioural
fidelity**, not structural transcription.

### 2.1 Decisions locked with the user

| Decision | Choice | Notes |
|---|---|---|
| Styling | **Tailwind CSS** | Custom theme carries the 4 brand colours + 3 font families. `style-hover` → `hover:` variants. |
| Tooling | **Vite + TypeScript** | Types make FSD layer boundaries enforceable. |
| Images | **Cloudinary** | Via a `cloudinaryUrl()` helper injecting `f_auto,q_auto,w_*` — not hardcoded raw URLs. |
| Routing | **None** — single page | Native hash-anchor scrolling preserved. `pages/` holds one `HomePage`. |
| Responsive | **Add breakpoints** | The one deliberate deviation from the source. See §5.1. |

---

## 3. Summary / base state

### 3.1 What exists today

Nothing. `/Users/owoeyesamuel/Desktop/others` is **not a git repository** and contains only unrelated
projects (`credpal`, `portfolio`, `rentfree-api`, `rentfree-ui`, `taxtech`, …). `theemalik_pov/` is a
greenfield directory created solely to hold this document. **This is a from-scratch build.**

### 3.2 What the source page is

A single-page marketing site for **theemalik pov**, a photography studio — founded 2019, based in
Lagos, Instagram `@theemalik_pov`, contactable at `hello@theemalikpov.com`. It sells weddings,
birthdays, portraits, family/maternity and event coverage. Twelve sections in DOM order:

| # | Section | Anchor | `app.html` | Notes |
|---|---|---|---|---|
| 1 | Nav / header | — | 636 | Sticky, `z-50`, translucent `rgba(245,242,236,.82)` + `blur(14px)` |
| 2 | Hero | `#top` | 650 | 2-col; big frame + overlapping inset + "EST. 2019 · WORLDWIDE" pill |
| 3 | Marquee | — | 686 | Infinite scroll, 34s, duplicated track (2nd `aria-hidden`) |
| 4 | Studio / About | `#studio` | 698 | 2-col; offset image pair + 3 stats |
| 5 | The Reel | `#motion` | 734 | Dark section; 3D carousel + progress bar + dots |
| 6 | Services | `#services` | 777 | 5 rows, 4-col grid, hover tint |
| 7 | Gallery | `#work` | 803 | "The Media Library" — filter chips + `auto-fill` grid |
| 8 | Process | — | 833 | 4 steps, `auto-fit` grid |
| 9 | Testimonial | — | 850 | Pull quote + circular avatar |
| 10 | Brand System | `#system` | 865 | Palette / Typography / Components showcase |
| 11 | Contact CTA | `#contact` | 920 | "Book the *studio*" + email/phone buttons |
| 12 | Footer | — | 934 | 3-col; brand blurb, Explore links, Follow links |

Nav links: Work, Studio, Services, System + "Book a session" CTA → `#contact`.

---

## 4. Key components & how they work

### 4.1 Application state — only two values

`app.html:974` — `state = { filter: 'All', reel: 0 }`. **Everything else on the page is static
content.** Both belong in `features/`, not global state; no state manager is warranted.

### 4.2 Gallery filter (`features/gallery-filter`)

- Categories (`app.html:1047`): `All`, `Weddings`, `Birthdays`, `Portraits`, `Family`, `Events`.
- Filter predicate (`app.html:1097`): `active === 'All' || g.cat === active`.
- **Animation-replay trick:** each item is keyed `` `${active}-${g.slot}` `` (`app.html:1099`). The
  key changes on every filter change, forcing React to remount the figures so the `riseIn .6s`
  animation replays. **This must be preserved** — it is the entire reason the grid animates on
  filter change.
- Chip styling (`app.html:1085`): active → `bg #14110F`, `color #F5F2EC`, `border #14110F`;
  inactive → transparent, `color #4A453D`, `border rgba(20,17,15,.22)`. `transition: all .25s`.
- Grid: `repeat(auto-fill, minmax(min(100%,290px), 1fr))`, gap `clamp(12px,1.4vw,20px)`.
- Cards: `aspect-ratio 4/5`, radius 6px, hover → `translateY(-6px)` +
  `box-shadow 0 26px 55px rgba(20,17,15,.32)`, `transition .4s`. Caption is a
  `linear-gradient(to top, rgba(20,17,15,.72), transparent)` overlay with `pointer-events:none`.

### 4.3 Reel carousel (`features/reel-carousel`)

Autoplay (`app.html:999`): `setInterval` advancing `(reel + 1) % 5` every **3800 ms**.
`goReel(i)` (`app.html:1006`) sets the index **and restarts the timer**. Cleanup on unmount
(`app.html:1011`) — in React this becomes a `useEffect` cleanup; the restart-on-click behaviour must
survive the port.

Per-slide geometry (`app.html:1104`), computed from **circular** distance with wrap-around:

```
d = i - active
if (d >  n/2) d -= n
if (d < -n/2) d += n
abs = |d|

translateX : d * 64 %
scale      : abs===0 ? 1    : abs===1 ? 0.78 : 0.6
rotateY    : d===0   ? 0    : d>0 ? -34deg   : 34deg
opacity    : abs>2   ? 0    : abs===0 ? 1 : abs===1 ? 0.9 : 0.5
z-index    : 20 - abs
cursor     : abs===0 ? default : pointer
pointer-events : abs>2 ? none : auto
scrim opacity  : abs===0 ? 0 : abs===1 ? 0.3 : 0.55
```

Full transform: `translate(-50%,-50%) translateX(<tx>%) scale(<scale>) rotateY(<rot>deg)`.
Transitions: `transform .7s cubic-bezier(.2,.7,.2,1)`, `opacity .6s ease`, scrim `background .6s ease`.
Stage: `perspective: 1800px`, height `clamp(440px,66vh,620px)`, slides `clamp(230px,30vw,368px)` at
`aspect-ratio 3/4`.

Progress bar + caption are keyed `` `reel-${active}` `` (`app.html:1130`) so the `grow 3.8s linear`
and `fadeUp .6s` animations restart each slide — same remount trick as the gallery. The bar's 3.8s
duration is coupled to the 3800 ms interval; **change one and the other must change with it.**

Dots (`app.html:1118`): active `34px` wide + `#B0754C`; inactive `12px` + `rgba(245,242,236,.25)`;
height 12px, `transition: all .4s`.

### 4.4 Scroll reveal (`shared/lib/useIntersectionReveal` + `shared/ui/RevealOnScroll`)

`app.html:1049` — on mount, every `[data-reveal]` element is set to `opacity:0`,
`translateY(30px)`, `transition: opacity .85s cubic-bezier(.2,.7,.2,1), transform .85s <same>`,
`will-change: opacity, transform`. An `IntersectionObserver` (`threshold: 0.12`,
`rootMargin: '0px 0px -8% 0px'`) then reveals each element **once** (`io.unobserve`).

**Stagger:** delay = `min(indexAmongRevealSiblings, 6) * 90ms` — index is the element's position
among its *parent's* `[data-reveal]` children, capped at 6 (max 540 ms).

Setup runs inside a **double** `requestAnimationFrame` — a deliberate wait for layout to settle. The
React port should keep the equivalent guard so elements already in view on load don't flash.

### 4.5 `<image-slot>` → `shared/ui/ImageSlot`

A custom element from the omelette starter: a fillable placeholder with `id`, `shape`
(`rect` | `circle`), `src` and `placeholder` text, and a `--is-bg: #DED7CA` fallback background.

In React this is a plain presentational component: renders the image `object-fit: cover` filling its
container, shows the `#DED7CA` background (and optionally the placeholder text) when `src` is absent.
**The authoring/upload affordance is a bundler feature and must not be recreated.**

### 4.6 Content data (static — belongs in `shared/config/content.ts`, typed by `entities/`)

**Services** (`app.html:1013`) — `{ no, title, desc, tag }`:

| no | title | tag |
|---|---|---|
| 01 | Weddings | Full day |
| 02 | Birthdays & Parties | Events |
| 03 | Portraits | Studio · Outdoor |
| 04 | Family & Maternity | Sessions |
| 05 | Events & Graduation | Coverage |

**Process steps** (`app.html:1021`) — `{ no, title, desc }`: `STEP 01` Enquiry · `STEP 02` Planning ·
`STEP 03` The Shoot · `STEP 04` Delivery.

**Swatches** (`app.html:1028`) — `{ name, hex }`: Ink `#14110F` · Paper `#F5F2EC` · Bronze `#B0754C`
· Clay `#EFEAE0`.

**Reel items** (`app.html:991`) — `{ slot, title, cat, ph, src }`:

| # | title | cat | image |
|---|---|---|---|
| 1 | The Vows | Wedding · 2026 | 2 |
| 2 | Golden Hour | Portrait · 2026 | 4 |
| 3 | First Steps | Family · 2025 | 8 |
| 4 | Sweet Sixteen | Birthday · 2025 | 1 |
| 5 | Homecoming | Event · 2025 | 6 |

**Gallery** (`app.html:1035`) — `{ slot, title, cat, ph, src }`:

| slot | title | cat | image |
|---|---|---|---|
| g1 | The Vows | Weddings | 2 |
| g2 | Golden Hour | Portraits | 1 |
| g3 | First Steps | Family | 7 |
| g4 | Sweet Sixteen | Birthdays | 6 |
| g5 | The Toast | Events | 8 |
| g6 | Two of Us | Portraits | 5 |
| g7 | The Reception | Weddings | 4 |
| g8 | Cake & Confetti | Birthdays | 3 |
| g9 | Homecoming | Family | 2 |

**Marquee terms:** Weddings · Birthdays · Portraits · Family · Graduation · Events, separated by
`✳` in Bronze.

**Stats:** `120+` Shoots delivered · `7 yrs` In the field · `40k` Frames delivered.

**Testimonial:** "theemalik pov captured our wedding exactly how it felt — not posed, just us. We
open the gallery and we're right back in the day." — **Amara & Tobi**, *Wedding · Lagos*.

---

## 5. Domain rules & constraints

### 5.1 Responsive behaviour — the ONE approved deviation

The source contains **zero `@media` queries** (verified across all 1141 lines). Only two grids
reflow naturally: the gallery (`auto-fill minmax(min(100%,290px),1fr)`) and process
(`auto-fit minmax(220px,1fr)`). **Eight layouts are hard-locked to desktop columns** and squash on
narrow viewports. Approved fix — desktop stays byte-identical, small screens collapse:

| Section | Source | Ported |
|---|---|---|
| Hero | `1.05fr .95fr` | `grid-cols-1 lg:grid-cols-[1.05fr_.95fr]` |
| Studio | `.9fr 1.1fr` | `grid-cols-1 lg:grid-cols-[.9fr_1.1fr]` |
| Studio image pair | `1fr 1fr` | `grid-cols-2` (already fine) |
| Stats | `repeat(3,1fr)` | `grid-cols-3` (already fine) |
| **Services row** | `64px minmax(180px,1fr) 1.5fr 150px` | `grid-cols-1 gap-3 md:grid-cols-[64px_1fr] lg:grid-cols-[64px_minmax(180px,1fr)_1.5fr_150px]` |
| Brand System | `1fr 1fr` | `grid-cols-1 lg:grid-cols-2` |
| Palette | `repeat(2,1fr)` | `grid-cols-2` (already fine) |
| Footer | `1.4fr 1fr 1fr` | `grid-cols-1 md:grid-cols-3` |

**Rule: at `lg` and above the rendering must match the source exactly.** Breakpoints may only
*add* behaviour below `lg`.

### 5.2 Design tokens (named by the source's own Brand System section, `app.html:865`)

| Token | Hex | Role |
|---|---|---|
| Ink | `#14110F` | Dark bg, primary text |
| Paper | `#F5F2EC` | Light bg, text on dark |
| Bronze | `#B0754C` | Accent, rules, active states |
| Clay | `#EFEAE0` | Alt light bg (marquee, process) |

Secondary values in use — **not** in the official palette but required for fidelity: `#8F5A35`
(link/label bronze-dark), `#C8955F` (label bronze on dark), `#4A453D` (body text), `#857C72` /
`#8A8178` (muted), `#3A352E` (nav links), `#E6E1D7` / `#B8B1A6` (footer text), `#DED7CA` (image
placeholder), `#0A0908` (reel slide bg), `#E6C9A6` (gallery caption category).

**Typography:** Cormorant Garamond (display/headlines, weights 400/500/600, italic used for accent
words) · Manrope (body/interface, default `font-family` on the root) · Space Mono (labels/meta,
heavy letter-spacing `.12em`–`.34em`, uppercase).

**Keyframes** (`app.html:617`) — port verbatim into the Tailwind theme:

```css
riseIn : opacity 0, translateY(26px) scale(.985)  ->  none
fadeUp : opacity 0, translateY(18px)              ->  none
marquee: translateX(0)  ->  translateX(-50%)
bob    : translateY(0) / translateY(7px) at 50%
grow   : width 0 -> 100%
```

Global: `html { scroll-behavior: smooth }`, `a { color:#8F5A35 }` / `a:hover { color:#B0754C }`,
`::selection { background:#B0754C; color:#F5F2EC }`, `-webkit-font-smoothing: antialiased`,
`text-rendering: optimizeLegibility`, `overflow-x: hidden` on the root.

### 5.3 Image mapping — RESOLVED

Cloud: `dlyryea3n`. Base: `https://res.cloudinary.com/dlyryea3n/image/upload`.

| # | Cloudinary path | Used as |
|---|---|---|
| 1 | `v1787091064/Screenshot_2026-08-18_at_22.31.35_kmmygs.png` | **Hero big frame**, Reel 04, Gallery g2 |
| 2 | `v1787091106/Screenshot_2026-08-18_at_22.34.09_j8xq9n.png` | Reel 01, Gallery g1, Gallery g9 |
| 3 | `v1787091149/Screenshot_2026-08-18_at_22.34.36_pqei0s.png` | Gallery g8 |
| 4 | `v1787091164/Screenshot_2026-08-18_at_22.35.00_xiiznz.png` | Reel 02, Gallery g7 |
| 5 | `v1787091199/Screenshot_2026-08-18_at_22.35.22_gsokmv.png` | Studio image 1, Gallery g6 |
| 6 | `v1787091241/Screenshot_2026-08-18_at_22.36.22_kzvtna.png` | Reel 05, Gallery g4 |
| 7 | `v1787091250/Screenshot_2026-08-18_at_22.37.08_vivqvs.png` | **Hero small frame**, Studio image 2, Testimonial avatar, Gallery g3 |
| 8 | `v1787091268/Screenshot_2026-08-18_at_22.37.36_vq7zcg.png` | Reel 03, Gallery g5 |

Mapping is confirmed by filename: each Cloudinary public ID preserves the original screenshot
filename hardcoded at `app.html:980`–`987` (`u1` = `Screenshot 2026-08-18 at 22.31.35.png`, …), and
each upload's byte size matches the corresponding asset extracted from the bundle exactly.

**Two source quirks, both settled:**

1. **Latent bug in the original.** `renderVals` computes `heroSub: this.U.u6` (`app.html:1128`) but
   the hero inset markup hardcodes the webp asset id `2bec2e7c-…` instead of binding `{{ heroSub }}`
   — so `heroSub` is dead code and the small webp is what actually rendered. **Per the user's
   instruction the hero inset now uses image 7**, superseding both. The webp is dropped entirely and
   was not uploaded.
2. **8 photos cover 17 slots**, so images repeat under different titles (image 2 appears 3×, image 7
   now 4×). This is faithful to the source, not an extraction error.

### 5.4 Cloudinary delivery — measured

Raw PNG delivery totals **10,983 KB**. Injecting `f_auto,q_auto` makes Cloudinary negotiate
WebP/AVIF from the `Accept` header:

| Variant | Total | Reduction |
|---|---|---|
| raw `.png` | 10,983 KB | — |
| `f_auto,q_auto,w_1200` | **745 KB** | **94%** |
| `f_auto,q_auto,w_600` | **278 KB** | **98%** |

Single-image example: image 7 is 2,295 KB raw → 183 KB at `f_auto,q_auto` → 142 KB at `w_1200` → 59 KB
at `w_600`.

**Constraint:** `shared/config/images.ts` must expose a `cloudinaryUrl(publicId, { w })` helper that
composes the transformation segment. Raw URLs must not be hardcoded into components. Slot widths:
hero ~1200, reel ~800, gallery cards ~600, studio ~800, avatar ~96.

### 5.5 Fonts

The bundle self-hosts 21 woff2 files across 6 unicode subsets, but the source's own `<helmet>`
(`app.html:18`) declares the Google Fonts `preconnect` pair — the self-hosting is a bundler artifact,
not a design decision. Load Cormorant Garamond, Manrope and Space Mono from Google Fonts, limited to
the weights actually used. Latin subsets suffice; the page contains no Cyrillic/Greek/Vietnamese text.

---

## 6. Dependencies & integration points

**Runtime:** `react` + `react-dom` (18.3.1 in the source — 18 or 19 both acceptable; no version-specific
API is used). **No router, no state manager, no animation library, no UI kit** — the source uses none
and needs none.

**Build:** `vite`, `typescript`, `tailwindcss`, `@vitejs/plugin-react`.

**External services:** Cloudinary (`dlyryea3n`) for images, Google Fonts for typefaces. Both are
plain URL fetches — no SDKs, no keys, no server. **The app has no backend, no API calls, no forms
and no data fetching.** Contact is via `mailto:` / `tel:` links only.

**Browser APIs:** `IntersectionObserver` (scroll reveal), `setInterval` (reel), `requestAnimationFrame`
(reveal setup). All need cleanup on unmount.

---

## 7. What carries over vs. what's new

### Carries over verbatim (fidelity-critical)
- All copy, headings, labels and section ordering.
- Every colour, font size (incl. each `clamp()`), spacing, radius, shadow and gradient.
- All 5 keyframe animations and their durations/easings.
- Reel geometry maths, the 3800 ms interval, and the restart-on-click behaviour.
- IntersectionObserver thresholds, the 90 ms capped stagger, and the once-only reveal.
- The `key`-remount trick in both the gallery and the reel.
- Gallery filter categories and predicate.

### New (does not exist in the source)
- The entire FSD structure — the source has no modules, components or files.
- TypeScript entity types: `GalleryItem`, `ReelItem`, `Service`, `ProcessStep`, `Swatch`, `Category`.
- Reusable `shared/ui` primitives: `Button`, `Chip`, `SectionLabel`, `ImageSlot`, `Stat`,
  `RevealOnScroll` — the source repeats these patterns inline with no abstraction.
- Hooks: `useIntersectionReveal`, `useInterval`.
- `cloudinaryUrl()` helper + responsive `srcSet`.
- Responsive breakpoints (§5.1).
- Real accessibility: the source has one `aria-label` ("Show frame") and one `aria-hidden` (marquee
  clone). Needs semantic landmarks, alt text, and focus-visible states.
- A real document title (the bundle's is literally `"Bundled Page"`).

### Explicitly discarded
dc-runtime and all its template syntax (`{{ }}`, `<sc-for>`, `sc-camel-on-click`, `style-hover`,
`key=`, `ref=`); the omelette starter and `<image-slot>`'s authoring behaviour; the bundler wrapper,
its blob/postMessage relay and loading thumbnail; `<x-dc>` / `<helmet>` wrappers; the embedded
base64 assets; the small webp; the dead `heroSub` binding.

### Proposed FSD layout

```
theemalik_pov/
  docs/theemalik-pov-context.md
  src/
    app/       providers, global styles, tokens, entry
    pages/     home/               composes widgets in DOM order
    widgets/   header/ hero/ marquee/ studio/ reel/ services/
               gallery/ process/ testimonial/ brand-system/ contact/ footer/
    features/  gallery-filter/     chips + filter state
               reel-carousel/      autoplay + slide geometry
    entities/  gallery-item/ reel-item/ service/ process-step/ swatch/
    shared/    ui/      Button, Chip, SectionLabel, ImageSlot, Stat, RevealOnScroll
               lib/     useIntersectionReveal, useInterval, cn
               config/  images, content, tokens
```

FSD import rule: a layer may only import from layers below it
(`app → pages → widgets → features → entities → shared`).

---

## 8. Open questions / unknowns

1. **Placeholder contact details.** `+1 (000) 000 0000` is a dummy number, and the Behance / Vimeo /
   Pinterest footer links all point at `#`. Only Instagram (`@theemalik_pov`) and
   `hello@theemalikpov.com` look real. *Assumption: carry them over as-is.*
2. **Footer tagline** reads "Crafted with light · Contract proposal POC" — likely scaffolding from
   the artifact's origin as a client proposal. *Assumption: carry over verbatim; flag for the user.*
3. **Document title / favicon.** The bundle has no real title. *Assumption: use
   "theemalik pov — Photography Studio"; no favicon supplied.*
4. **Copyright year** is hardcoded `© 2026`. *Assumption: keep static.*
5. **Testing.** No framework chosen yet. Vitest + React Testing Library is the natural fit for Vite;
   `/unit-test-implementation` (RPI Stage 4) will settle it.
6. **Deployment target** unspecified.
7. **`reelCount`** (`app.html:1132`) is computed as a zero-padded `"01 / 05"` string but never
   rendered anywhere in the markup — dead code, like `heroSub`. *Assumption: drop it.*

---

## 9. Glossary

| Term | Meaning |
|---|---|
| **x-dc / dc-runtime** | Claude's proprietary artifact runtime — a `DCLogic` class plus template directives, rendered via React 18 UMD. Delivery mechanism only. |
| **omelette starter** | Scaffold bundled with the artifact providing the `<image-slot>` custom element. |
| **`<sc-for>`** | dc-runtime repeat directive; `list` + `as`. Ports to `.map()`. |
| **`style-hover`** | Non-standard dc-runtime attribute for hover styles. Ports to Tailwind `hover:`. |
| **`sc-camel-on-click`** | dc-runtime click binding. Ports to `onClick`. |
| **`renderVals()`** | dc-runtime hook returning the view model consumed by `{{ }}` bindings — closest analogue to a React render body. |
| **image-slot** | Fillable image placeholder custom element. Becomes the presentational `shared/ui/ImageSlot`. |
| **FSD** | Feature-Sliced Design — `app / pages / widgets / features / entities / shared`, imports flowing downward only. |
| **u1–u8** | The source's identifiers for the 8 user-supplied photographs; retained here as the canonical image mapping keys. |
