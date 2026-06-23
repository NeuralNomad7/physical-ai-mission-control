import { Led } from './primitives';

/* ===========================================================================
   Robot3DPanel — shaded "3D model" view of PX-04 (quadruped + 6-DOF arm)
   on a holographic stage, plus an IMU attitude indicator and live joint
   diagnostics. Pure presentational SVG — no extra deps.
   Styling lives in index.css (.twin-*, .att-*, .jlist/.joint).
=========================================================================== */

type Joint = { id: string; name: string; pct: number; val: string; warn?: boolean };

const JOINTS: Joint[] = [
  { id: 'J1', name: 'BASE', pct: 58, val: '+58°' },
  { id: 'J2', name: 'SHOULDER', pct: 71, val: '+42°' },
  { id: 'J3', name: 'ELBOW', pct: 64, val: '-37°' },
  { id: 'J4', name: 'WRIST·R', pct: 49, val: '+12°' },
  { id: 'J5', name: 'WRIST·P', pct: 38, val: '-21°', warn: true },
  { id: 'J6', name: 'GRIP', pct: 82, val: 'OPEN' },
];

/** tapered limb segment between two points → polygon points string */
function limb(ax: number, ay: number, bx: number, by: number, wa: number, wb: number) {
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const p = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;
  return [
    p(ax + nx * wa, ay + ny * wa),
    p(bx + nx * wb, by + ny * wb),
    p(bx - nx * wb, by - ny * wb),
    p(ax - nx * wa, ay - ny * wa),
  ].join(' ');
}

const JNode = ({ x, y, r = 4.6 }: { x: number; y: number; r?: number }) => (
  <>
    <circle cx={x} cy={y} r={r} fill="#0f1b26" stroke="#3c5870" strokeWidth={1.4} />
    <circle cx={x} cy={y} r={r - 2} fill="none" stroke="#2fd6e0" strokeWidth={1.3} opacity={0.9} />
  </>
);

const Foot = ({ x, y }: { x: number; y: number }) => (
  <ellipse cx={x} cy={y + 2} rx={6} ry={2.6} fill="#0c151e" stroke="#34506a" strokeWidth={1} />
);

const NearLeg = ({ h, k, f }: { h: [number, number]; k: [number, number]; f: [number, number] }) => (
  <>
    <polygon points={limb(h[0], h[1], k[0], k[1], 7, 5.5)} fill="url(#sg)" stroke="rgba(47,214,224,0.4)" strokeWidth={0.8} />
    <polygon points={limb(k[0], k[1], f[0], f[1], 5, 3.4)} fill="url(#sg)" stroke="rgba(47,214,224,0.4)" strokeWidth={0.8} />
    <Foot x={f[0]} y={f[1]} />
    <JNode x={h[0]} y={h[1]} />
    <JNode x={k[0]} y={k[1]} r={3.6} />
  </>
);

const FarLeg = ({ h, k, f }: { h: [number, number]; k: [number, number]; f: [number, number] }) => (
  <g className="robot-far">
    <polygon points={limb(h[0], h[1], k[0], k[1], 6, 4.6)} fill="url(#sf)" />
    <polygon points={limb(k[0], k[1], f[0], f[1], 4.4, 3)} fill="url(#sf)" />
    <Foot x={f[0]} y={f[1]} />
    <circle cx={h[0]} cy={h[1]} r={3.6} fill="#13202c" stroke="#2a4256" strokeWidth={1} />
  </g>
);

function RobotModel() {
  return (
    <svg className="twin-svg" viewBox="0 0 480 330" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a5670" />
          <stop offset="0.5" stopColor="#1d2f40" />
          <stop offset="1" stopColor="#0c151e" />
        </linearGradient>
        <linearGradient id="st" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#52708a" />
          <stop offset="1" stopColor="#22394c" />
        </linearGradient>
        <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2c3a" />
          <stop offset="1" stopColor="#0a121a" />
        </linearGradient>
        <radialGradient id="platg" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(47,214,224,0.12)" />
          <stop offset="1" stopColor="rgba(47,214,224,0)" />
        </radialGradient>
        <radialGradient id="gshad" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* holographic platform */}
      <ellipse cx={240} cy={286} rx={176} ry={36} fill="url(#platg)" stroke="rgba(47,214,224,0.2)" />
      <ellipse className="ping" cx={240} cy={286} rx={176} ry={36} fill="none" stroke="rgba(47,214,224,0.4)" strokeWidth={1.1} />
      <ellipse cx={240} cy={286} rx={106} ry={21} fill="none" stroke="rgba(47,214,224,0.12)" />
      <ellipse cx={236} cy={280} rx={120} ry={22} fill="url(#gshad)" />

      {/* far legs */}
      <FarLeg h={[282, 168]} k={[300, 214]} f={[292, 250]} />
      <FarLeg h={[168, 178]} k={[150, 218]} f={[160, 250]} />

      {/* body */}
      <polygon points="150,162 312,150 316,186 152,196" fill="url(#sg)" stroke="rgba(47,214,224,0.35)" strokeWidth={1} />
      <polygon points="150,162 312,150 334,134 170,146" fill="url(#st)" stroke="rgba(47,214,224,0.45)" strokeWidth={1} />
      <polyline points="170,146 334,134" fill="none" stroke="rgba(150,230,245,0.55)" strokeWidth={1} />
      <line x1={172} y1={146} x2={174} y2={194} stroke="rgba(10,18,26,0.7)" strokeWidth={1.5} />
      <rect x={206} y={158} width={62} height={11} rx={2} fill="none" stroke="rgba(47,214,224,0.3)" strokeWidth={0.9} />
      <line x1={240} y1={151} x2={242} y2={187} stroke="rgba(47,214,224,0.18)" />

      {/* sensor head */}
      <polygon points="300,146 330,140 340,152 312,160" fill="url(#st)" stroke="rgba(47,214,224,0.4)" strokeWidth={1} />
      <circle cx={326} cy={150} r={4.4} fill="#0c151e" stroke="#2fd6e0" strokeWidth={1.4} />
      <circle cx={326} cy={150} r={1.8} fill="#2fd6e0" />

      {/* 6-DOF manipulator */}
      <rect x={300} y={124} width={26} height={14} rx={3} fill="url(#st)" stroke="rgba(47,214,224,0.4)" strokeWidth={1} />
      <polygon points={limb(314, 128, 348, 90, 6, 5)} fill="url(#sg)" stroke="rgba(47,214,224,0.4)" strokeWidth={0.8} />
      <polygon points={limb(348, 90, 396, 106, 5, 4)} fill="url(#sg)" stroke="rgba(47,214,224,0.4)" strokeWidth={0.8} />
      <polygon points={limb(396, 106, 418, 94, 4, 3)} fill="url(#sg)" stroke="rgba(47,214,224,0.4)" strokeWidth={0.8} />
      <path d="M418 94 l9 -5 M418 96 l9 5" stroke="#2fd6e0" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <JNode x={314} y={128} r={4} />
      <JNode x={348} y={90} r={4} />
      <JNode x={396} y={106} r={3.6} />

      {/* near legs */}
      <NearLeg h={[296, 184]} k={[316, 228]} f={[304, 260]} />
      <NearLeg h={[176, 192]} k={[158, 232]} f={[170, 262]} />

      {/* targeting reticle */}
      <g stroke="rgba(47,214,224,0.35)" strokeWidth={1.4} fill="none">
        <path d="M118 100 h-12 v12 M386 100 h12 v12 M118 252 h-12 v-12 M386 252 h12 v-12" />
      </g>
    </svg>
  );
}

export type AttitudeReadout = { pitch: number; roll: number; yaw: number; gait: string };

export default function Robot3DPanel({
  estop = false,
  attitude = { pitch: 0.2, roll: 1.1, yaw: 94, gait: 'TROT' },
  joints = JOINTS,
}: {
  estop?: boolean;
  attitude?: AttitudeReadout;
  joints?: Joint[];
}) {
  return (
    <section className="panel">
      <div className="p-head">
        <span className="tab" />
        <h2>Robot · 3D Model</h2>
        <span className="meta">PX-04 · 1:1 SYNC · 40ms</span>
      </div>
      <div className="p-body">
        <div className="twin-body">
          <div className="twin-stage">
            <RobotModel />
            <div className="twin-scan" />
            <div className="twin-tag tl">
              <Led kind={estop ? 'fault' : 'ok'} />
              PX-04 · {estop ? 'HALTED' : 'LIVE'}
            </div>
            <div className="twin-tag tr">SYNC {estop ? 'HOLD' : 'LIVE'}</div>
            <div className="twin-tag bl">VIEW · ISO 3/4</div>
            <div className="twin-tag br">12 DOF · 18 ACT</div>
          </div>

          <div className="twin-side">
            <div className="att">
              <div className="att-ring">
                <div
                  className="horizon"
                  style={{ transform: `translateY(${(attitude.pitch * 6).toFixed(1)}px) rotate(${(-attitude.roll).toFixed(1)}deg)` }}
                />
                <div className="crosshair" />
              </div>
              <div className="att-read">
                <div><div className="k">Pitch</div><div className="v cy">{attitude.pitch.toFixed(1)}°</div></div>
                <div><div className="k">Roll</div><div className="v">{attitude.roll.toFixed(1)}°</div></div>
                <div><div className="k">Yaw</div><div className="v">{String(Math.round(attitude.yaw)).padStart(3, '0')}°</div></div>
                <div><div className="k">Gait</div><div className="v">{attitude.gait}</div></div>
              </div>
            </div>

            <div className="jlist">
              {joints.map((j) => (
                <div className={`joint${j.warn ? ' warn' : ''}`} key={j.id}>
                  <span className="jn">{j.id}</span>
                  <span className="jname">{j.name}</span>
                  <span className="jbar"><i style={{ width: `${j.pct}%` }} /></span>
                  <span className="jval">{j.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
