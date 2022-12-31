import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { ITokenBalance } from '~/queries/useTokenBalances';

interface IProps {
  inputAmount: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedToken: ITokenBalance | null;
  fillMaxAmountOnClick: () => void;
  id: string;
}

export function InputAmountWithMaxButton({
  inputAmount,
  handleInputChange,
  selectedToken,
  fillMaxAmountOnClick,
  id,
}: IProps) {
  const t = useTranslations('Forms');
  return (
    <div>
      <label className="input-label" htmlFor={id}>
        {t('amountToDeposit')}
      </label>
      <div className="relative flex">
        <input
          className="input-field"
          name="amountToDeposit"
          id={id}
          required
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
          value={inputAmount}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-lp-gray-1 px-2 text-xs font-bold disabled:cursor-not-allowed dark:border-lp-gray-2"
          disabled={!selectedToken}
          onClick={fillMaxAmountOnClick}
        >
          {t('max')}
        </button>
      </div>
    </div>
  );
}
