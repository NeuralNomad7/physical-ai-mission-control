import { useState } from 'react';

/* ===========================================================================
   TaskCommandPanel — natural-language command console.
   Operators type a plain-language instruction (routed to onCommand), pick a
   suggested command chip (routed to onDispatch), switch autonomy mode, or fire
   a quick command. Same prop contract as the original panel.
   Styling lives in index.css (.nl, .nl-input, .chips/.chip, .seg, .btn*).
=========================================================================== */

type Props = {
  mode: string;
  estop: boolean;
  onMode: (m: string) => void;
  onDispatch: (name: string) => void;
  onCommand: (cmd: string) => void;
  onClear: () => void;
};

// Matches the value App initializes `mode` to, so a segment reads as selected on load.
const MODES = ['Manual', 'Autonomous', 'Assist'];

const SUGGESTIONS: { text: string; kind: string }[] = [
  { text: 'Inspect rack C-14 for thermal hotspots', kind: 'SCAN' },
  { text: 'Return to dock and recharge', kind: 'NAV' },
  { text: 'Hold position, scan for personnel', kind: 'SAFE' },
  { text: 'Photograph PDU-7 status panel', kind: 'CAPTURE' },
];

const QUICK = ['Hold', 'Resume', 'Stow Arm', 'Return Home'];

export default function TaskCommandPanel({ mode, estop, onMode, onDispatch, onCommand, onClear }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onCommand(t);
    setText('');
  };

  return (
    <section className="panel">
      <div className="p-head">
        <span className="tab" />
        <h2>Task Command</h2>
        <span className="meta">NL · π-VLA-3</span>
      </div>
      <div className="p-body">
        <div className="tc-wrap">
          {/* natural-language console */}
          <div className="tc-col nl">
            <label className="fld">
              <span className="micro">Command PX-04 — plain language</span>
              <div className="nl-input">
                <span className="pmt">›</span>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                  }}
                  placeholder="e.g. walk to rack C-14 and scan for hotspots"
                  disabled={estop}
                />
                <button className="send" onClick={submit} disabled={estop} aria-label="Send command">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </label>

            <span className="nl-sug">Suggested</span>
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button className="chip" key={s.kind} onClick={() => onDispatch(s.text)} disabled={estop}>
                  <span className="ci" />
                  {s.text}
                  <span className="ck">{s.kind}</span>
                </button>
              ))}
            </div>
          </div>

          {/* mode + quick actions */}
          <div className="tc-col">
            <label className="fld">
              <span className="micro">Autonomy Mode</span>
              <div className="seg">
                {MODES.map((m) => (
                  <button key={m} className={mode === m ? 'sel' : ''} onClick={() => onMode(m)} disabled={estop}>
                    {m}
                  </button>
                ))}
              </div>
            </label>

            <label className="fld">
              <span className="micro">Quick Commands</span>
            </label>
            <div className="btn-grid">
              {QUICK.map((q) => (
                <button key={q} className="btn" onClick={() => onCommand(q)} disabled={estop}>
                  {q}
                </button>
              ))}
            </div>

            {estop ? (
              <button className="btn primary armed" onClick={onClear}>
                Clear E-Stop
              </button>
            ) : (
              <button className="btn primary armed" onClick={() => onCommand('arm manipulator')}>
                Arm Manipulator
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
