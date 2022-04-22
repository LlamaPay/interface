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
  ...props
}: InputWithTokenSelectProps) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="relative flex">
        <input
          className={classNames(
            'w-full rounded border border-neutral-300 px-3 pl-[11px] pr-[28%] slashed-zero dark:border-neutral-700 dark:bg-stone-800',
            className
          )}
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
            className="absolute right-1 bottom-1 top-1 my-auto w-min max-w-[40%] bg-zinc-100 shadow-sm dark:bg-stone-600"
          />
        )}
      </div>
    </div>
  );
};
