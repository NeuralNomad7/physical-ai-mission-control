# Physical AI Mission Control

> A simulated mission-control dashboard for monitoring Physical AI robot task execution, sensor health, policy confidence, safety gates, and live telemetry.

![Status](https://img.shields.io/badge/status-v0.1%20prototype-orange)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss&logoColor=white)

---

## Overview

**Physical AI Mission Control** is a dark, executive-grade operations console for an *embodied agent* — a quadruped + 6‑DOF manipulator (`PX‑04`) executing an autonomous inspection mission inside a datacenter. It presents, in a single dense view, the signals a human supervisor needs to keep an autonomous robot safe and on-task: **perception, planning, execution, and recovery** state, **sensor health**, **policy confidence**, **safety interlocks**, and a **live telemetry stream**.

This is **v0.1: a frontend-only prototype driven entirely by mock telemetry.** All data is simulated in the browser, and the live behaviors (streaming events, advancing tasks, jittering confidence, sensor signals) are generated client-side. There is no backend and no real robot — the project is a faithful, interactive *visualization of the operational layer*, designed so it can later be wired to real data sources with minimal UI change.

## Preview

![Physical AI Mission Control Dashboard](docs/images/dashboard.png?v=2)

> The dashboard-only mission-control console — robot status, mission timeline, policy confidence, safety-gate interlocks, sensor health, operator command, and live telemetry — in a single dense view.

## Why this matters for Physical AI

Physical AI systems need an **operational layer between autonomy models and the physical world.** A vision-language-action policy can produce excellent grasps and trajectories, but on a real robot — around people, near racks, under force and torque limits — *autonomy is supervised, not unattended.* Operators need to see what the robot perceives, how confident its policies are, which safety gates are holding, and what it is doing **right now**, with a hard stop always in reach.

This project demonstrates how a human operator might monitor an embodied agent during task execution:

- **Perception → Planning → Execution → Recovery** surfaced as first-class, color-coded state.
- **Policy confidence** shown against an explicit **autonomy threshold** (below it, the system flags degraded autonomy).
- A **pre-motion safety-gate interlock chain** (collision envelope, human proximity, force/torque, workspace bounds, watchdog heartbeat, joint velocity) that produces a single *autonomy permitted / inhibited* verdict.
- **Supervised-autonomy controls** — autonomy mode, task dispatch with arm-to-confirm, and a global **Emergency Stop** that halts motion, trips every gate, zeroes policy confidence, and locks the command channel.

It is the cockpit, not the autopilot — the layer that makes embodied autonomy observable, governable, and safe to operate.

## Key features

- 🛰️ **Single-screen mission control** — width-constrained, high-density 3-column layout (status · mission · telemetry).
- 🟢 **Live operational state** — supervised-autonomy system state with battery, CPU, core temp, power draw, base pose, watchdog heartbeat, localization confidence, and uptime.
- 🧭 **Mission timeline** — a multi-step datacenter inspection plan with per-task phase, progress, and ETA.
- 📈 **Policy confidence gauge** — aggregate embodied-agent confidence with a `0.80` autonomy floor, plus per-capability breakdown.
- 🛡️ **Safety-gate interlocks** — `PASS / HOLD / TRIP` per gate, rolled up to an autonomy-permitted verdict.
- 📡 **Multimodal sensor health** — LiDAR, RGB‑D, thermal IR, IMU, joint encoders, and force/torque with live signal sparklines.
- 🎛️ **Operator console** — autonomy mode (Auto/Assist/Teleop), task dispatch, flight controls, and E‑stop reset.
- 🟥 **Emergency Stop** — engages a full alert state across every panel; cleared from the Task Command console.
- 🟦 **Live telemetry** — a streaming, `stdout`-style event log tagged `INFO / OK / WARN / FAULT`.
- ⚡ **Zero backend** — runs entirely in the browser; compiles and runs with a single `npm run dev`.

## Dashboard panels

| Panel | Component | What it shows |
| --- | --- | --- |
| **Header bar** | `HeaderBar` | Robot identity (`PX‑04`, quadruped + 6‑DOF manipulator), autonomy mode badge, secure link status, mission-elapsed clock, and the global **E‑STOP**. |
| **Robot Status** | `RobotStatusCard` | Supervised-autonomy state (**Operational / Halted**), battery, CPU load, core temp, power draw, base pose, watchdog heartbeat, localization confidence, uptime. |
| **Mission Timeline** | `MissionTimeline` | The active plan — *server rack inspection → pick‑and‑place transfer → mobile manipulation → thermal anomaly scan → cable inspection* — with completed / active / queued state, plan progress, and ETA. |
| **Policy Confidence** | `PolicyConfidencePanel` | Aggregate embodied-agent confidence on a semicircular gauge against the `0.80` autonomy threshold, plus **perception / planning / execution / recovery** confidence. |
| **Safety Gates** | `SafetyGatesPanel` | Pre-motion interlock chain — collision envelope, human proximity, force/torque limits, workspace bounds, watchdog heartbeat, joint velocity — and the **autonomy permitted / inhibited** verdict. |
| **Sensor Health** | `SensorHealthPanel` | The multimodal perception stack — **LiDAR, RGB‑D, thermal IR, IMU, joint encoders, force/torque** — with sample rates and live signal sparklines. |
| **Task Command** | `TaskCommandPanel` | Operator console: autonomy mode (Auto/Assist/Teleop), task dispatch with **arm-to-confirm**, flight controls (pause/resume/hold/return‑to‑dock), and **Clear E‑stop**. |
| **Live Telemetry** | `TelemetryFeed` | Streaming, newest-first event log across perception, planning, execution, safety, thermal, and watchdog subsystems. |

### Interactive behavior (all client-side)

- **Mission clock** ticks; the **active task advances**, completes, and dispatches the next.
- **Telemetry streams** new events; **policy confidence** and **sensor signals** jitter to feel live.
- **E‑STOP** engages an alert strip, flips the robot to **Halted**, trips every safety gate, zeroes policy confidence, and disables the command channel until reset.
- **Task dispatch** uses an arm-to-confirm pattern; **autonomy-mode** changes and operator commands are logged to telemetry.

## Technical stack

| Layer | Choice |
| --- | --- |
| **UI framework** | React 19 (function components + hooks) |
| **Language** | TypeScript (strict: `verbatimModuleSyntax`, `noUnusedLocals/Parameters`) |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 (preflight) + a hand-authored design-token system in `index.css` |
| **Typography** | Space Grotesk (display) · IBM Plex Sans (UI) · IBM Plex Mono (data) |
| **Linting** | ESLint (typescript-eslint, react-hooks, react-refresh) |
| **State / data** | Local React state + typed mock-data modules — **no backend** |

## Local setup

### Prerequisites

- **Node.js 20.19+** (or 22.12+) and npm

### Run it

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

### Other scripts

```bash
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

## Project architecture

The app follows a clean **container → presentational** split. `App.tsx` is the single source of truth for live state and orchestration; every panel is a typed, presentational component. The data layer is fully isolated so it can be swapped for a real source later.

```
physical-ai-mission-control/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ HeaderBar.tsx            # identity, mode, link, mission clock, E-STOP
│  │  ├─ RobotStatusCard.tsx      # system state + vitals grid
│  │  ├─ MissionTimeline.tsx      # task plan + progress
│  │  ├─ PolicyConfidencePanel.tsx# confidence gauge + capability bars
│  │  ├─ SafetyGatesPanel.tsx     # interlock chain + verdict
│  │  ├─ SensorHealthPanel.tsx    # multimodal sensors + sparklines
│  │  ├─ TaskCommandPanel.tsx     # operator console
│  │  ├─ TelemetryFeed.tsx        # streaming event log
│  │  ├─ primitives.tsx           # shared Panel + Led building blocks
│  │  └─ tokens.ts                # status→class helpers, formatClock
│  ├─ data/
│  │  └─ mockData.ts              # robot, sensors, policy, gates, telemetry
│  ├─ types/
│  │  └─ index.ts                 # domain types (the data contract)
│  ├─ App.tsx                     # state orchestration + layout
│  ├─ main.tsx                    # React entry
│  └─ index.css                   # design tokens + dashboard styling
├─ index.html
└─ package.json
```

### State & data flow

```
        mock data (src/data)          domain types (src/types)
                 │                              │
                 ▼                              ▼
        ┌───────────────────────────────────────────────┐
        │                  App.tsx                        │
        │  state: estop · mode · missionClock · tasks ·   │
        │         telemetry lines · feed paused           │
        │  loops: clock 1s · telemetry 1.5s ·             │
        │         task-advance 1.4s                        │
        │  callbacks: engage/clear E-stop · dispatch ·    │
        │             set mode · run command · pushLine    │
        └───────────────────────────────────────────────┘
                 │ typed props ▼ (one-way)
   HeaderBar · RobotStatusCard · MissionTimeline · PolicyConfidence
   SafetyGates · SensorHealth · TaskCommand · TelemetryFeed
```

- **Domain types** in `src/types/index.ts` (`RobotStatus`, `SensorHealth`, `PolicyConfidence`, `SafetyGate`, `MissionStep`, `TelemetryEvent`, `Task`, `RobotMode`, …) are the **data contract** — the same shapes a real telemetry backend would emit.
- **`mockData.ts`** is the only place simulated values live, which is exactly where a network client would be injected in a future version.
- **`App.tsx`** owns mutable runtime state and the interval loops, and pushes one-way typed props down to presentational panels.
- **`primitives.tsx` / `tokens.ts`** keep panel chrome and status→color mapping consistent across every panel.

## Roadmap

**v0.1 — Prototype (current).** Frontend-only, mock telemetry, simulated live behaviors. Establishes the operational UX and a typed data contract.

- **v0.2 — Pluggable data source.** Promote the mock layer to a typed telemetry client with a `mock ↔ live` switch; stream over WebSocket / Server-Sent Events.
- **v0.3 — FastAPI backend.** A Python service exposing telemetry and command endpoints, auth, and recording/replay persistence.
- **v0.4 — ROS 2-style interfaces.** Bridge dashboard widgets to topics / services / actions (e.g. via `rosbridge`) for command + telemetry round-trips.
- **v0.5 — Simulation integration.** Drive the dashboard from **NVIDIA Isaac Sim** or **Gazebo** so perception, policy confidence, and safety signals come from a simulated robot.
- **v1.0 — Real robot adapters.** Hardware-in-the-loop adapters, multi-robot fleet view, and teleoperation hand-off for supervised autonomy.

## Portfolio positioning

This project is a deliberate demonstration of **product and systems thinking for Physical AI**, not just a UI exercise. It shows the ability to:

- **Frame the operational layer** that embodied-AI products actually need — the bridge between autonomy models and safe real-world execution.
- **Model a credible robotics domain** — perception/planning/execution/recovery, supervised autonomy, safety interlocks, policy confidence thresholds, and multimodal sensing — with a typed contract a backend could implement directly.
- **Ship polished frontend engineering** — React 19 + TypeScript (strict), a token-driven design system, and an executive-grade, high-density dashboard aesthetic.
- **Plan for production** — a roadmap from mock telemetry to FastAPI, ROS 2 interfaces, Isaac Sim/Gazebo, and real robot adapters.

It targets work at the intersection of **robotics operations tooling, teleoperation / supervised autonomy, and developer tooling for embodied agents.**

---

> **Disclaimer.** This is an independent portfolio simulation. `PX‑04`, the mission, and all telemetry are fictional and generated locally; the project is not affiliated with, and does not connect to, any real robot, vendor, or platform.
