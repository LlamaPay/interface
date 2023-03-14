import classNames from 'classnames';
import * as React from 'react';

interface IBoxProps {
  className?: string;
  children?: React.ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, IBoxProps>(function B({ className, children, ...props }, ref) {
  return (
    <div
      className={classNames(
        'min-h-[280px] rounded-lg border border-opacity-5 bg-[#FCFFFE] p-6 shadow-[0px_1px_0px_rgba(0,0,0,0.05)] dark:border-lp-gray-7 dark:bg-[#141414]',
        className
      )}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  );
});
