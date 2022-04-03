import classNames from 'classnames';
import { SelectToken } from './SelectToken';

interface InputElement {
  name: string;
  label: string;
  isRequired: boolean;
  className?: string;
}

interface InputWithTokenElement extends InputElement {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTokenChange: (token: string) => void;
  tokens: string[];
}

export const InputAmount = ({ name, label, isRequired, className, ...props }: InputElement) => {
  return (
    <label>
      <span>{label}</span>
      <input
        className={classNames('w-full rounded border px-3 py-[11px] slashed-zero', className)}
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
        {...props}
      />
    </label>
  );
};

export const InputText = ({ name, label, isRequired, className, ...props }: InputElement) => {
  return (
    <label>
      <span>{label}</span>
      <input
        className={classNames('w-full rounded border px-3 py-[11px] slashed-zero', className)}
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

export const InputWithToken = ({
  name,
  handleChange,
  handleTokenChange,
  tokens,
  label,
  isRequired,
  className,
  ...props
}: InputWithTokenElement) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="relative flex">
        <input
          className={classNames('w-full rounded border px-3 py-[11px] slashed-zero', className)}
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
          onChange={handleChange}
          {...props}
        />
        <SelectToken
          handleTokenChange={handleTokenChange}
          tokens={tokens}
          className="absolute right-1 bottom-1 top-1 my-auto w-full max-w-[24%]"
        />
      </div>
    </div>
  );
};
