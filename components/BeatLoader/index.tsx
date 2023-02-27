import classNames from 'classnames';
import * as React from 'react';

export function BeatLoader({ size = '6px', color, className }: { size?: string; color?: string; className?: string }) {
  return (
    <span
      className={classNames('flex h-6 items-center justify-center', className)}
      style={{ '--circle-size': size, '--circle-color': color } as React.CSSProperties}
    >
      <span className="beat-circle"></span>
      <span className="beat-circle center"></span>
      <span className="beat-circle"></span>
    </span>
  );
}
