import * as React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  disabled?: boolean;
  type?: 'submit' | 'button';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const SubmitButton = ({ disabled = false, type = 'submit', className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        'w-full rounded bg-zinc-100 px-3 py-[11px] disabled:cursor-not-allowed dark:bg-zinc-800',
        className
      )}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
