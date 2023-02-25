import * as React from 'react';

export function BeatLoader({ size = '6px', color }: { size?: string; color?: string }) {
  return (
    <span
      className="flex h-6 items-center justify-center"
      style={{ '--circle-size': size, '--circle-color': color } as React.CSSProperties}
    >
      <span className="beat-circle"></span>
      <span className="beat-circle center"></span>
      <span className="beat-circle"></span>
    </span>
  );
}
