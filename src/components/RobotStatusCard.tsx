import type { RobotStatus } from '../types';
import { Panel } from './primitives';

const fmtUptime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function RobotStatusCard({ robot, estop }: { robot: RobotStatus; estop: boolean }) {
  return (
    <Panel area="a-rs" title="Robot Status" meta={`${robot.id} · DC-HALL-B`}>
      <div className="rs-state">
        <span className={`led ${estop ? 'fault' : 'ok'} pulse`} />
        <span className="big">{estop ? 'Halted' : 'Operational'}</span>
      </div>

      <div className="vitals">
        <div className="vital">
          <div className="k">Battery</div>
          <div className="v">
            {robot.battery}
            <small>%</small>
          </div>
          <div className="barline">
            <i style={{ width: `${robot.battery}%` }} />
          </div>
        </div>

        <div className="vital">
          <div className="k">CPU load</div>
          <div className="v">
            {robot.cpuLoad}
            <small>%</small>
          </div>
          <div className="barline blue">
            <i style={{ width: `${robot.cpuLoad}%` }} />
          </div>
        </div>

        <div className="vital">
          <div className="k">Core temp</div>
          <div className="v">
            {robot.thermalC.toFixed(1)}
            <small>°C</small>
          </div>
        </div>

        <div className="vital">
          <div className="k">Power draw</div>
          <div className="v">
            {robot.powerDrawW}
            <small>W</small>
          </div>
        </div>

        <div className="vital span">
          <div className="k">Location</div>
          <div className="v loc">
            {robot.site} · pose {robot.pose.x.toFixed(1)}, {robot.pose.y.toFixed(1)} · ⟳ {robot.pose.heading}°
          </div>
        </div>

        <div className="vital">
          <div className="k">
            <span className={`led ${estop ? 'idle' : 'ok'} pulse`} />
            Watchdog
          </div>
          <div className="v">
            {robot.watchdogMs}
            <small>ms</small>
          </div>
        </div>

        <div className="vital">
          <div className="k">Localization</div>
          <div className="v">
            {robot.localizationConf}
            <small>%</small>
          </div>
        </div>

        <div className="vital span">
          <div className="k">Uptime · cycles</div>
          <div className="v" style={{ fontSize: '15px' }}>
            {fmtUptime(robot.uptimeSec)} &nbsp;·&nbsp; 1,284 tasks
          </div>
        </div>
      </div>
    </Panel>
  );
}
