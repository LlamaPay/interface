import * as React from 'react';
import { Button } from 'ariakit/button';
import { Tooltip as AriaTooltip, TooltipAnchor, useTooltipState } from 'ariakit/tooltip';
import classNames from 'classnames';

interface IProps {
  children: React.ReactNode;
  content: string;
  className?: string;
  onClick?: () => void;
}

const Tooltip = ({ children, content, className, ...props }: IProps) => {
  const tooltip = useTooltipState({ placement: 'bottom' });

  if (!content) return <span>{children}</span>;

  return (
    <>
      <TooltipAnchor
        state={tooltip}
        as={Button}
        className={classNames('focus-visible:ariakit-outline aria-disabled:opacity-50', className)}
        style={{ fontWeight: 'inherit' }}
        {...props}
      >
        {children}
      </TooltipAnchor>
      <AriaTooltip
        state={tooltip}
        className="rounded border bg-neutral-50 py-1 px-2 text-xs drop-shadow dark:border-[#202020] dark:bg-[#202020]"
      >
        {content}
      </AriaTooltip>
    </>
  );
};

export default Tooltip;
