import type { RobotStatus } from '../types';
import { formatClock } from './tokens';

interface Props {
  robot: RobotStatus;
  mode: string;
  metSec: number;
  estop: boolean;
  onEstop: () => void;
}

export default function HeaderBar({ robot, mode, metSec, estop, onEstop }: Props) {
  return (
    <header className="topbar">
      <div className="bar-inner">
      <div className="brand">
        <div className="mark">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="1.5" y="1.5" width="23" height="23" rx="4" stroke="#2FD6E0" strokeOpacity=".5" />
            <circle cx="13" cy="13" r="3.2" fill="#2FD6E0" />
            <path d="M13 4v3.2M13 18.8V22M4 13h3.2M18.8 13H22" stroke="#2FD6E0" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="13" cy="13" r="6.5" stroke="#2FD6E0" strokeOpacity=".35" />
          </svg>
        </div>
        <div className="brand-txt">
          <div className="l1">PHYSICAL AI</div>
          <div className="l2">MISSION CONTROL</div>
        </div>
      </div>

      <div className="divider" />

      <div className="robot-id">
        <div>
          <div className="rid">{robot.id}</div>
          <div className="rclass">{robot.platform}</div>
        </div>
        <span className="mode-badge">
          <span className="dot" />
          <span>{mode}</span>
        </span>
      </div>

      <div className="spacer" />

      <div className="hdr-stat">
        <span className="micro">Link</span>
        <span className="val link-ok">{robot.link.toUpperCase()} · 18ms</span>
      </div>
      <div className="divider" />
      <div className="hdr-stat">
        <span className="micro">Mission time · MET</span>
        <span className="val mono">{formatClock(metSec)}</span>
      </div>

      <button
        className="estop"
        aria-label="Emergency stop"
        onClick={() => {
          if (!estop) onEstop();
        }}
      >
        <span className="ico" /> E-STOP
      </button>
      </div>
    </header>
  );
}
