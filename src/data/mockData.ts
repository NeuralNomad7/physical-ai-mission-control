import type {
  MissionMeta,
  MissionStep,
  PolicyConfidence,
  RobotStatus,
  SafetyGate,
  SensorHealth,
  Severity,
  TelemetryEvent,
} from '../types';

export const missionMeta: MissionMeta = {
  name: 'DC-INSPECT-118',
  site: 'Hyperscale Datacenter · Hall B',
  zone: 'Cold Aisle 4 → 7',
  startMetSec: 5_519, // 01:31:59 mission elapsed at load
};

export const robotStatus: RobotStatus = {
  id: 'PX-04',
  platform: 'Quadruped + 6-DOF Manipulator',
  mode: 'Autonomous',
  link: 'Secure',
  autonomy: 'Supervised Autonomy',
  operator: 'M. Okafor · Console 2',
  site: 'Hall B · Cold Aisle 4',
  battery: 78,
  powerDrawW: 412,
  uptimeSec: 6_432,
  cpuLoad: 47,
  thermalC: 52,
  localizationConf: 96,
  pose: { x: 24.6, y: -8.1, heading: 142 },
  watchdogMs: 50,
};

export const sensors: SensorHealth[] = [
  {
    id: 'lidar',
    name: 'LiDAR · VLP-32C',
    type: 'LiDAR',
    status: 'nominal',
    rateHz: 20,
    detail: '1.21M pts/s · 31 tracks',
    integrity: 99,
  },
  {
    id: 'rgbd',
    name: 'RGB-D Head Cam',
    type: 'RGB-D',
    status: 'nominal',
    rateHz: 30,
    detail: '1280×720 · depth locked',
    integrity: 97,
  },
  {
    id: 'thermal',
    name: 'Thermal IR Array',
    type: 'Thermal IR',
    status: 'warning',
    rateHz: 9,
    detail: 'flat-field recalibration',
    integrity: 81,
  },
  {
    id: 'imu',
    name: 'IMU · 9-DOF',
    type: 'IMU',
    status: 'nominal',
    rateHz: 200,
    detail: 'drift 0.02°/s',
    integrity: 99,
  },
  {
    id: 'encoders',
    name: 'Joint Encoders ×18',
    type: 'Joint Encoders',
    status: 'nominal',
    rateHz: 500,
    detail: '0 faults · all homed',
    integrity: 100,
  },
  {
    id: 'ft',
    name: 'Wrist Force/Torque',
    type: 'Force/Torque',
    status: 'nominal',
    rateHz: 1000,
    detail: '6-axis · bias OK',
    integrity: 98,
  },
];

export const missionSteps: MissionStep[] = [
  {
    id: 'rack-inspect',
    name: 'Server Rack Inspection',
    phase: 'perception',
    status: 'complete',
    startedAt: '01:12:04',
    durationSec: 612,
    detail: 'Aisle B · 24 racks · QR + asset cross-check',
  },
  {
    id: 'pick-place',
    name: 'Pick-and-Place Transfer',
    phase: 'execution',
    status: 'complete',
    startedAt: '01:22:16',
    durationSec: 488,
    detail: 'Drive caddies → staging cart · 6 units',
  },
  {
    id: 'mobile-manip',
    name: 'Mobile Manipulation',
    phase: 'execution',
    status: 'active',
    startedAt: '01:30:24',
    durationSec: 0,
    detail: 'Traverse Hall B · whole-body manipulate-while-moving',
  },
  {
    id: 'thermal-scan',
    name: 'Thermal Anomaly Scan',
    phase: 'perception',
    status: 'pending',
    startedAt: '—',
    durationSec: 0,
    detail: 'IR sweep · hotspots > 65°C flagged',
  },
  {
    id: 'cable-inspect',
    name: 'Cable Inspection',
    phase: 'perception',
    status: 'pending',
    startedAt: '—',
    durationSec: 0,
    detail: 'Underfloor harness continuity check',
  },
];

export const policyConfidence: PolicyConfidence[] = [
  {
    phase: 'perception',
    label: 'Perception',
    confidence: 94,
    trend: 'up',
    model: 'PerceptNet-v7',
  },
  {
    phase: 'planning',
    label: 'Planning',
    confidence: 88,
    trend: 'flat',
    model: 'RRT*-Hybrid',
  },
  {
    phase: 'execution',
    label: 'Execution',
    confidence: 91,
    trend: 'up',
    model: 'π0-VLA · whole-body',
  },
  {
    phase: 'recovery',
    label: 'Recovery',
    confidence: 73,
    trend: 'down',
    model: 'Reflex-Recover',
  },
];

export const safetyGates: SafetyGate[] = [
  {
    id: 'collision',
    name: 'Collision Envelope',
    status: 'pass',
    value: '0.42 m',
    limit: '≥ 0.30 m',
    margin: 40,
  },
  {
    id: 'proximity',
    name: 'Human Proximity',
    status: 'hold',
    value: '1.10 m',
    limit: '≥ 1.50 m',
    margin: 88,
  },
  {
    id: 'force',
    name: 'Force / Torque Limits',
    status: 'pass',
    value: '18 N',
    limit: '≤ 40 N',
    margin: 45,
  },
  {
    id: 'workspace',
    name: 'Workspace Bounds',
    status: 'pass',
    value: 'in-bounds',
    limit: 'Hall B geofence',
    margin: 28,
  },
  {
    id: 'watchdog',
    name: 'Watchdog Heartbeat',
    status: 'pass',
    value: '50 ms',
    limit: '≤ 100 ms',
    margin: 50,
  },
  {
    id: 'jointvel',
    name: 'Joint Velocity',
    status: 'pass',
    value: '0.80 rad/s',
    limit: '≤ 1.20 rad/s',
    margin: 66,
  },
];

export const telemetrySeed: TelemetryEvent[] = [
  { id: 't-1009', t: '01:31:58', source: 'PLANNER', severity: 'info', message: 'planner: 3 waypoints queued for aisle 7, cost 0.34' },
  { id: 't-1008', t: '01:31:42', source: 'SAFETY', severity: 'warn', message: 'safety: human proximity 1.1m, speed clamp 40%, gate hold' },
  { id: 't-1007', t: '01:31:31', source: 'PERCEPTION', severity: 'ok', message: 'perception: lidar+rgb-d fusion locked, 31 objects tracked' },
  { id: 't-1006', t: '01:31:12', source: 'THERMAL', severity: 'warn', message: 'thermal: ir array integrity 81%, flat-field recal scheduled' },
  { id: 't-1005', t: '01:30:54', source: 'EXECUTION', severity: 'ok', message: 'grasp: 6/6 confirmed on drive caddy, residual 1.8mm' },
  { id: 't-1004', t: '01:30:24', source: 'PLANNER', severity: 'info', message: 'nav: mobile manipulation engaged, whole-body controller online' },
  { id: 't-1003', t: '01:30:02', source: 'WATCHDOG', severity: 'ok', message: 'watchdog: heartbeat 50ms, 0 missed frames' },
  { id: 't-1002', t: '01:29:41', source: 'IMU', severity: 'info', message: 'tf: localization drift 0.6cm, corrected' },
  { id: 't-1001', t: '01:29:18', source: 'POLICY', severity: 'ok', message: 'policy: execution confidence 0.91, nominal' },
  { id: 't-1000', t: '01:28:52', source: 'SAFETY', severity: 'ok', message: 'safety: collision envelope 0.42m, all gates re-evaluated' },
];

/**
 * Pool of plausible telemetry lines used to synthesize a live feed.
 * Timestamps are injected at runtime as mission time advances.
 */
export const telemetryPool: ReadonlyArray<{
  source: string;
  severity: Severity;
  message: string;
}> = [
  { source: 'PERCEPTION', severity: 'ok', message: 'perception: 12 objects tracked, scene stable' },
  { source: 'EXECUTION', severity: 'ok', message: 'grasp: confidence 0.93 on target rack_unit_R7' },
  { source: 'PLANNER', severity: 'info', message: 'nav: replanning around dynamic obstacle, +0.4m detour' },
  { source: 'THERMAL', severity: 'warn', message: 'thermal: hotspot 71.2C at psu bay 3, within limit' },
  { source: 'EXECUTION', severity: 'ok', message: 'arm: trajectory executed, residual 1.8mm' },
  { source: 'SAFETY', severity: 'info', message: 'safety: human proximity 2.4m, envelope nominal' },
  { source: 'POWER', severity: 'info', message: 'battery: 0.6%/min draw, est 3h12m remaining' },
  { source: 'PERCEPTION', severity: 'ok', message: 'cable: continuity pass on bundle b-14' },
  { source: 'PERCEPTION', severity: 'info', message: 'lidar: 64-beam scan, 0 dropouts' },
  { source: 'RECOVERY', severity: 'warn', message: 'policy: switched to recovery sub-policy, regrasp' },
  { source: 'IMU', severity: 'ok', message: 'tf: localization drift 0.6cm, corrected' },
  { source: 'PLANNER', severity: 'info', message: 'planner: 3 waypoints queued for aisle 7' },
  { source: 'EXECUTION', severity: 'ok', message: 'ft: 18n within 40n envelope, contact nominal' },
  { source: 'WATCHDOG', severity: 'ok', message: 'watchdog: 50ms heartbeat, link secure' },
];
