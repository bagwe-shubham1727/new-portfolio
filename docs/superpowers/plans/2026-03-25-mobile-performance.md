# Mobile Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate mobile scroll jank and reduce JS parse cost by gating ScrollSmoother/Cursor on mobile, code-splitting the 3D bundle, adding compression, and fixing CLS.

**Architecture:** Surgical changes to 6 existing files + vite.config.ts. No new files created. Each task is independently buildable and committed separately. Verification is `npm run build` (TypeScript must pass) after every task.

**Tech Stack:** React 18, TypeScript, Vite 5, GSAP (ScrollSmoother/SplitText), Three.js, vite-plugin-compression2

**Spec:** `docs/superpowers/specs/2026-03-25-mobile-performance-design.md`

---

## File Map

| File | Change |
|---|---|
| `src/components/Navbar.tsx` | Gate smoother block; export type `ScrollSmoother \| undefined`; optional-chain `scrollTo` |
| `src/components/utils/initialFX.ts` | Restructure: hoist general init above `< 900` guard; `smoother?.paused(false)` |
| `src/components/MainContainer.tsx` | Skip `<Cursor />` on touch devices via `pointer: fine` module-level constant |
| `src/components/utils/GsapScroll.ts` | `import type * as THREE`; mobile stagger/duration vars in `setAllTimeline()` |
| `vite.config.ts` | `manualChunks` + `vite-plugin-compression2` |
| `src/components/styles/Work.css` | `min-height` on `.work-image-in` for CLS |

### Lazy-loading clarification (relevant to Task 5)
`Character` is `React.lazy()`-loaded in `src/App.tsx` (line 4) and only mounted when `isDesktopView` is true (MainContainer line 42: `{isDesktopView && children}`). `TechStack` is `React.lazy()`-loaded in `src/components/MainContainer.tsx` (line 13) and also gated behind `isDesktopView` (line 51). Both chunks are never fetched on mobile, which is why the Three.js/R3F/Rapier manualChunks will be absent from the mobile critical path.

---

## Task 1: Gate ScrollSmoother in Navbar.tsx

**Files:**
- Modify: `src/components/Navbar.tsx`

### Context
`ScrollSmoother.create()` currently runs unconditionally. On mobile it intercepts native touch events causing scroll jank. `smoother.scrollTop(0)` and `smoother.paused(true)` immediately follow and will throw on mobile when `smoother` is undefined.

The exported `smoother` variable is consumed by `initialFX.ts` (handled in Task 2). The click handler already has its own `window.innerWidth > 1024` guard but still uses bare `smoother.scrollTo` — change to `smoother?.scrollTo` for defensive safety.

- [ ] **Step 1: Read current source to confirm structure**

Read `src/components/Navbar.tsx`. Confirm:
- Line 9: `export let smoother: ScrollSmoother;`
- Line 13: `smoother = ScrollSmoother.create(...)` (ungated)
- Line 23: `smoother.scrollTop(0)`
- Line 24: `smoother.paused(true)`
- Line 34: `smoother.scrollTo(section, true, "top top")` inside click handler with `if (window.innerWidth > 1024)` guard
- Note: the local variable inside the click handler is named `elem` on line 32

- [ ] **Step 2: Apply the fix**

Change `src/components/Navbar.tsx` lines 9 and 12–40:

```ts
// Line 9 — change type to allow undefined:
export let smoother: ScrollSmoother | undefined;

// useEffect body — gate entire smoother block:
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

  let links = document.querySelectorAll(".header ul a");
  links.forEach((elem) => {
    let element = elem as HTMLAnchorElement;
    element.addEventListener("click", (e) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        let elem = e.currentTarget as HTMLAnchorElement;
        let section = elem.getAttribute("data-href");
        smoother?.scrollTo(section, true, "top top");
      }
    });
  });
  window.addEventListener("resize", () => {
    ScrollSmoother.refresh(true);
  });
}, []);
```

Keep the JSX return (lines 42–79) exactly as-is.

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | grep -E "error TS|✓ built"
```

Expected: `✓ built in` with no TS errors.

- [ ] **Step 4: Quick mobile smoke-test**

```bash
npm run dev
```

Open DevTools → device toolbar → iPhone 12 Pro. Open Console tab. Reload page. Confirm:
- No `Cannot read properties of undefined (reading 'paused')` error
- No `Cannot read properties of undefined (reading 'scrollTop')` error
- Page scrolls naturally with native momentum

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "perf: gate ScrollSmoother to desktop-only (>1024px)"
```

---

## Task 2: Restructure initialFX.ts

**Files:**
- Modify: `src/components/utils/initialFX.ts`

### Context
`initialFX` does two things: (a) general page init (overflow reset, smoother unpause, background fade, header/nav fade-in) that must run on all devices, and (b) SplitText character animations that are expensive and unnecessary on mobile.

The restructure reorders the function body so the 4 non-SplitText items run first on all devices, then an early return fires at `< 900px` before any `new SplitText()` call. ALL SplitText variables (`landingText` through `landingText5`) and both `LoopText` calls stay after the guard.

Note: `smoother?.paused(false)` uses optional chaining — on 901–1024px viewports `smoother` is `undefined` (not created because smoother requires `> 1024`), so this is a safe no-op. The page uses native scroll there.

- [ ] **Step 1: Read current file in full**

Read `src/components/utils/initialFX.ts` completely. Note:
- Line 6: `document.body.style.overflowY = "auto"` — must run on all devices
- Line 7: `smoother.paused(false)` — needs optional chain
- Line 8: `main-active` class add — must run on all devices
- Lines 9–13: `gsap.to("body", ...)` background fade — must run on all devices
- Lines 15–34: `landingText` SplitText + animation — must go after guard
- Lines 36–51: `landingText2` SplitText + **its own gsap.fromTo animation** + TextProps — must go after guard
- Lines 53–63: `.landing-info-h2` gsap.fromTo — no SplitText, must run on all devices
- Lines 64–73: `.header`/`.icons-section`/`.nav-fade` gsap.fromTo — no SplitText, must run on all devices
- Lines 75–80: `landingText3`–`landingText5` + both `LoopText` calls — must go after guard
- Lines 83–136: `LoopText` function — unchanged

- [ ] **Step 2: Rewrite initialFX.ts**

```ts
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  // General init — runs on ALL screen sizes
  document.body.style.overflowY = "auto";
  smoother?.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  // Non-SplitText fade-ins — run on ALL screen sizes
  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  // SplitText animations — skip on mobile (< 900px)
  // ALL SplitText variables and LoopText calls stay below this guard.
  if (window.innerWidth < 900) return;

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var landingText2 = new SplitText(".landing-h2-info", TextProps);
  gsap.fromTo(
    landingText2.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  var landingText3 = new SplitText(".landing-h2-info-1", TextProps);
  var landingText4 = new SplitText(".landing-h2-1", TextProps);
  var landingText5 = new SplitText(".landing-h2-2", TextProps);

  LoopText(landingText2, landingText3);
  LoopText(landingText4, landingText5);
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | grep -E "error TS|✓ built"
```

Expected: `✓ built in` with no TS errors.

- [ ] **Step 4: Mobile smoke-test**

Open DevTools → iPhone 12 Pro. Reload. Confirm:
- No `smoother` errors in console
- Page content is visible and scrollable
- Header, nav, and social icons fade in normally

- [ ] **Step 5: Commit**

```bash
git add src/components/utils/initialFX.ts
git commit -m "perf: restructure initialFX — hoist page init above mobile SplitText guard"
```

---

## Task 3: Skip Cursor on touch devices

**Files:**
- Modify: `src/components/MainContainer.tsx`

### Context
`<Cursor />` is rendered unconditionally. It runs a GSAP RAF loop every frame. On touch devices there is no mouse so this loop runs for nothing.

`pointer: fine` is a CSS media query that returns `true` when the primary input is a precise pointing device (mouse/trackpad) and `false` for touch-only devices (phones, tablets). It is evaluated once at module load time as a module-level constant — this avoids re-evaluating on every render and is safe for this browser-only SPA (no SSR).

- [ ] **Step 1: Read current MainContainer.tsx**

Read `src/components/MainContainer.tsx`. Confirm:
- Line 39: `<Cursor />` rendered unconditionally
- The file has no existing `matchMedia` or `isTouchDevice` logic

- [ ] **Step 2: Add module-level constant and conditional render**

Add one constant at module scope (above the `MainContainer` component function, after the imports) and update the render:

```ts
// Add after imports, before the component function:
const isTouchDevice = !window.matchMedia("(pointer: fine)").matches;
```

Change the render in the component's return from:
```tsx
<Cursor />
```
to:
```tsx
{!isTouchDevice && <Cursor />}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | grep -E "error TS|✓ built"
```

- [ ] **Step 4: Verify cursor absent on mobile, present on desktop**

Open DevTools → iPhone 12 Pro → Reload. Inspect DOM — confirm no `.cursor` element rendered.
Switch to desktop (1280px) → Reload. Confirm cursor element exists and follows mouse.

- [ ] **Step 5: Commit**

```bash
git add src/components/MainContainer.tsx
git commit -m "perf: skip Cursor RAF loop on touch devices"
```

---

## Task 4: Type-only THREE import + mobile stagger in GsapScroll.ts

**Files:**
- Modify: `src/components/utils/GsapScroll.ts`

### Context
**Change A:** `import * as THREE from "three"` is a runtime import. All THREE usages in this file are TypeScript type annotations only (`as THREE.Mesh` casts, `THREE.Object3D | null` param types, `THREE.Mesh | undefined` var types). There are no `new THREE.X()` constructors, no `THREE.SomeConstant` references, and critically **no `instanceof THREE.X` checks** — the last being the one pattern that would break with a type-only import. Converting to `import type` erases the import entirely from the output.

Note: `setCharTimeline` is only ever called from within the desktop `window.innerWidth > 1024` path, so any confusion about its mobile behaviour is moot.

**Change B:** In `setAllTimeline()` (line 145), the career animations use hardcoded `duration: 0.5` and `stagger: 0.1`. Introduce `isMobile` vars and apply reduced values to the two relevant `.fromTo()` calls only.

- [ ] **Step 1: Convert import**

In `src/components/utils/GsapScroll.ts` line 1, change:
```ts
import * as THREE from "three";
```
to:
```ts
import type * as THREE from "three";
```

- [ ] **Step 2: Add mobile vars to setAllTimeline()**

In `setAllTimeline()` (starts around line 145), add two constants at the top of the function and apply them to the `.career-timeline` maxHeight and `.career-info-box` fromTo calls:

```ts
export function setAllTimeline() {
  const isMobile = window.innerWidth < 1024;
  const dur = isMobile ? 0.3 : 0.5;
  const stagger = isMobile ? 0.06 : 0.1;

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: dur },
      0
    )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: stagger, duration: dur },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | grep -E "error TS|✓ built"
```

Expected: `✓ built in` with no TS errors. If errors appear about THREE types, verify no `new THREE.X()` or `instanceof THREE.X` was accidentally introduced.

- [ ] **Step 4: Commit**

```bash
git add src/components/utils/GsapScroll.ts
git commit -m "perf: type-only THREE import in GsapScroll; mobile stagger reduction"
```

---

## Task 5: Vite code splitting + compression

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json` (via npm install)

### Context
**manualChunks:** Isolates Three.js, R3F, Rapier, and GSAP into named output chunks. Both `Character` (lazy in `App.tsx`) and `TechStack` (lazy in `MainContainer.tsx`) are gated behind `isDesktopView`, so their dynamic imports — and the chunks they pull — are never fetched on mobile.

**Compression:** `vite-plugin-compression2` generates `.br` (brotli) and `.gz` (gzip) sidecar files at build time.

- [ ] **Step 1: Read current vite.config.ts**

Read `vite.config.ts` in full. Confirm it only contains `plugins: [react()]` with no other config keys (base, resolve, server, etc.). If any other config exists, preserve it in the rewrite.

- [ ] **Step 2: Install compression plugin**

```bash
npm install -D vite-plugin-compression2
```

Expected: added to `devDependencies` in `package.json`.

- [ ] **Step 3: Rewrite vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "brotliCompress" }),
    compression({ algorithm: "gzip" }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-core": ["three"],
          "r3f": ["@react-three/fiber", "@react-three/drei"],
          "physics": ["@react-three/rapier"],
          "gsap": ["gsap"],
        },
      },
    },
  },
});
```

- [ ] **Step 4: Verify build produces named chunks and compressed files**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ built in` and named chunk entries (`three-core`, `gsap`, `r3f`, `physics`) in the asset list.

```bash
ls dist/assets/three-core*.js dist/assets/gsap*.js 2>/dev/null
ls dist/assets/*.br 2>/dev/null | head -5
```

Expected: `three-core-*.js` and `gsap-*.js` files exist. Multiple `.br` files exist.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "perf: Vite manualChunks for 3D/GSAP libs + brotli/gzip compression"
```

---

## Task 6: Fix CLS — reserve image container height

**Files:**
- Modify: `src/components/styles/Work.css`

### Context
`.work-image-in` (line ~190 in Work.css) is `position: relative` with no height set. It collapses before images load then jumps to its natural height — the primary cause of CLS 2.57. Adding `min-height` matching the image `max-height` constraints reserves space from first paint.

Current constraints: `.work-image img` has `max-height: 400px` at default breakpoint and `max-height: 250px` at `≤ 900px`.

- [ ] **Step 1: Update .work-image-in in Work.css**

Find the `.work-image-in` rule (currently `position: relative` only). Replace it:

```css
.work-image-in {
  position: relative;
  min-height: 350px;
  width: 100%;
}
```

- [ ] **Step 2: Add mobile override inside existing 900px media query**

Find the `@media only screen and (max-width: 900px)` block (around line 306). Add inside it:

```css
.work-image-in {
  min-height: 200px;
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | grep -E "error TS|✓ built"
```

- [ ] **Step 4: Visual CLS check**

```bash
npm run dev
```

Open DevTools → Network → throttle to Slow 3G → navigate to Work section → reload. The image area should maintain its height before images load (no jump).

- [ ] **Step 5: Commit**

```bash
git add src/components/styles/Work.css
git commit -m "perf: reserve work image container height to fix CLS"
```

---

## Task 7: Final verification

- [ ] **Step 1: Full clean build**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ built in` with no TypeScript errors.

- [ ] **Step 2: Verify artifacts**

```bash
ls dist/assets/three-core*.js dist/assets/gsap*.js dist/assets/*.br | head -10
```

Expected: named chunks and `.br` files present.

- [ ] **Step 3: Re-run Lighthouse mobile**

```bash
npx serve dist -p 4173 &
sleep 3
~/.npm-global/bin/lighthouse http://localhost:4173 \
  --output json \
  --output-path /tmp/lighthouse-after.json \
  --emulated-form-factor mobile \
  --throttling-method simulate \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance 2>&1 | tail -5
```

Compare before/after:
```bash
node -e "
const before = require('/tmp/lighthouse-report.json');
const after = require('/tmp/lighthouse-after.json');
const metrics = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','interactive'];
console.log('Metric | Before | After');
metrics.forEach(m => {
  const b = before.audits[m];
  const a = after.audits[m];
  if (b && a) console.log(b.title + ' | ' + b.displayValue + ' | ' + a.displayValue);
});
console.log('Performance score | ' +
  Math.round(before.categories.performance.score*100) + ' | ' +
  Math.round(after.categories.performance.score*100));
"
```

- [ ] **Step 4: Mobile console check**

DevTools → iPhone 12 Pro → Reload. Confirm in Console:
- No `Cannot read properties of undefined` errors
- No `smoother` related errors

Confirm in Elements:
- No `.cursor` element in DOM

- [ ] **Step 5: Desktop regression check**

Switch DevTools to 1280px desktop. Reload. Confirm:
- ScrollSmoother smooth scroll works
- Custom cursor appears and follows mouse
- SplitText landing animations fire on load
- Career timeline animates on scroll
