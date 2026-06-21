import { useEffect, useState } from 'react';
import type { TelemetryLine } from '../types';
import { Panel } from './primitives';

interface Props {
  lines: TelemetryLine[];
  paused: boolean;
  onPause: () => void;
}

export default function TelemetryFeed({ lines, paused, onPause }: Props) {
  const [rate, setRate] = useState(42);

  useEffect(() => {
    const id = window.setInterval(() => setRate(38 + Math.floor(Math.random() * 10)), 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Panel area="a-lt" title="Live Telemetry" meta="stdout · 200 Hz bus">
      <div className="tlm-bar">
        <span className={`led ${paused ? 'idle' : 'ok'}`} />
        <span className="micro">{paused ? 'Paused' : 'Streaming'}</span>
        <span className="rate">{rate} lines/min</span>
        <button className="pausebtn" onClick={onPause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <div className="feed">
        {lines.map((l) => (
          <div className="line" key={l.id}>
            <span className="ts">{l.ts}</span>
            <span className={`tag ${l.tag}`}>{l.tag.toUpperCase()}</span>
            <span className="msg">{l.msg}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
