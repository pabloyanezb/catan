# Catan Board Generator

Generate balanced, playable Catan boards in seconds.

This project is a web app for creating 19-tile Catan layouts with configurable generation rules for resources, numbers, ports, and desert position.

## What You Get

- Fast board generation with deterministic rule sets
- Official-style number flow with counter-clockwise spiral path
- Random mode with safety checks for high-value number adjacency
- Coastal port generation and sea ring rendering
- Config panel to switch generation strategy without touching code

## Generation Settings

All settings are first-class options in the UI and in `BoardSettings`.

| Setting | Modes | Behavior |
|---|---|---|
| `numberPlacement` | `standard`, `random` | `standard` uses the official A-R number sequence on a counter-clockwise spiral; `random` shuffles numbers and validates constraints (including no adjacent 6/8). |
| `resourceBalance` | `balanced`, `random` | `balanced` rejects boards with heavy same-resource clustering; `random` accepts any resource adjacency pattern. |
| `portLayout` | `fixed`, `random` | `fixed` follows predefined Catan-style coastal slots; `random` shuffles valid port assignments across the frame. |
| `desertPlacement` | `center`, `inner`, `random` | `center` forces desert at `0,0`; `inner` allows center + middle ring (radius <= 1); `random` allows any land tile. |

## Product Behavior

- Board size: 19 land tiles (hex radius 2)
- Number token count: 18 (desert has no number)
- Number safety: random-number mode blocks adjacent `6` and `8`
- Resource counts: standard Catan distribution

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- honeycomb-grid
- Jest

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Project Map

- `src/engine/logic/generator.ts` - main board generation flow
- `src/engine/logic/validators.ts` - board quality and constraint checks
- `src/engine/config/types.ts` - core domain types and setting modes
- `src/components/panel/SettingsFields.tsx` - generation controls
- `src/components/board/*` - board, tiles, ports, and sea rendering

## Quality

Run the test suite:

```bash
npm run test
```
