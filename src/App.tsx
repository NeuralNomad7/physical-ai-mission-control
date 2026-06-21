import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import RobotStatusCard from './components/RobotStatusCard';
import MissionTimeline from './components/MissionTimeline';
import PolicyConfidencePanel from './components/PolicyConfidencePanel';
import SafetyGatesPanel from './components/SafetyGatesPanel';
import SensorHealthPanel from './components/SensorHealthPanel';
import TaskCommandPanel from './components/TaskCommandPanel';
import TelemetryFeed from './components/TelemetryFeed';
import { Led } from './components/primitives';
import { formatClock, tagFor, type Tag } from './components/tokens';
import {
  missionMeta,
  missionSteps,
  policyConfidence,
  robotStatus,
  safetyGates,
  sensors,
  telemetryPool,
  telemetrySeed,
} from './data/mockData';
import type { Task, TelemetryLine } from './types';

const initialTasks: Task[] = missionSteps.map((s) => ({
  id: s.id,
  name: s.name,
  status: s.status === 'complete' ? 'done' : s.status === 'active' ? 'active' : 'queued',
  pct: s.status === 'complete' ? 100 : s.status === 'active' ? 34 : 0,
}));

// Pre-populate the telemetry feed so the live console looks full on load.
function buildInitialLines(): TelemetryLine[] {
  const chrono: { tag: Tag; msg: string }[] = [
    { tag: 'info', msg: 'mission control link established · PX-04' },
    { tag: 'ok', msg: 'pre-flight checks passed, autonomy permitted' },
    { tag: 'info', msg: 'executing plan MX-7741' },
  ];
  [...telemetrySeed].reverse().forEach((e) => chrono.push({ tag: tagFor(e.severity), msg: e.message }));
  let k = 0;
  while (chrono.length < 40) {
    const p = telemetryPool[k % telemetryPool.length];
    chrono.push({ tag: tagFor(p.severity), msg: p.message });
    k += 1;
  }
  const start = missionMeta.startMetSec;
  const n = chrono.length;
  return chrono
    .map((c, i): TelemetryLine => ({ id: i + 1, ts: formatClock(start - (n - 1 - i) * 3), tag: c.tag, msg: c.msg }))
    .reverse();
}

const INITIAL_LINES: TelemetryLine[] = buildInitialLines();

export default function App() {
  const [estop, setEstop] = useState(false);
  const [mode, setMode] = useState('Autonomous');
  const [metSec, setMetSec] = useState(missionMeta.startMetSec);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lines, setLines] = useState<TelemetryLine[]>(INITIAL_LINES);
  const [paused, setPaused] = useState(false);

  const estopRef = useRef(estop);
  const pausedRef = useRef(paused);
  const tasksRef = useRef(tasks);
  const metRef = useRef(metSec);
  const lineIdRef = useRef(INITIAL_LINES.length);

  useEffect(() => void (estopRef.current = estop), [estop]);
  useEffect(() => void (pausedRef.current = paused), [paused]);
  useEffect(() => void (tasksRef.current = tasks), [tasks]);
  useEffect(() => void (metRef.current = metSec), [metSec]);

  const pushLine = useCallback((tag: Tag, msg: string) => {
    lineIdRef.current += 1;
    const line: TelemetryLine = { id: lineIdRef.current, ts: formatClock(metRef.current), tag, msg };
    setLines((prev) => [line, ...prev].slice(0, 60));
  }, []);

  const engageEstop = useCallback(() => {
    setEstop(true);
    pushLine('fault', 'e-stop engaged by operator');
    pushLine('fault', 'all actuators de-energized, brakes set');
  }, [pushLine]);

  const clearEstop = useCallback(() => {
    setEstop(false);
    pushLine('ok', 'e-stop cleared, re-running pre-flight checks');
    pushLine('ok', 'autonomy permitted');
  }, [pushLine]);

  const dispatchTask = useCallback(
    (name: string) => {
      setTasks((prev) => {
        const cleared = prev.map((t) => (t.status === 'active' ? { ...t, status: 'queued' as const, pct: 0 } : t));
        return [...cleared, { id: `disp-${Date.now()}`, name, status: 'active' as const, pct: 0 }];
      });
      pushLine('ok', `operator dispatched: ${name.toLowerCase()}`);
    },
    [pushLine],
  );

  const onMode = useCallback(
    (m: string) => {
      setMode(m);
      pushLine('info', `autonomy mode set to ${m.toLowerCase()}`);
    },
    [pushLine],
  );

  const onCommand = useCallback((cmd: string) => pushLine('info', `command: ${cmd.toLowerCase()}`), [pushLine]);

  const stepAdvance = useCallback(() => {
    if (estopRef.current) return;
    const cur = tasksRef.current;
    const idx = cur.findIndex((t) => t.status === 'active');
    if (idx < 0) return;
    const active = cur[idx];
    const pct = active.pct + 1 + Math.floor(Math.random() * 3);
    const next = cur.slice();
    if (pct >= 100) {
      next[idx] = { ...active, pct: 100, status: 'done' };
      const qi = next.findIndex((t) => t.status === 'queued');
      if (qi >= 0) {
        next[qi] = { ...next[qi], status: 'active', pct: 0 };
        pushLine('ok', `task complete: ${active.name.toLowerCase()}`);
        pushLine('info', `dispatching next task: ${next[qi].name.toLowerCase()}`);
      } else {
        pushLine('ok', 'mission plan MX-7741 complete');
      }
    } else {
      next[idx] = { ...active, pct };
    }
    setTasks(next);
  }, [pushLine]);

  useEffect(() => {
    const clock = window.setInterval(() => setMetSec((s) => s + 1), 1000);
    const stream = window.setInterval(() => {
      if (pausedRef.current || estopRef.current) return;
      const p = telemetryPool[Math.floor(Math.random() * telemetryPool.length)];
      pushLine(tagFor(p.severity), p.message);
    }, 1500);
    const adv = window.setInterval(stepAdvance, 1400);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(stream);
      window.clearInterval(adv);
    };
  }, [pushLine, stepAdvance]);

  return (
    <div className={`app${estop ? ' is-estop' : ''}`}>
      <HeaderBar robot={robotStatus} mode={mode} metSec={metSec} estop={estop} onEstop={engageEstop} />

      <div className="alert-strip">
        <div className="alert-inner">
          <Led kind="fault" pulse />
          <span>EMERGENCY STOP ENGAGED — all motion halted, autonomy inhibited. Clear from Task Command to resume.</span>
        </div>
      </div>

      <main className="mc">
        <div className="col">
          <RobotStatusCard robot={robotStatus} estop={estop} />
          <SensorHealthPanel sensors={sensors} />
        </div>

        <div className="col">
          <MissionTimeline tasks={tasks} />
          <div className="row2">
            <PolicyConfidencePanel policies={policyConfidence} estop={estop} log={pushLine} />
            <SafetyGatesPanel gates={safetyGates} estop={estop} />
          </div>
          <TaskCommandPanel
            mode={mode}
            estop={estop}
            onMode={onMode}
            onDispatch={dispatchTask}
            onCommand={onCommand}
            onClear={clearEstop}
          />
        </div>

        <div className="col col-feed">
          <TelemetryFeed lines={lines} paused={paused} onPause={() => setPaused((p) => !p)} />
        </div>
      </main>
    </div>
  );
}
