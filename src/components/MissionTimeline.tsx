import type { Task } from '../types';
import { Led, Panel } from './primitives';
import { pad2 } from './tokens';

export default function MissionTimeline({ tasks }: { tasks: Task[] }) {
  const active = tasks.find((t) => t.status === 'active');
  const done = tasks.filter((t) => t.status === 'done').length;
  const planPct = Math.round((done / tasks.length) * 100 + (active ? active.pct / tasks.length : 0));
  const rem = tasks.filter((t) => t.status !== 'done').length;
  const etaTotal = rem * 7;
  const eta = `${pad2(Math.floor(etaTotal / 60))}:${pad2(etaTotal % 60)}`;

  const statusText = (t: Task) =>
    t.status === 'done' ? 'Complete' : t.status === 'active' ? `Active · ${t.pct}%` : 'Queued';

  return (
    <Panel area="a-tl" title="Mission Timeline" meta={`PLAN · MX-7741 · ${tasks.length} tasks`}>
      <div className="tl-wrap">
        <div className="tl-track">
          {tasks.map((t, i) => (
            <div className={`tl-seg ${t.status}`} key={t.id}>
              <div className="idx">T-{pad2(i + 1)}</div>
              <div className="nm">{t.name}</div>
              <div className="st">{statusText(t)}</div>
            </div>
          ))}
        </div>

        <div className="tl-bar">
          <i style={{ width: `${planPct}%` }} />
        </div>

        <div className="tl-foot">
          <div className="now">
            <Led kind="ok" />
            <span className="micro">Active</span>
            <span className="t mono">{active ? active.name : 'All tasks complete'}</span>
          </div>
          <div className="micro" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span>
              ETA <span className="mono" style={{ color: 'var(--text-2)' }}>{eta}</span>
            </span>
            <span>· Plan</span>
            <span className="pct">{planPct}%</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
