This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Liquid Glass Lens Standard

The authentic Apple Liquid Glass active indicator (e.g. `BottomNav.tsx`) follows these strict rules:
1. **Deterministic SDF Normal Map:** Generated via `getLiquidLensNormalMap` and fed into `<feImage href={normalMapUri} preserveAspectRatio="none" result="refractionMap" />`. Never use random Perlin noise (`feTurbulence`) which produces wobbly splotches.
2. **Inward 360° Symmetrical Refraction:** Normal vectors point inward towards the center:
   - Left edge: $nx > 0$ (positive shift into element)
   - Right edge: $nx < 0$ (negative shift into element)
   - Top edge: $ny > 0$ (positive shift into element)
   - Bottom edge: $ny < 0$ (negative shift into element)
3. **Calm Matte Center (Zero Distortion):** Center pixels must have exact neutral value `RGB(128, 128, 128)` with zero displacement, paired with soft frosted blur (`feGaussianBlur stdDeviation="1.8"`).
4. **Ultra-Soft Feather Fade:** The transition between the refracted margin (14px) and the calm center must use a smoothstep rise followed by a cosine-squared ($\cos^2$) falloff so the displacement glides into zero with zero derivative (no hard seams or visible boundary lines).
5. **No 3D Bevels or Thick Embossed Rims:** Never add artificial 3D bevels, thick inset shadows, or embossed lines.

## Strict Execution & Token Efficiency Rules
1. **NEVER perform broad codebase searches or scans** (e.g. grep, find-in-files, multi-file sweeps) unless the user explicitly requests it.
2. **ONLY open, inspect, and modify the exact file(s)** specified by the user or strictly required for the immediate task. Zero tolerance for browsing unrelated directories or files.
3. **Execute the exact user command directly** with the absolute minimum number of tool calls, fastest turnaround time, and lowest token consumption.


# Ekip React Native - Architecture & Clean Migration Standards

## Core Architecture Principles
1. **Feature-Driven & Modular Layout:**
   - `app/`: Strictly for Expo Router route declarations (thin controller/screen entry-points, max 30-40 lines).
   - `src/features/<feature>/`: Isolated modules containing their own components, hooks, services, and types.
   - `src/components/common/` & `src/components/glass/`: Domain-agnostic, reusable UI primitives.
   - `src/services/`: Pure network and storage access layer.
   - `src/store/`: Global state (e.g. Zustand) separated from UI logic.

2. **Liquid Glass Standards (NO BLUR EVER):**
   - ZERO blur allowed anywhere in the app. Prohibited to use `expo-blur`, `BlurView`, or `backdropFilter`.
   - Rely strictly on layered RGBA tokens (`colors.ts`), borders (`surfaceBorder`, `surfaceBorderStrong`), and native platform shadows.
   - Stars are strictly exclusive to the Loading screen atmosphere; all other screens use `AuroraBackground` without stars.

3. **Universal 3-Tier Screen Architecture & Entrance Law (STRICT PROJECT STANDARD):**
   - Every post-login screen is structurally divided into 3 standardized tiers:
     1. **Header:** Any header (such as `FloatingGlassHeader` or top navigation pills) MUST always drop down from above with an entrance animation (`translateY: -50 -> 0`, `opacity: 0 -> 1`, duration: `animationDurations.sceneEntrance` 380ms).
     2. **Page & Screen Content:** Any page or screen content (including tabs, wizards, and modals) MUST always rise from below with an entrance animation (`translateY: 20 -> 0`, `opacity: 0 -> 1`, duration: `animationDurations.sceneEntrance` 380ms) using the centralized `MotionView` primitive, with bottom clearance `layout.bottomNavClearance` (100px).
     3. **Universal BottomNav:** `BottomNav` is a fixed requirement on EVERY post-login screen without exception ("وحی منزل"), mounted stably at the layout level without unmounting or re-entering.

4. **Zero-Lag JS Thread Performance Law (STRICT PROJECT STANDARD):**
   - **No Naive Screen Destructions / No Re-instantiation Lag:** Never use raw conditional rendering (`{isActive && <Screen />}`) that destroys and recreates heavy screen trees on tab switches. Screen data, inputs, and scroll offsets MUST stay preserved in Zustand stores.
   - **No `display: 'none'` Layout Trashing:** NEVER use `display: 'none'` to toggle screen visibility, as it forces the native Yoga engine to discard and recalculate entire layout trees on re-activation (causing severe frame drops).
   - **No Background Resource Leaks (`opacity: 0` without Freezing):** Inactive screens must never run active animations, timers, or scroll listeners in the background. Inactive screens must be frozen to consume 0% JS CPU.
   - **Pure GPU Native Driver Execution:** Every animation (headers, pages, icons, modals) MUST run with `useNativeDriver: true` or native Reanimated worklets. NEVER calculate trigonometry (`Math.sin`, `Math.cos`), dynamic SVG gradient coordinates, or loop math on the JS thread.
   - **Virtualized List Optimization:** Any `FlatList` MUST implement `getItemLayout` for fixed-height items, cap `windowSize <= 5`, set `removeClippedSubviews: true`, `initialNumToRender: 6`, `maxToRenderPerBatch: 5`, and use `expo-image` with hardware-accelerated memory/disk caching.
   - **Fine-Grained Zustand Subscriptions:** NEVER subscribe whole store objects into screens. Always use granular selectors (`useStore(s => s.specificValue)`). Typing into inputs must NEVER trigger re-renders of list items or sibling components.

## Strict Prohibited Patterns (ZERO TOLERANCE - NEVER COPY FROM LEGACY)
1. **No Web-Only CSS Filter Hacks:**
   - NEVER write `backdropFilter` or `WebkitBackdropFilter`.
   - NEVER use `as any` style casts to force browser CSS into React Native `StyleSheet`.
2. **No Web DOM Manipulations:**
   - NEVER use `webDivRef.current.classList.add/remove` or `void offsetWidth`.
   - Animate purely with React Native Reanimated or standard React Native `Animated`.
3. **No Invalid React Native Style Properties:**
   - NEVER use `direction: 'ltr'` or `direction: 'rtl'`. Use `writingDirection` for typography and Flexbox / `I18nManager` for layouts.
4. **No Custom Routing or History State Hacks:**
   - NEVER create manual navigation history arrays (`historyRef`, `push/pop` state machines).
   - Strictly use Expo Router (`useRouter`, `usePathname`, `useLocalSearchParams`, `Link`).
5. **No Monolithic Files:**
   - Files MUST stay focused and modular (target max 200 lines). Break large screens into smaller sub-components and custom hooks.
6. **No Inline Hardcoding:**
   - Colors from `@/lib/theme`, fonts from `@/lib/theme/typography`, spacing from `@/lib/theme/spacing`, animations from `@/lib/animations`, texts from `@/lib/i18n`.

## Migration Workflow
1. When migrating from the legacy project (`antigravity`), extract ONLY the pure visual design, typography, colors, and business logic formulas.
2. Cleanse and refactor the code according to the above rules BEFORE writing it to the new project (`Ekip-ReactNative`).
3. Always verify with `npx tsc --noEmit` before concluding any migration step.
