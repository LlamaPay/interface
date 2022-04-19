import classNames from 'classnames';
import { InputElement } from './types';

export const InputAmount = ({ name, label, isRequired, className, handleChange, ...props }: InputElement) => {
  return (
    <label className="font-inter">
      <span>{label}</span>
      <input
        className={classNames(
          'w-full rounded border border-neutral-300 px-3 py-[11px] slashed-zero dark:border-neutral-700 dark:bg-stone-800',
          className
        )}
        name={name}
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
        onChange={handleChange}
        {...props}
      />
    </label>
  );
};

export const InputText = ({ name, label, isRequired, className, ...props }: InputElement) => {
  return (
    <label className="font-inter">
      <span>{label}</span>
      <input
        className={classNames(
          'w-full rounded border border-neutral-300 px-3 py-[11px] slashed-zero dark:border-neutral-700 dark:bg-stone-800',
          className
        )}
        name={name}
        required={isRequired}
        autoComplete="off"
        autoCorrect="off"
        type="text"
        spellCheck="false"
        {...props}
      />
    </label>
  );
};
