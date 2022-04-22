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
    <button className={classNames('form-submit-button', className)} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
