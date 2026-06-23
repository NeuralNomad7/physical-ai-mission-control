import type { SensorHealth, SensorType } from '../types';
import { Led } from './primitives';
import { ledFor } from './tokens';

/* ===========================================================================
   SensorHealthPanel — each sensor renders its REAL output type instead of a
   generic bar: LiDAR point-cloud, stereo depth ramp, thermal heatmap, IMU
   waveform, encoder-channel spectrum, force/torque trend.
   Styling lives in index.css (.sensors/.sensor/.sviz).
   Consumes the project's SensorHealth contract (status via ledFor, rateHz),
   and picks a visualization from the sensor `type`.
=========================================================================== */

type VizKind = 'lidar' | 'depth' | 'thermal' | 'imu' | 'spectrum' | 'trend';

const KIND_BY_TYPE: Record<SensorType, VizKind> = {
  LiDAR: 'lidar',
  'RGB-D': 'depth',
  'Thermal IR': 'thermal',
  IMU: 'imu',
  'Joint Encoders': 'spectrum',
  'Force/Torque': 'trend',
};

const CAPTION: Record<VizKind, string> = {
  lidar: 'point cloud',
  depth: 'depth · stereo',
  thermal: 'thermal field',
  imu: 'accel · gyro',
  spectrum: 'encoder array',
  trend: 'force · torque',
};

/* ---- deterministic sample data (computed once at module load) ---- */
const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const LIDAR_PTS = Array.from({ length: 24 }, (_, i) => {
  const a = Math.PI * (0.1 + 0.8 * (i / 23)) + (seeded(i) - 0.5) * 0.08;
  const r = 7 + seeded(i + 50) * 27;
  return { x: 60 + r * Math.cos(a), y: 37 - r * Math.sin(a), o: 0.45 + seeded(i + 99) * 0.55 };
});
const SPECTRUM_BARS = Array.from({ length: 40 }, (_, i) => 2 + seeded(i + 7) * 13);
const TREND_PTS = Array.from({ length: 21 }, (_, i) => {
  const x = i * 6;
  return { x, y: 26 - 6 * Math.sin(i / 2.4) - seeded(i + 3) * 3 };
});

function SensorViz({ kind }: { kind: VizKind }) {
  if (kind === 'lidar') {
    const sa = Math.PI * 0.62,
      sb = Math.PI * 0.78;
    return (
      <div className="sviz">
        <svg viewBox="0 0 120 40">
          {[11, 19, 27].map((r) => (
            <path key={r} d={`M${60 - r} 37 A${r} ${r} 0 0 1 ${60 + r} 37`} fill="none" stroke="rgba(74,156,246,0.16)" strokeWidth={0.8} />
          ))}
          <path
            d={`M60 37 L${(60 + 30 * Math.cos(sa)).toFixed(1)} ${(37 - 30 * Math.sin(sa)).toFixed(1)} A30 30 0 0 1 ${(60 + 30 * Math.cos(sb)).toFixed(1)} ${(37 - 30 * Math.sin(sb)).toFixed(1)} Z`}
            fill="rgba(47,214,224,0.16)"
          />
          {LIDAR_PTS.map((p, i) => (
            <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={1.3} fill="#4a9cf6" opacity={p.o.toFixed(2)} />
          ))}
          <circle cx={60} cy={37} r={2} fill="#2fd6e0" />
        </svg>
        <span className="sw">{CAPTION.lidar}</span>
      </div>
    );
  }

  if (kind === 'depth') {
    return (
      <div className="sviz">
        <svg viewBox="0 0 120 40">
          <defs>
            <linearGradient id="dp" x1="0" x2="1">
              <stop offset="0" stopColor="#2fd6e0" />
              <stop offset="0.5" stopColor="#3f7fd0" />
              <stop offset="1" stopColor="#12233a" />
            </linearGradient>
          </defs>
          <rect width={120} height={40} fill="url(#dp)" opacity={0.42} />
          {[
            [34, 20, 12, 0.5],
            [72, 24, 15, 0.42],
            [98, 16, 9, 0.6],
          ].map(([cx, cy, r, o], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#0a1622" opacity={o} />
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="none" stroke="rgba(47,214,224,0.3)" strokeWidth={0.7} />
            </g>
          ))}
        </svg>
        <span className="sw">{CAPTION.depth}</span>
      </div>
    );
  }

  if (kind === 'thermal') {
    const cols = 18,
      rows = 6,
      cw = 120 / cols,
      ch = 40 / rows,
      hx = 12,
      hy = 2;
    const ramp = (v: number) => (v > 0.86 ? '#fb5a4b' : v > 0.7 ? '#f4842b' : v > 0.52 ? '#f4b73c' : v > 0.34 ? '#3f7fd0' : '#15324f');
    const cells = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const d = Math.hypot(c - hx, (r - hy) * 1.4) / 9;
        let v = Math.max(0, 1 - d) + (seeded(r * 31 + c) - 0.5) * 0.16;
        v = Math.min(1, Math.max(0.12, v));
        cells.push(<rect key={`${r}-${c}`} x={(c * cw).toFixed(1)} y={(r * ch).toFixed(1)} width={cw.toFixed(1)} height={ch.toFixed(1)} fill={ramp(v)} opacity={0.85} />);
      }
    return (
      <div className="sviz">
        <svg viewBox="0 0 120 40">{cells}</svg>
        <span className="sw warm">thermal · 32°–61°c</span>
      </div>
    );
  }

  if (kind === 'imu') {
    const wave = (amp: number, ph: number) => {
      let d = 'M0 20';
      for (let x = 0; x <= 120; x += 4) {
        const y = 20 - amp * Math.sin(x / 9 + ph) - amp * 0.4 * Math.sin(x / 3.5 + ph * 2);
        d += ` L${x} ${y.toFixed(1)}`;
      }
      return d;
    };
    return (
      <div className="sviz">
        <svg viewBox="0 0 120 40">
          <line x1={0} y1={20} x2={120} y2={20} stroke="rgba(120,165,205,0.12)" />
          <path d={wave(5, 0)} fill="none" stroke="#2fd6e0" strokeWidth={1.3} opacity={0.95} />
          <path d={wave(7, 1.6)} fill="none" stroke="#4a9cf6" strokeWidth={1.3} opacity={0.7} />
          <path d={wave(3, 3.1)} fill="none" stroke="#9fb3c9" strokeWidth={1.3} opacity={0.4} />
        </svg>
        <span className="sw">{CAPTION.imu}</span>
      </div>
    );
  }

  if (kind === 'spectrum') {
    return (
      <div className="sviz">
        <svg viewBox="0 0 120 40">
          <line x1={0} y1={20} x2={120} y2={20} stroke="rgba(74,156,246,0.18)" strokeDasharray="3 4" />
          {SPECTRUM_BARS.map((h, i) => (
            <rect key={i} x={i * 3} y={(20 - h / 2).toFixed(1)} width={1.6} height={h.toFixed(1)} fill="#2fd6e0" opacity={0.55} />
          ))}
        </svg>
        <span className="sw">18 ch · all homed</span>
      </div>
    );
  }

  // trend (force / torque)
  const line = 'M0 30' + TREND_PTS.map((p) => ` L${p.x} ${p.y.toFixed(1)}`).join('');
  return (
    <div className="sviz">
      <svg viewBox="0 0 120 40">
        <defs>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(54,217,127,0.32)" />
            <stop offset="1" stopColor="rgba(54,217,127,0)" />
          </linearGradient>
        </defs>
        <path d={`${line} L120 40 L0 40 Z`} fill="url(#ga)" />
        <path d={line} fill="none" stroke="#36d97f" strokeWidth={1.4} />
      </svg>
      <span className="sw">6-axis · 18 N</span>
    </div>
  );
}

function vizKind(s: SensorHealth): VizKind {
  return KIND_BY_TYPE[s.type] ?? 'imu';
}

export default function SensorHealthPanel({ sensors }: { sensors: SensorHealth[] }) {
  const online = sensors.filter((s) => ledFor(s.status) !== 'fault').length;
  return (
    <section className="panel">
      <div className="p-head">
        <span className="tab" />
        <h2>Sensor Health</h2>
        <span className="meta">
          {online} / {sensors.length} online
        </span>
      </div>
      <div className="p-body">
        <div className="sensors">
          {sensors.map((s) => {
            const kind = ledFor(s.status);
            return (
              <div className={`sensor ${kind}`} key={s.id}>
                <div className="top">
                  <Led kind={kind} />
                  <span className="nm">{s.name}</span>
                  <span className="rate">{s.rateHz} Hz</span>
                </div>
                <SensorViz kind={vizKind(s)} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
