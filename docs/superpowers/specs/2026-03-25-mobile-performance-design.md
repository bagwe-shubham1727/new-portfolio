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
| `smoother` used unconditionally after gated creation | `smoother.scrollTop(0)`, `smoother.paused(true)` in Navbar and `smoother.paused(false)` in initialFX throw when smoother is undefined on mobile | Runtime crash on mobile |
| Cursor RAF loop on touch devices | Pointless animation loop on every frame | Wasted CPU |
| `import * as THREE` runtime import in GsapScroll.ts | Three.js pulled into GsapScroll's chunk even though no THREE values are used at runtime | Larger bundle, harder to split |
| No Vite manualChunks | Three.js + Rapier + R3F not isolated from shared chunks | Larger initial parse cost |
| No compression | Assets sent uncompressed | ~12.8MB extra transfer |
| `.work-image-in` has no reserved height | Image container collapses before images load | CLS 2.57 |
| SplitText instantiated in initialFX.ts on all screen sizes | Hundreds of extra DOM nodes created on mobile | Layout thrash on load |

---

## Section 1: ScrollSmoother & Cursor

### ScrollSmoother — `Navbar.tsx`

Gate the entire smoother block inside `window.innerWidth > 1024`. Move `smoother.scrollTop(0)` and `smoother.paused(true)` inside the same block. Change the exported type to `ScrollSmoother | undefined`.

The nav link click handler already has its own `window.innerWidth > 1024` guard around `smoother.scrollTo()`, so it remains safe. The edge case of resizing across the 1024px boundary is a pre-existing limitation and out of scope — it existed before this change.

```ts
// Navbar.tsx
export let smoother: ScrollSmoother | undefined;

useEffect(() => {
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
    smoother.scrollTop(0);
    smoother.paused(true);
  }

  // Nav link click handler already has > 1024 guard — smoother.scrollTo() is safe
  let links = document.querySelectorAll(".header ul a");
  links.forEach((elem) => {
    let element = elem as HTMLAnchorElement;
    element.addEventListener("click", (e) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        let el = e.currentTarget as HTMLAnchorElement;
        let section = el.getAttribute("data-href");
        smoother?.scrollTo(section, true, "top top"); // optional chain for safety
      }
    });
  });
  window.addEventListener("resize", () => ScrollSmoother.refresh(true));
}, []);
```

### initialFX.ts — restructure to separate init from SplitText

`initialFX` does two distinct things: (a) general page initialization that must run on all devices, and (b) SplitText character animations that should not run on mobile. These must be separated — the early return cannot come before the general init.

The `smoother?.paused(false)` optional chain is safe. On viewports 901–1024px, `smoother` is `undefined` (not created because `< 1024`), so `?.paused(false)` is a silent no-op. The page still functions because native scroll is active there. This is intentional and acceptable.

```ts
export function initialFX() {
  // General init — runs on ALL screen sizes
  document.body.style.overflowY = "auto";
  smoother?.paused(false);                    // no-op if undefined (901–1024px range)
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", { backgroundColor: "#0a0e17", duration: 0.5, delay: 1 });

  // Non-SplitText fade-ins — run on ALL screen sizes
  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", y: 0, delay: 0.8 }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 }
  );

  // ALL SplitText instantiation and LoopText calls — skip on mobile (< 900px)
  // This includes: landingText, landingText2, landingText3, landingText4, landingText5
  // and both LoopText(landingText2, landingText3) / LoopText(landingText4, landingText5) calls.
  // landingText2 must stay INSIDE this guard (it is only used in LoopText below).
  // Moving any SplitText instantiation above this return would wastefully create DOM nodes on mobile.
  if (window.innerWidth < 900) return;

  // The current source code from line 15 onward (all SplitText variables + LoopText calls) is
  // unchanged — it stays here, after the early return. Only the four GSAP calls above
  // (overflowY, smoother, main-active, background color, landing-info-h2, header/icons/nav-fade)
  // are hoisted above the guard.
  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    { type: "chars,lines", linesClass: "split-line" }
  );
  // ... all remaining SplitText vars and LoopText calls unchanged ...
}
```

### Cursor — `MainContainer.tsx`

Use `pointer: fine` CSS media query. Only render `<Cursor />` when a precise pointer (mouse) is available. More reliable than user-agent sniffing.

```ts
const isTouchDevice = !window.matchMedia('(pointer: fine)').matches;
// ...
{!isTouchDevice && <Cursor />}
```

---

## Section 2: Vite Code Splitting + Compression

### Convert THREE import to type-only in `GsapScroll.ts`

`GsapScroll.ts` uses `import * as THREE` exclusively for TypeScript type annotations: function parameter types (`THREE.Object3D`, `THREE.PerspectiveCamera`), local variable types (`THREE.Mesh | undefined`), and `as` type casts. All of these are compile-time constructs erased by TypeScript. There are **no `new THREE.X()` constructors, no `THREE.X` constants, and critically no `instanceof THREE.X` checks** — the last being the most common reason a type-only import would fail at runtime. Converting is safe.

```ts
import type * as THREE from "three";
```

**Verification note for implementer:** Before adding this change, confirm no `instanceof THREE.*` check has been added to GsapScroll.ts. If one exists, it must remain a runtime import or be refactored.

### manualChunks — `vite.config.ts`

Split Three.js, R3F, Rapier, and GSAP into named chunks. `TechStack` and `Character` are lazy-loaded via `React.lazy()` and only mounted when `isDesktopView` is true, so their dynamic imports — and the chunks they pull — are never fetched on mobile.

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

```ts
import { compression } from 'vite-plugin-compression2'

plugins: [
  react(),
  compression({ algorithm: 'brotliCompress' }),
  compression({ algorithm: 'gzip' }),
]
```

---

## Section 3: CLS, Work Image, GSAP Mobile Tweaks

### CLS — `.work-image-in` reserved height (`Work.css`)

`.work-image-in` is `position: relative` with no explicit dimensions, so it collapses to zero height before images load. Add `min-height` matching the existing image `max-height` constraints so space is reserved from first paint.

```css
.work-image-in {
  position: relative;
  min-height: 350px;   /* matches max-height: 400px on .work-image img */
  width: 100%;
}

/* At 900px breakpoint, max-height drops to 250px */
@media only screen and (max-width: 900px) {
  .work-image-in {
    min-height: 200px;
  }
}
```

### GSAP stagger/duration — `GsapScroll.ts`, `setAllTimeline()` only

Reduce duration and stagger for the career section animations on mobile. Apply only to the two relevant calls in `setAllTimeline()`. The desktop character animations in `setCharTimeline()` (6s, 3s, etc.) are already inside `window.innerWidth > 1024` and are not touched.

```ts
// In setAllTimeline():
const isMobile = window.innerWidth < 1024;
const dur = isMobile ? 0.3 : 0.5;
const stagger = isMobile ? 0.06 : 0.1;

careerTimeline
  .fromTo('.career-timeline', { maxHeight: '10%' }, { maxHeight: '100%', duration: dur }, 0)
  .fromTo('.career-timeline', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
  .fromTo('.career-info-box', { opacity: 0 }, { opacity: 1, stagger, duration: dur }, 0)
  // ... dot animation unchanged
```

---

## Files Changed

| File | Change |
|---|---|
| `src/components/Navbar.tsx` | Gate entire smoother block; export type `ScrollSmoother \| undefined`; optional-chain `smoother?.scrollTo()` |
| `src/components/utils/initialFX.ts` | Restructure: general init runs always, SplitText guarded at `< 900`; `smoother?.paused(false)` |
| `src/components/MainContainer.tsx` | Skip `<Cursor />` on touch devices via `pointer: fine` |
| `src/components/utils/GsapScroll.ts` | `import type * as THREE`; mobile vars in `setAllTimeline()` |
| `vite.config.ts` | `manualChunks` + compression plugin |
| `src/components/styles/Work.css` | `min-height` on `.work-image-in` |
| `package.json` | Add `vite-plugin-compression2` |

---

## Success Criteria

- Scroll on iOS/Android feels like native momentum scroll — no competing JS
- No runtime errors on mobile — `smoother is undefined` never thrown (verify browser console)
- No custom cursor on touch devices
- `npm run build` succeeds with no TypeScript errors
- Build output contains `.br` files — verify with `ls dist/assets/*.br`
- Three.js is in its own `three-core` named chunk — verify with `ls dist/assets/three-core*.js`
- `.work-image-in` reserves height before image load — verify in DevTools > Performance > Layout Shifts
- Career animations use shorter stagger/duration on mobile
- No desktop regressions — smoother, cursor, SplitText all behave as before on > 1024px
