// Domain types for the Physical AI Mission Control dashboard.
// All data is currently mock; these contracts mirror what a real
// supervised-autonomy telemetry backend would emit.

export type RobotMode =
  | 'Autonomous'
  | 'Supervised'
  | 'Teleop'
  | 'Idle'
  | 'E-Stop';

export type LinkStatus = 'Secure' | 'Degraded' | 'Lost';

/** Generic operational health level used across sensors and subsystems. */
export type StatusLevel = 'nominal' | 'warning' | 'critical' | 'offline';

export interface Pose {
  x: number;
  y: number;
  heading: number; // degrees
}

export interface RobotStatus {
  id: string;
  platform: string;
  mode: RobotMode;
  link: LinkStatus;
  autonomy: string; // e.g. "Supervised Autonomy"
  operator: string;
  site: string;
  battery: number; // percent 0-100
  powerDrawW: number; // watts
  uptimeSec: number;
  cpuLoad: number; // percent 0-100
  thermalC: number; // core temp, deg C
  localizationConf: number; // percent 0-100
  pose: Pose;
  watchdogMs: number; // heartbeat interval
}

export type SensorType =
  | 'LiDAR'
  | 'RGB-D'
  | 'Thermal IR'
  | 'IMU'
  | 'Joint Encoders'
  | 'Force/Torque';

export interface SensorHealth {
  id: string;
  name: string;
  type: SensorType;
  status: StatusLevel;
  rateHz: number;
  detail: string; // throughput / resolution / fault summary
  integrity: number; // percent 0-100
}

export type MissionPhase = 'perception' | 'planning' | 'execution' | 'recovery';

export interface PolicyConfidence {
  phase: MissionPhase;
  label: string;
  confidence: number; // 0-100
  trend: 'up' | 'down' | 'flat';
  model: string;
}

export type GateStatus = 'pass' | 'hold' | 'fail';

export interface SafetyGate {
  id: string;
  name: string;
  status: GateStatus;
  value: string;
  limit: string;
  margin: number; // percent of limit consumed, 0-100
}

export type StepStatus = 'complete' | 'active' | 'pending' | 'blocked';

export interface MissionStep {
  id: string;
  name: string;
  phase: MissionPhase;
  status: StepStatus;
  startedAt: string; // mission-elapsed timestamp HH:MM:SS or "—"
  durationSec: number;
  detail: string;
}

export type Severity = 'info' | 'ok' | 'warn' | 'error';

export interface TelemetryEvent {
  id: string;
  t: string; // mission-elapsed timestamp HH:MM:SS
  source: string; // subsystem, e.g. PERCEPTION / SAFETY / PLANNER
  severity: Severity;
  message: string;
}

export type TaskStatus = 'done' | 'active' | 'queued';

/** Runtime mission task used by the timeline + task command console. */
export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  pct: number;
}

/** A single rendered telemetry line in the live feed. */
export interface TelemetryLine {
  id: number;
  ts: string;
  tag: 'info' | 'ok' | 'warn' | 'fault';
  msg: string;
}

/** Static descriptor for the active mission. */
export interface MissionMeta {
  name: string;
  site: string;
  zone: string;
  startMetSec: number; // mission-elapsed seconds at app load
}
