import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

interface IProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: IProps) => {
  if (!content) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content>
          <span className="rounded bg-zinc-200 p-1 text-xs shadow-sm dark:bg-zinc-700">{content}</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
