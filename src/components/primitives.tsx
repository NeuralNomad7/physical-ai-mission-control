import type { ReactNode } from 'react';
import type { LedKind } from './tokens';

// Shared panel chrome + status LED, styled by the ported classes in index.css.

export function Panel({
  area,
  title,
  meta,
  children,
  bodyClass = '',
}: {
  area: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  bodyClass?: string;
}) {
  return (
    <section className={`panel ${area}`}>
      <div className="p-head">
        <span className="tab" />
        <h2>{title}</h2>
        {meta != null ? <span className="meta">{meta}</span> : null}
      </div>
      <div className={`p-body ${bodyClass}`}>{children}</div>
    </section>
  );
}

export function Led({ kind, pulse = false, className = '' }: { kind: LedKind; pulse?: boolean; className?: string }) {
  return <span className={`led ${kind}${pulse ? ' pulse' : ''}${className ? ' ' + className : ''}`} />;
}
