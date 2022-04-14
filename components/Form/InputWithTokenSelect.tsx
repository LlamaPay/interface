import * as React from 'react';
import classNames from 'classnames';
import { useAccount } from 'wagmi';
import { SelectToken } from './SelectToken';
import { checkApproval } from './utils';
import { InputWithTokenSelectProps } from './types';
import useTokenBalances from 'queries/useTokenBalances';

// get checkTokenApproval function from parent compoenent becuase it makes it easier to show loading and error indicators in parent component
// get tokenAddress/setTokenAddress from parent because select element is controlled , so when need to read tokenaddress value when form is submitted
export const InputWithTokenSelect = ({
  name,
  label,
  isRequired,
  className,
  tokenAddress,
  setTokenAddress,
  checkTokenApproval,
  ...props
}: InputWithTokenSelectProps) => {
  // get all token list to show in select element
  const { data: tokens } = useTokenBalances();

  // get user account address to check against token allowance
  const [{ data: accountData }] = useAccount();

  // store input amount in a ref to check against token allowance
  const inputAmount = React.useRef('');

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  // handle select element change
  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      // don't check for allowance when not required
      if (checkTokenApproval && inputAmount.current !== '') {
        checkApproval({
          tokenDetails: data,
          userAddress: accountData?.address,
          approvedForAmount: inputAmount.current,
          checkTokenApproval,
        });
      }
    } else setTokenAddress(token);
  };

  // handle input element change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // don't check for allowance when not required
    if (!checkTokenApproval) return;

    inputAmount.current = e.target.value;

    // find the prop in tokens list, prop is tokenAddress
    const data = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (data) {
      checkApproval({
        tokenDetails: data,
        userAddress: accountData?.address,
        approvedForAmount: inputAmount.current,
        checkTokenApproval,
      });
    }
  };

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
        <SelectToken
          handleTokenChange={handleTokenChange}
          tokens={tokenOptions}
          className="absolute right-1 bottom-1 top-1 my-auto w-full max-w-[24%] bg-zinc-100 shadow-sm dark:bg-stone-600"
        />
      </div>
    </div>
  );
};
