# Mobile Performance Design

**Date:** 2026-03-25
**Goal:** Eliminate scroll jank and reduce parse cost on mobile devices — noticeably smoother real-device feel.
**Approach:** Option B — Surgical fixes + Vite code splitting
**Lighthouse baseline (mobile):** Performance 0, FCP 43.5s, LCP 84.9s, TBT 5530ms, CLS 2.57, TTI 94.3s

---

## Root Cause Summary

| Cause | Symptom | Impact |
|---|---|---|
| ScrollSmoother active on mobile | JS intercepts touch events, fights browser inertia | Jerky/snappy scroll (primary complaint) |
| Cursor RAF loop on touch devices | Pointless animation loop on every frame | Wasted CPU |
| No Vite manualChunks | Three.js + Rapier + R3F bundled into main chunk | ~12.5MB unused JS parsed on mobile |
| No compression | Assets sent uncompressed | ~12.8MB extra transfer |
| No aspect-ratio on images | Image containers reflow when images load | CLS 2.57 |
| SplitText in initialFX.ts unguarded | Hundreds of extra DOM nodes on mobile | Layout thrash on load |

---

## Section 1: ScrollSmoother & Cursor

### ScrollSmoother — `Navbar.tsx`

Wrap `ScrollSmoother.create()` in a `window.innerWidth > 1024` check. On mobile, native browser scroll handles inertia correctly — no JS intervention needed.

```ts
if (window.innerWidth > 1024) {
  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.7,
    speed: 1.7,
    effects: true,
    autoResize: true,
    ignoreMobileResize: true,
  });
}
```

### Cursor — `MainContainer.tsx`

Use `pointer: fine` CSS media query to detect touch devices. Only render `<Cursor />` when a precise pointer (mouse) is available. This is more reliable than user-agent sniffing and covers phones, tablets, and touchscreen laptops.

```ts
const isTouchDevice = !window.matchMedia('(pointer: fine)').matches;
// ...
{!isTouchDevice && <Cursor />}
```

**Expected impact:** Scroll jank eliminated. RAF loop removed on touch devices.

---

## Section 2: Vite Code Splitting + Compression

### manualChunks — `vite.config.ts`

Split Three.js, R3F, Rapier, and GSAP into separate chunks. Since `TechStack` and `Character` are already gated behind `isDesktopView` checks, mobile never triggers the dynamic imports for these chunks.

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'three-core': ['three'],
        'r3f': ['@react-three/fiber', '@react-three/drei'],
        'physics': ['@react-three/rapier'],
        'gsap': ['gsap'],
      }
    }
  }
}
```

### Compression — `vite.config.ts` + `package.json`

Install `vite-plugin-compression2`. Generates `.br` (brotli) and `.gz` (gzip) files at build time alongside each asset. Hosts like Vercel and Netlify serve the compressed version automatically.

```ts
import { compression } from 'vite-plugin-compression2'

plugins: [
  react(),
  compression({ algorithm: 'brotliCompress' }),
  compression({ algorithm: 'gzip' }),
]
```

**Expected impact:** Mobile parsed JS drops from ~15MB to ~1.2MB. Transfer size reduced ~3–5×.

---

## Section 3: CLS, SplitText Guard, GSAP Mobile Tweaks

### CLS — Work image containers

Add `aspect-ratio: 16/9` to work image containers so space is reserved before images load, eliminating reflow.

```css
/* Work.css */
.work-image {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

### SplitText guard — `initialFX.ts`

`splitText.ts` already returns early below 900px. Add the same guard to `initialFX.ts` to prevent SplitText from creating hundreds of extra DOM nodes on mobile.

```ts
export function initialFX() {
  if (window.innerWidth < 900) return;
  // ... existing SplitText init
}
```

### GSAP stagger/duration — `GsapScroll.ts`

Reduce animation durations and stagger values by ~40% on mobile to feel snappier on slower devices without feeling broken.

```ts
const isMobile = window.innerWidth < 1024;
const dur = isMobile ? 0.3 : 0.5;
const stagger = isMobile ? 0.06 : 0.1;
```

Apply to `.career-info-box` stagger and `.career-timeline` duration in `setAllTimeline()`.

---

## Files Changed

| File | Change |
|---|---|
| `src/components/Navbar.tsx` | Gate `ScrollSmoother.create()` behind `> 1024px` |
| `src/components/MainContainer.tsx` | Skip `<Cursor />` on touch devices via `pointer: fine` |
| `vite.config.ts` | `manualChunks` for Three/R3F/Rapier/GSAP + compression plugin |
| `src/components/styles/Work.css` | `aspect-ratio: 16/9` on `.work-image` |
| `src/components/utils/initialFX.ts` | Add `< 900px` early return |
| `src/components/utils/GsapScroll.ts` | Reduce stagger/duration on mobile |
| `package.json` | Add `vite-plugin-compression2` dev dependency |

---

## Success Criteria

- Scroll on iOS/Android feels like native momentum scroll (no competing JS)
- No custom cursor rendered on touch devices
- `npm run build` produces `.br` and `.gz` files alongside assets
- Three.js/Rapier chunks absent from mobile network waterfall
- CLS below 0.5 (from 2.57)
- No regressions on desktop experience
