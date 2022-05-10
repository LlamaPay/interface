import * as React from 'react';
import classNames from 'classnames';
import { InputAmountWithDaysProps } from './types';
import { useTranslations } from 'next-intl';

export const InputAmountWithDuration = ({
  name,
  label,
  selectInputName,
  isRequired,
  className,
  ...props
}: InputAmountWithDaysProps) => {
  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

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
          {...props}
        />
        <label htmlFor={selectInputName} className="sr-only">
          {t1('streamDuration')}
        </label>
        <select
          name={selectInputName}
          id={selectInputName}
          required={isRequired}
          className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 text-sm shadow-sm dark:bg-stone-600"
          style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
        >
          <option value="week">{t0('week')}</option>
          <option value="month">{t0('month')}</option>
          <option value="year">{t0('year')}</option>
        </select>
      </div>
    </div>
  );
};
