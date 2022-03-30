import * as React from 'react';
import Select from 'react-select';
import { useTheme } from 'next-themes';
import { IToken } from 'types';
import { OnChangeValue } from 'react-select';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useAccount } from 'wagmi';
import { getAddress } from 'ethers/lib/utils';
import useStreamToken from 'queries/useStreamToken';
import { checkIsAmountValid } from './utils';
import BigNumber from 'bignumber.js';
interface ICreateProps {
  tokens: IToken[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

interface TokenOption {
  label: string;
  value: string;
}
interface ICheckApproval {
  tokenAddress: string;
  userAddress?: string;
  amountToDeposit: string;
}

type FormElements = {
  amountPerSec: { value: string };
  addressToStream: { value: string };
};

export const Create = ({ tokens, noBalances, isLoading, isError }: ICreateProps) => {
  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-3 text-center text-xl">
        {noBalances ? 'Create a new stream' : 'Deposit and create a new stream'}
      </h1>
      {isLoading ? (
        <Placeholder />
      ) : isError || !tokens ? (
        <ErrorBoundary message="Something went wrong" />
      ) : (
        <CreateStreamForm balancesExist={!noBalances} tokens={tokens} />
      )}
    </section>
  );
};

interface ICreateStreamForm {
  balancesExist: boolean;
  tokens: IToken[];
}

const CreateStreamForm = ({ balancesExist, tokens }: ICreateStreamForm) => {
  const [{ data: accountData }] = useAccount();

  // Format tokens options to be used in select form element
  const tokenOptions = React.useMemo(
    () =>
      tokens?.map((c) => ({
        value: c.tokenAddress,
        label: `${c.name} (${c.symbol})`,
      })),
    [tokens]
  );

  // store form values
  const tokenAddress = React.useRef('');
  const amountToDeposit = React.useRef('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const {
    mutate: checkTokenApproval,
    data: isApproved = false,
    isLoading: checkingApproval,
    error,
  } = useCheckTokenApproval();
  const {
    mutate: approveToken,
    data: approvedTransaction,
    isLoading: approvingToken,
    error: approvalError,
  } = useApproveToken();

  // function to check if a token is approved
  // TODO implement debounce
  function checkApproval({ tokenAddress, userAddress, amountToDeposit }: ICheckApproval) {
    if (tokenAddress && userAddress) {
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;
      const isAmountValid = checkIsAmountValid(amountToDeposit) && tokenDetails?.decimals;
      if (tokenDetails && isAmountValid) {
        const amount = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails.decimals);

        checkTokenApproval({
          token: tokenDetails.tokenContract,
          userAddress: userAddress,
          approveForAddress: tokenDetails.llamaContractAddress,
          approvedForAmount: amount.toFixed(0),
        });
      }
    }
  }

  // Handle changes in form
  const handleTokenChange = (token: OnChangeValue<TokenOption, false>) => {
    tokenAddress.current = token?.value ?? '';
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      amountToDeposit: amountToDeposit.current,
    });
  };
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountToDeposit.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      amountToDeposit: amountToDeposit.current,
    });
  };

  // approve token on click
  const handleApproval = () => {
    if (tokenAddress.current !== '') {
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress.current) ?? null;
      const isAmountValid = checkIsAmountValid(amountToDeposit.current) && tokenDetails?.decimals;
      if (tokenDetails && isAmountValid) {
        const amount = new BigNumber(amountToDeposit.current).multipliedBy(10 ** tokenDetails.decimals);
        // query mutation
        approveToken({
          tokenAddress: getAddress(tokenAddress.current),
          spenderAddress: getAddress(tokenDetails.llamaContractAddress),
          amountToApprove: amount.toFixed(0),
        });
      }
    }
  };

  // TODO handle error state in ui
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & FormElements;
    const amountPerSec = form.amountPerSec.value;
    const payeeAddress = form.addressToStream.value;

    if (tokenAddress.current !== '' && isApproved) {
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress.current) ?? null;

      // check if input amounts are valid
      const isAmountPerSecValid = checkIsAmountValid(amountPerSec);
      const isAmountToDepositValid = checkIsAmountValid(amountToDeposit.current);
      if (tokenDetails && isAmountPerSecValid && isAmountToDepositValid && payeeAddress) {
        // format amounts by token decimals
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(10 ** tokenDetails.decimals);
        const amtToDeposit = new BigNumber(amountToDeposit.current).multipliedBy(10 ** tokenDetails.decimals);

        // query mutation
        streamToken({
          method: 'DEPOSIT_AND_CREATE',
          amountPerSec: amtPerSec.toFixed(0),
          amountToDeposit: amtToDeposit.toFixed(0),
          payeeAddress: payeeAddress,
          llamaContractAddress: tokenDetails?.llamaContractAddress,
        });
      }
    }
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (error) return <ErrorBoundary message="Something went wrong" />;

  const isApproving = checkingApproval || approvingToken;
  const disableSubmit = isLoading || isApproving;

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <label>
        <p>{balancesExist ? 'Select a Token' : 'Select a token to deposit'}</p>
        <Select
          options={tokenOptions}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
              primary: '#3f3f46',
            },
          })}
          onChange={handleTokenChange}
          name="tokenAddress"
        />
      </label>
      <label>
        <p>Amount to deposit</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          onChange={handleDepositChange}
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <label>
        <p>Address to stream</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="addressToStream"
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <label>
        <p>Amount per sec</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="amountPerSec"
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <button
        className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
        type="button"
        disabled={disableSubmit || isApproved}
        onClick={handleApproval}
      >
        {isApproving ? '...' : isApproved ? 'Approved' : 'Approve'}
      </button>
      <button
        className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
        disabled={disableSubmit || !isApproved}
      >
        Create Stream
      </button>
    </form>
  );
};

const Placeholder = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <form className="flex flex-col space-y-4">
      <label>
        <p>Select a Token</p>
        <Select
          options={[]}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
              primary: '#3f3f46',
            },
          })}
          isLoading={true}
        />
      </label>
      <label>
        <p>Address to stream</p>
        <input type="text" className="w-full rounded border px-3 py-[6px]" />
      </label>
      <label>
        <p>Amount per sec</p>
        <input type="text" className="w-full rounded border px-3 py-[6px]" />
      </label>
      <button className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed" type="button" disabled={true}>
        Approve
      </button>
      <button className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed" type="button" disabled={true}>
        Create Stream
      </button>
    </form>
  );
};

const ErrorBoundary = ({ message }: { message: string }) => {
  return (
    <div className="rounded border p-2 dark:border-zinc-800">
      <p className="mx-2 my-4 text-center text-sm text-red-500">{message}</p>
    </div>
  );
};
