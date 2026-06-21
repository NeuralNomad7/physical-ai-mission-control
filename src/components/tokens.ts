import type { GateStatus, Severity, StatusLevel } from '../types';

// Formatting + status→CSS-modifier helpers. The dashboard styling lives in
// index.css (ported from the reference mockup); these map domain enums to the
// class modifiers those rules expect.

export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Format a number of seconds as HH:MM:SS. */
export const formatClock = (totalSec: number): string => {
  const s = Math.max(0, Math.floor(totalSec));
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
};

export type LedKind = 'ok' | 'warn' | 'fault' | 'idle';
export const ledFor = (s: StatusLevel): LedKind =>
  s === 'nominal' ? 'ok' : s === 'warning' ? 'warn' : s === 'critical' ? 'fault' : 'idle';

export type GateKind = 'pass' | 'hold' | 'trip';
export const gateKind = (s: GateStatus): GateKind => (s === 'pass' ? 'pass' : s === 'hold' ? 'hold' : 'trip');
export const gateLed = (k: GateKind): LedKind => (k === 'pass' ? 'ok' : k === 'hold' ? 'warn' : 'fault');

export type Tag = 'info' | 'ok' | 'warn' | 'fault';
export const tagFor = (s: Severity): Tag =>
  s === 'ok' ? 'ok' : s === 'warn' ? 'warn' : s === 'error' ? 'fault' : 'info';
