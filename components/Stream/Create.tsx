import * as React from 'react';
import Select from 'react-select/creatable';
import { useTheme } from 'next-themes';
import { BigNumber, Contract } from 'ethers';
import { IToken } from 'types';
import { OnChangeValue } from 'react-select';
import useTokenApproval from 'queries/useTokenApproval';
import { useAccount } from 'wagmi';

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
  tokens: {
    tokenAddress: string;
    name: string;
    symbol: string;
    decimals: number;
    tokenContract: Contract;
    llamaTokenContract: Contract;
  }[];
}

const CreateStreamForm = ({ balancesExist, tokens }: ICreateStreamForm) => {
  const { mutate: checkTokenApproval, data, isLoading, error } = useTokenApproval();
  const [{ data: accountData }] = useAccount();

  // const tokenContract = React.useMemo(() => {
  //   if (!tokenAddress) return null;

  //   const token = tokens.find((t) => t.tokenAddress === tokenAddress);

  //   if (token) {
  //     return token.tokenContract;
  //   } else {
  //     return createContract(tokenAddress);
  //   }
  // }, [tokenAddress, tokens]);

  // const {
  //   isApproved: isTokenApproved,
  //   isLoading,
  //   tokenContractToWrite,
  //   error,
  // } = useTokenApproval({
  //   tokenAddress,
  //   tokenContract: tokenContract,
  //   approvedForAmount: BigNumber.from(100000000),
  // });

  const handleTokenChange = (token: OnChangeValue<TokenOption, false>) => {
    if (token?.value && accountData?.address) {
      const tokenDetails = tokens.find((t) => t.tokenAddress === token.value) ?? null;
      if (tokenDetails) {
        checkTokenApproval({
          token: tokenDetails.tokenContract,
          userAddress: accountData.address,
          approveForAddress: tokenDetails.llamaTokenAddress,
          approvedForAmount: BigNumber.from(1000),
        });
      }
    }
  };

  const tokenOptions = React.useMemo(
    () =>
      tokens?.map((c) => ({
        value: c.tokenAddress,
        label: `${c.name} (${c.symbol})`,
      })),
    [tokens]
  );

  const handleApproval = () => {
    // tokenContractToWrite.approve('0xF3b2e219d57c3E2141885Ca52F0c0D705ffa931f', 10000000);
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (error) return <ErrorBoundary message="Something went wrong" />;

  return (
    <form className="flex flex-col space-y-4">
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
        <input type="text" className="w-full rounded border p-1" />
      </label>
      <label>
        <p>Address to stream</p>
        <input type="text" className="w-full rounded border p-1" />
      </label>
      <label>
        <p>Amount per sec</p>
        <input type="text" className="w-full rounded border p-1" />
      </label>
      <button
        className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
        type="button"
        disabled={false}
        onClick={handleApproval}
      >
        Approve
      </button>
      <button className="nav-button mx-auto mt-2 w-full">Create Stream</button>
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
        <input type="text" className="w-full rounded border p-1" />
      </label>
      <label>
        <p>Amount per sec</p>
        <input type="text" className="w-full rounded border p-1" />
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
