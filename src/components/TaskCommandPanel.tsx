import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { missionSteps } from '../data/mockData';
import { Panel } from './primitives';

const modes = [
  { value: 'Autonomous', label: 'Auto' },
  { value: 'Assisted', label: 'Assist' },
  { value: 'Teleop', label: 'Teleop' },
];

const flightControls = ['Pause', 'Resume', 'Hold position', 'Return to dock'];
const taskNames = missionSteps.map((s) => s.name);

interface Props {
  mode: string;
  estop: boolean;
  onMode: (mode: string) => void;
  onDispatch: (name: string) => void;
  onCommand: (cmd: string) => void;
  onClear: () => void;
}

export default function TaskCommandPanel({ mode, estop, onMode, onDispatch, onCommand, onClear }: Props) {
  const [task, setTask] = useState(taskNames[0]);
  const [armed, setArmed] = useState(false);
  const armRef = useRef<number | undefined>(undefined);

  const handleDispatch = () => {
    if (estop) return;
    if (!armed) {
      setArmed(true);
      armRef.current = window.setTimeout(() => setArmed(false), 3000);
      return;
    }
    if (armRef.current) window.clearTimeout(armRef.current);
    setArmed(false);
    onDispatch(task);
  };

  return (
    <Panel area="a-tc" title="Task Command" meta="Operator console">
      <div className="tc-wrap">
        <div className="tc-col">
          <label className="fld">
            <span className="micro">Autonomy mode</span>
            <div className="seg">
              {modes.map((m) => (
                <button
                  key={m.value}
                  className={m.value === mode ? 'sel' : ''}
                  onClick={() => {
                    if (!estop) onMode(m.value);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </label>

          <label className="fld">
            <span className="micro">Dispatch task</span>
            <select
              className="task"
              value={task}
              disabled={estop}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setTask(e.target.value)}
            >
              {taskNames.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>

          <button className={`btn primary${armed ? ' armed' : ''}`} disabled={estop} onClick={handleDispatch}>
            {armed ? 'Confirm dispatch' : 'Dispatch task'}
          </button>
        </div>

        <div className="tc-col">
          <span className="micro">Flight controls</span>
          <div className="btn-grid">
            {flightControls.map((cmd) => (
              <button key={cmd} className="btn" disabled={estop} onClick={() => onCommand(cmd)}>
                {cmd}
              </button>
            ))}
          </div>
          {estop ? (
            <button className="btn" style={{ borderColor: 'var(--nominal)', color: 'var(--nominal)' }} onClick={onClear}>
              Clear E-stop
            </button>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
