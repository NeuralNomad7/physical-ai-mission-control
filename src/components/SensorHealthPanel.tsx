import { useEffect, useState } from 'react';
import type { SensorHealth } from '../types';
import { Led, Panel } from './primitives';
import { ledFor } from './tokens';

const genSpark = () => Array.from({ length: 10 }, () => 20 + Math.random() * 80);

export default function SensorHealthPanel({ sensors }: { sensors: SensorHealth[] }) {
  const [bars, setBars] = useState<number[][]>(() => sensors.map(() => genSpark()));

  useEffect(() => {
    const id = window.setInterval(() => setBars(sensors.map(() => genSpark())), 2500);
    return () => window.clearInterval(id);
  }, [sensors]);

  const online = sensors.filter((s) => ledFor(s.status) !== 'fault').length;

  return (
    <Panel area="a-sh" title="Sensor Health" meta={`${online} / ${sensors.length} online`}>
      <div className="sensors">
        {sensors.map((s, i) => {
          const kind = ledFor(s.status);
          return (
            <div className={`sensor ${kind}`} key={s.id}>
              <div className="top">
                <Led kind={kind} />
                <span className="nm">{s.name}</span>
                <span className="rate">{s.rateHz} Hz</span>
              </div>
              <div className="spark">
                {bars[i]?.map((h, j) => (
                  <i key={j} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
