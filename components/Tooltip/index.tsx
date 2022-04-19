import * as React from 'react';
import { Button } from 'ariakit/button';
import { Tooltip as AriaTooltip, TooltipAnchor, useTooltipState } from 'ariakit/tooltip';

interface IProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: IProps) => {
  const tooltip = useTooltipState({ placement: 'bottom' });

  if (!content) return <span>{children}</span>;

  return (
    <>
      <TooltipAnchor
        state={tooltip}
        as={Button}
        className="focus-visible:ariakit-outline aria-disabled:opacity-50"
        style={{ fontWeight: 'inherit' }}
      >
        {children}
      </TooltipAnchor>
      <AriaTooltip state={tooltip} className="rounded border bg-neutral-50 py-1 px-2 text-xs drop-shadow">
        {content}
      </AriaTooltip>
    </>
  );
};

export default Tooltip;
