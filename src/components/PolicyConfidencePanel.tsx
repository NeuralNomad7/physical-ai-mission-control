import { useEffect, useRef, useState } from 'react';
import type { PolicyConfidence } from '../types';
import { Panel } from './primitives';
import type { Tag } from './tokens';

const ARC = Math.PI * 60; // semicircle arc length for r=60

// Threshold marker geometry (autonomy floor at 0.80) on the 60r arc.
const TH_ANG = Math.PI * (1 - 0.8);
const TH = {
  x1: 74 + 54 * Math.cos(TH_ANG),
  y1: 90 - 54 * Math.sin(TH_ANG),
  x2: 74 + 66 * Math.cos(TH_ANG),
  y2: 90 - 66 * Math.sin(TH_ANG),
};

const colorFor = (c: number) => (c < 0.8 ? '#FB5A4B' : c < 0.88 ? '#F0B429' : '#2FD6E0');

interface Cap {
  k: string;
  v: number;
}

interface Props {
  policies: PolicyConfidence[];
  estop: boolean;
  log: (tag: Tag, msg: string) => void;
}

export default function PolicyConfidencePanel({ policies, estop, log }: Props) {
  const base = policies.reduce((a, p) => a + p.confidence, 0) / policies.length / 100;

  const [conf, setConf] = useState(base);
  const [caps, setCaps] = useState<Cap[]>(() => policies.map((p) => ({ k: p.label, v: p.confidence / 100 })));

  const confRef = useRef(conf);
  useEffect(() => {
    confRef.current = conf;
  }, [conf]);

  useEffect(() => {
    if (estop) return; // halted — freeze jitter while e-stopped
    const id = window.setInterval(() => {
      let n = confRef.current + (Math.random() - 0.5) * 0.04;
      n = Math.max(0.74, Math.min(0.985, n));
      if (n < 0.8) log('warn', `policy confidence below autonomy threshold (${n.toFixed(2)})`);
      setConf(n);
      setCaps((prev) => prev.map((cp) => ({ ...cp, v: Math.max(0.7, Math.min(0.99, cp.v + (Math.random() - 0.5) * 0.03)) })));
    }, 3000);
    return () => window.clearInterval(id);
  }, [estop, log]);

  const c = estop ? 0 : Math.max(0, Math.min(1, conf));
  const col = colorFor(c);

  return (
    <Panel area="a-pc" title="Policy Confidence" meta="manipulation-policy v2.3.1">
      <div className="pc-wrap">
        <div className="gauge">
          <svg width="148" height="100" viewBox="0 0 148 100">
            <path d="M14 90 A60 60 0 0 1 134 90" fill="none" stroke="#27384B" strokeWidth="9" strokeLinecap="round" />
            <path
              d="M14 90 A60 60 0 0 1 134 90"
              fill="none"
              stroke={col}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={ARC}
              strokeDashoffset={ARC * (1 - c)}
              style={{ transition: 'stroke-dashoffset .5s, stroke .3s' }}
            />
            <line x1={TH.x1} y1={TH.y1} x2={TH.x2} y2={TH.y2} stroke="#F0B429" strokeWidth="2" />
          </svg>
          <div className="read">
            <div className="num" style={{ color: col }}>
              {c.toFixed(2)}
            </div>
            <div className="lbl">Confidence</div>
          </div>
          <div className="policy">min&nbsp;0.80 ▲ autonomy</div>
        </div>

        <div className="pc-caps">
          {caps.map((cap) => (
            <div className="cap" key={cap.k}>
              <div className="row">
                <span className="k">{cap.k}</span>
                <span className="v">{cap.v.toFixed(2)}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${cap.v * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
