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


