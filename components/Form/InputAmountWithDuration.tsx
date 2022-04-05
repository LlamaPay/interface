import * as React from 'react';
import classNames from 'classnames';
import { InputAmountWithDaysProps } from './types';

export const InputAmountWithDuration = ({
  name,
  label,
  selectInputName,
  isRequired,
  className,
  ...props
}: InputAmountWithDaysProps) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="relative flex">
        <input
          className={classNames(
            'w-full rounded border border-neutral-300 px-3 py-[11px] slashed-zero dark:border-neutral-700 dark:bg-stone-800',
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
          {...props}
        />
        <label htmlFor={selectInputName} className="sr-only">
          Stream duration
        </label>
        <select
          name={selectInputName}
          id={selectInputName}
          required={isRequired}
          className="absolute right-1 bottom-1 top-1 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 shadow-sm dark:bg-stone-600"
          style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
        >
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
    </div>
  );
};
