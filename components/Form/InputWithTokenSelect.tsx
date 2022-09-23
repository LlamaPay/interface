import * as React from 'react';
import classNames from 'classnames';
import { SelectToken } from './SelectToken';
import { InputWithTokenSelectProps } from './types';

export const InputWithTokenSelect = ({
  name,
  label,
  isRequired,
  className,
  handleTokenChange,
  handleInputChange,
  tokenOptions,
  tokenBalanceOf,
  ...props
}: InputWithTokenSelectProps) => {
  return (
    <div>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <div className="relative flex">
        <input
          className={classNames('input-field', className)}
          name={name}
          id={name}
          required={isRequired}
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0.0"
          minLength={1}
          maxLength={79}
          spellCheck="false"
          inputMode="decimal"
          title="Enter numbers only."
          onChange={handleInputChange}
          {...props}
        />
        {tokenOptions && (
          <SelectToken
            handleTokenChange={handleTokenChange}
            tokens={tokenOptions}
            className="absolute right-[4px] bottom-[4px] top-[8px] my-auto w-min max-w-[40%] border-lp-gray-1 shadow-sm dark:border-lp-gray-2"
            tokenBalanceOf={tokenBalanceOf}
          />
        )}
      </div>
    </div>
  );
};
