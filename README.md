# Shubham Bagwe — Portfolio

A personal portfolio website built with React, Three.js, and GSAP. Features an interactive 3D animated character, scroll-driven animations, and a custom cursor.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.168-black?logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)

---

## Features

- **3D animated character** — GLTF model with DRACO compression, rendered via React Three Fiber
- **Scroll-driven animations** — GSAP ScrollSmoother and ScrollTrigger for parallax and reveal effects
- **Custom cursor** — Animated cursor with hover states, desktop-only
- **Responsive layout** — Mobile-first design with touch device detection; 3D/cursor features gated to desktop
- **Tech stack visualization** — 3D floating icon display using Three.js
- **Work portfolio** — Project showcase with images and descriptions
- **Contact section** — Direct contact links
- **Performance optimized** — Code splitting, Brotli/gzip compression, Vercel Analytics

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | React 18, TypeScript |
| Build | Vite 5, vite-plugin-compression2 |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Animation | GSAP (ScrollSmoother, ScrollTrigger, SplitText) |
| Styling | Plain CSS (component-scoped) |
| Analytics | @vercel/analytics |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (available on local network)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with `--host` flag |
| `npm run build` | Type-check then build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

---

## Project Structure

```text
src/
├── assets/tech/        # Tech stack icon PNGs
├── components/
│   ├── Character/      # Three.js 3D character (Scene, model loader)
│   ├── styles/         # Per-component CSS files
│   └── utils/          # GSAP helpers (ScrollSmoother, SplitText, initialFX)
├── context/            # LoadingProvider — tracks model load progress
├── data/               # Static content (personalContent.ts, boneData.ts)
├── lib/                # Utilities (device detection)
├── App.tsx
└── main.tsx

public/
├── models/             # GLTF character model (encrypted + Draco compressed)
├── draco/              # Draco WASM decoder
└── Shubham_Bagwe_Resume.pdf
```

---

## Notes

- The 3D character model (`public/models/character.enc`) is encrypted. The Draco decoder (`public/draco/`) is required for decompression at runtime.
- GSAP ScrollSmoother is initialized only on desktop. Mobile devices skip smooth scrolling and the custom cursor.
