import { ITokenBalance } from 'queries/useTokenBalances';

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
  return (
    <div>
      <label className="input-label" htmlFor={id}>
        How much do you want to Deposit in total?
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
          className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-[#4E575F] px-2 text-xs font-bold text-[#4E575F] disabled:cursor-not-allowed"
          disabled={!selectedToken}
          onClick={fillMaxAmountOnClick}
        >
          MAX
        </button>
      </div>
    </div>
  );
}
