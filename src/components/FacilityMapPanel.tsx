/* ===========================================================================
   FacilityMapPanel — top-down datacenter floor map: geofence, rack rows,
   planned path, waypoints, goal reticle, and the live robot marker.
   Styling lives in index.css (.nav-map, .nav-foot, .twin-tag).
=========================================================================== */

export type NavReadout = {
  position: string;
  toGoal: string;
  heading: number;
  eta: string;
};

export default function FacilityMapPanel({
  estop = false,
  nav = { position: 'C · 14.2, 8.6', toGoal: '11.4 m', heading: 94, eta: '01:42' },
}: {
  estop?: boolean;
  nav?: NavReadout;
}) {
  return (
    <section className="panel">
      <div className="p-head">
        <span className="tab" />
        <h2>Facility Map</h2>
        <span className="meta">DC-7 · FLOOR 2</span>
      </div>
      <div className="p-body">
        <div className="nav-map">
          <svg viewBox="0 0 300 188" preserveAspectRatio="xMidYMid meet">
            <rect x={8} y={8} width={284} height={172} rx={6} fill="none" stroke="rgba(47,214,224,0.28)" strokeWidth={1.2} strokeDasharray="5 5" />
            <g fill="rgba(74,156,246,0.06)" stroke="rgba(74,156,246,0.18)" strokeWidth={0.8}>
              <rect x={36} y={34} width={86} height={22} rx={2} />
              <rect x={36} y={64} width={86} height={22} rx={2} />
              <rect x={36} y={120} width={86} height={22} rx={2} />
              <rect x={180} y={34} width={84} height={22} rx={2} />
              <rect x={180} y={100} width={84} height={22} rx={2} />
              <rect x={180} y={130} width={84} height={22} rx={2} />
            </g>
            <g fontFamily="IBM Plex Mono" fontSize={7.5} fill="rgba(96,124,149,0.9)" letterSpacing="0.1em">
              <text x={40} y={30}>COLD AISLE B</text>
              <text x={184} y={30}>COLD AISLE C</text>
              <text x={40} y={116}>PDU ROW</text>
            </g>
            {/* planned path */}
            <polyline points="40,158 40,76 150,76 150,112 226,112 226,68" fill="none" stroke="rgba(47,214,224,0.55)" strokeWidth={1.6} strokeDasharray="2 4" strokeLinecap="round" />
            {/* waypoints */}
            <circle cx={40} cy={158} r={3.4} fill="#2fd6e0" />
            <circle cx={40} cy={76} r={3} fill="#2fd6e0" />
            <circle cx={150} cy={76} r={3} fill="#2fd6e0" />
            <circle cx={226} cy={112} r={3.6} fill="none" stroke="#f4b73c" strokeWidth={1.4} />
            {/* goal reticle */}
            <g stroke="#2fd6e0" strokeWidth={1.3} fill="none">
              <circle cx={226} cy={68} r={6} />
              <line x1={226} y1={58} x2={226} y2={78} />
              <line x1={216} y1={68} x2={236} y2={68} />
            </g>
            {/* robot marker + heading cone */}
            <defs>
              <filter id="mg" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#mg)">
              <path d="M150 112 L168 105 L168 119 Z" fill="rgba(47,214,224,0.35)" />
              <circle cx={150} cy={112} r={5} fill={estop ? '#fb5a4b' : '#2fd6e0'} />
              <circle cx={150} cy={112} r={5} fill="none" stroke="#eafcff" strokeWidth={1} />
            </g>
            <text x={40} y={172} fontFamily="IBM Plex Mono" fontSize={7.5} fill="rgba(96,124,149,0.9)">DOCK</text>
          </svg>
          <div className="twin-tag tl">TOP-DOWN</div>
          <div className="twin-tag tr">SCALE 1:240</div>
        </div>
        <div className="nav-foot">
          <div className="cell"><span className="k">Position</span><span className="v cy">{nav.position}</span></div>
          <div className="cell"><span className="k">To Goal</span><span className="v">{nav.toGoal}</span></div>
          <div className="cell"><span className="k">Heading</span><span className="v">{String(Math.round(nav.heading)).padStart(3, '0')}°</span></div>
          <div className="cell"><span className="k">ETA</span><span className="v">{estop ? '—' : nav.eta}</span></div>
        </div>
      </div>
    </section>
  );
}
