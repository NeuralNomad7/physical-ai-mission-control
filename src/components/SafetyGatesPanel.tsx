import type { SafetyGate } from '../types';
import { Led, Panel } from './primitives';
import { gateKind, gateLed } from './tokens';

export default function SafetyGatesPanel({ gates, estop }: { gates: SafetyGate[]; estop: boolean }) {
  const rows = gates.map((g) => ({ id: g.id, name: g.name, kind: estop ? ('trip' as const) : gateKind(g.status) }));
  const inhibit = rows.some((r) => r.kind === 'trip');

  return (
    <Panel area="a-sg" title="Safety Gates" meta={`${gates.length} interlocks`}>
      <div className="gates">
        {rows.map((r) => (
          <div className={`gate ${r.kind}`} key={r.id}>
            <Led kind={gateLed(r.kind)} />
            <span className="nm">{r.name}</span>
            <span className={`stt ${r.kind}`}>{r.kind.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className={`gate-foot ${inhibit ? 'inhibit' : 'permit'}`}>
        <Led kind={inhibit ? 'fault' : 'ok'} pulse={inhibit} />
        <span>{inhibit ? 'Autonomy inhibited' : 'Autonomy permitted'}</span>
      </div>
    </Panel>
  );
}
