import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { InputElement } from './types';

export const InputAmount = ({
  name,
  label,
  isRequired,
  className,
  handleChange,
  handleClick,
  ...props
}: InputElement) => {
  return (
    <label>
      <span className="input-label">{label}</span>
      <input
        className={classNames('input-field', className)}
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
        onClick={handleClick}
        {...props}
      />
    </label>
  );
};

export const InputText = ({
  name,
  label,
  isRequired,
  className,
  optional,
  showValue,
  handleChange,
  handleClick,
  ...props
}: InputElement) => {
  const t = useTranslations('Forms');
  return (
    <label>
      <span className="input-label">
        <span className="mr-2">{label}</span>
        {optional && <small className="text-neutral-500">{`(${t('optional')})`}</small>}
      </span>
      <input
        className={classNames('input-field', className)}
        name={name}
        required={isRequired}
        autoComplete="off"
        autoCorrect="off"
        type="text"
        spellCheck="false"
        onChange={handleChange}
        onClick={handleClick}
        value={showValue}
        {...props}
      />
    </label>
  );
};
