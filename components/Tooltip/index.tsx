import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

interface IProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: IProps) => {
  if (content === undefined) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content>
          <span className="rounded bg-zinc-200 p-1 text-xs shadow-sm dark:bg-zinc-700">{content}</span>
          {/* <TooltipPrimitive.Arrow className="fill-[rgb(228,228,231)] dark:fill-[rgb(63,63,70)]" /> */}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
