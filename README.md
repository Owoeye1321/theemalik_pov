# theemalik pov

Single-page marketing site for **theemalik pov**, a Lagos photography studio shooting weddings,
birthdays, portraits, family sessions and events.

Built as a React rebuild of a delivered HTML artifact — the visual design and interactions are
carried over faithfully, the original's proprietary template runtime is not.

## Stack

| | |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript 6 (`strict`) |
| Styling | Tailwind CSS v4 (CSS-first) |
| Lint | oxlint |
| Images | Cloudinary |
| Routing / state | None — one page, hash anchors, two local values |

Requires Node 22+.

## Getting started

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # tsc -b, then vite build
npm run lint     # oxlint
npm run preview  # serve the production build
```

## Architecture

Feature-Sliced Design. **Imports flow downward only** — a layer may import from layers strictly
below it, never above or sideways. Widgets never import other widgets.

```
src/
  app/         App shell + global CSS (design tokens, keyframes, resets)
  pages/       HomePage — composes the widgets, owns the scroll-reveal hook
  widgets/     Header, Hero, Marquee, Studio, Reel, Services, Gallery,
               Process, Testimonial, BrandSystem, Contact, Footer
  features/    gallery-filter, reel-carousel — the only stateful units
  entities/    Type definitions only
  shared/      ui/ primitives, lib/ hooks, config/ content + image helpers
```

`@/*` resolves to `src/*` (declared via `paths` in `tsconfig.app.json` — deliberately without
`baseUrl`, which is deprecated and fails the build with `TS5101`).

## Design tokens

Colour, type and animation tokens live in `src/app/index.css` under `@theme`, and are consumed as
Tailwind utilities (`bg-ink`, `text-bronze`, `font-display`, `px-gutter`, `animate-marquee`).

| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#14110F` | Dark background, primary text |
| `--color-paper` | `#F5F2EC` | Light background, text on dark |
| `--color-bronze` | `#B0754C` | Accent, rules, active states |
| `--color-clay` | `#EFEAE0` | Alt light background |
| `--spacing-gutter` | `clamp(20px,5vw,72px)` | Horizontal gutter, identical in every section |

Fonts: Cormorant Garamond (display), Manrope (body), Space Mono (labels/meta), loaded from Google
Fonts in `index.html`.

> Tailwind v4 is CSS-first — there is **no `tailwind.config.js` and no `postcss.config.js`**, and
> none should be added. Tokens go in the `@theme` block.

## Images

All images are delivered through Cloudinary with `f_auto,q_auto` (WebP/AVIF) and a per-slot width.
The full page loads ~785 KB of imagery against ~11 MB of raw PNG.

```ts
import { IMAGES, SLOT_WIDTH } from '@/shared/config/images'

<ImageSlot src={IMAGES.u1} alt="…" width={SLOT_WIDTH.hero} />
```

Every URL is composed by `cloudinaryUrl()`. **Never hardcode a `res.cloudinary.com` URL in a
component.** Eight source photos cover seventeen slots; the repetition is intentional.

## Things that will bite you

- **Two `key` props are load-bearing.** Gallery figures are keyed `` `${filter}-${slot}` `` and the
  reel's progress bar and caption are keyed `` `reel-${active}` ``. The changing key forces a remount
  so the CSS animation replays. Stabilising either key silently kills the animation with no error.
- **Reel timing is coupled.** The autoplay interval is `3800ms` and the progress bar animation is
  `grow 3.8s`. Change one and you must change the other.
- **Computed values must be inline styles, not class names.** Tailwind's scanner only sees literal
  class strings, so anything derived at runtime — reel transforms, scrim opacity, dot width, swatch
  colour — goes through the `style` prop.
- **Scroll reveal is a single page-level effect.** `useIntersectionReveal` runs once in `HomePage`
  because the stagger is derived from an element's index among its *parent's* `[data-reveal]`
  children. Mark elements with `<RevealOnScroll>`; don't add per-component observers. The double
  `requestAnimationFrame` in the hook is deliberate — without it, elements already in view flash
  before being hidden.
- **`overflow-x: hidden` on the page root is required.** The hero inset frame is positioned at
  `left: -42px` and would otherwise create a horizontal scrollbar.
- **The gallery `figcaption` needs `pointer-events: none`**, or it swallows hover on the card.

## Deviations from the original artifact

The original had no media queries and assumed a tall desktop viewport. Intentional changes:

- **Responsive collapse below `lg`** — hero, studio, services rows and footer stack; the header's
  nav links are hidden below `md` (the footer keeps them) so the CTA always fits on a phone.
- **Hero fits one viewport** — the section is `100svh` minus the header, with a reduced headline
  scale, tighter padding and a viewport-capped image, so the scroll cue sits above the fold.
- **Header CTA links to Instagram** rather than the contact section.
- **Brand System section is commented out** in `HomePage` (and its nav link in `Header`). It was a
  development showcase; its palette and type already exist as `@theme` tokens. The widget file is
  left in place.
- **Hero inset image** uses a studio photo — the original referenced a dead asset.

## Documentation

`docs/` holds the research and implementation record:

- `theemalik-pov-context.md` — analysis of the source artifact
- `theemalik-pov-plan.md` — the implementation plan, with per-section specs
