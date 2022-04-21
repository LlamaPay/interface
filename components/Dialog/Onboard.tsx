import * as React from 'react';
import { DisclosureState } from 'ariakit';
import { Dialog } from 'ariakit/dialog';
import classNames from 'classnames';
import { useIsMounted } from 'hooks';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Coins } from 'components/Icons';
import { SelectToken } from 'components/Form';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import useTokenList from 'hooks/useTokenList';
import { checkApproval } from 'components/Form/utils';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import AnimatedStream from 'components/AnimatedStream';
import useDepositToken from 'queries/useDepositToken';
import BigNumber from 'bignumber.js';

interface IOnboardProps {
  dialog: DisclosureState;
  className?: string;
}

export function OnboardDialog({ dialog, className }: IOnboardProps) {
  const [{ loading: connecting }] = useConnect();

  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const mainHeader = () => {
    if (accountData) {
      return 'Deposit Token';
    } else if (connecting || accountDataLoading) {
      return 'Initializing';
    } else {
      return 'Connect your wallet';
    }
  };

  const SideContent = () => {
    if (accountData) {
      return (
        <>
          <Coins />
          <h1 className="font-exo my-6 font-bold text-[#303030]">Works with all tokens</h1>
          <p className="text-xs">
            Create streams of indefinite duration and just siphon money out of a pool, which makes it possible to top
            all streams up in a single operation and just provide money as it's needed to maintain them.
          </p>
        </>
      );
    }

    return (
      <>
        <h1 className="font-exo text-[2rem] font-bold text-[#303030]">Welcome!</h1>
        <p className="my-8 text-xs font-semibold">
          Create streams of indefinite duration and just siphon money out of a pool, which makes it possible to top all
          streams up in a single operation and just provide money as it's needed to maintain them.
        </p>
      </>
    );
  };

  return (
    <Dialog
      state={dialog}
      className={classNames(
        'border-color[#EAEAEA] absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-3xl flex-col overflow-auto rounded-2xl border bg-white shadow-[0px_0px_9px_-2px_rgba(0,0,0,0.16)] sm:left-8 sm:right-8 sm:flex-row',
        className
      )}
      id="onboard-form"
    >
      <section className="border-color[#EAEAEA] relative flex w-full flex-col justify-center bg-[#F9FDFB] p-7 sm:max-w-[16rem] sm:border-r">
        <button onClick={dialog.toggle} className="absolute top-4 right-4 sm:hidden">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="#4E575F"
            />
          </svg>
        </button>
        <SideContent />
        <a
          className="bottom-7 mt-7 text-xs underline md:absolute"
          href="https://docs.llamapay.io/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn More in our Docs
        </a>
      </section>
      <section className="relative flex flex-1 flex-col overflow-clip">
        <div
          style={{
            position: 'absolute',
            background: 'linear-gradient(210deg, #D9F4E6 13.39%, rgba(255, 255, 255, 0) 75.41%)',
            transform: 'rotate(234deg)',
            width: '1000px',
            height: '1000px',
            left: '-500px',
            top: '-690px',
            zIndex: '-10',
            borderRadius: '1000px',
          }}
          className="hidden md:block"
        ></div>

        <header className="border-color[#EAEAEA] z-10 flex items-baseline p-5 sm:border-b">
          <h1 className="font-exo flex-1 text-center text-2xl font-semibold">{mainHeader()}</h1>
          <button onClick={dialog.toggle} className="absolute top-[30px] right-[30px] hidden sm:inline">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                fill="#4E575F"
              />
            </svg>
          </button>
        </header>

        {accountData ? <DepositField userAddress={accountData.address} /> : <ConnectWallet />}
      </section>
    </Dialog>
  );
}

const DepositField = ({ userAddress }: { userAddress: string }) => {
  const { isLoading: listLoading } = useTokenList();
  const { data: tokens, isLoading: tokensLoading } = useTokenBalances();

  if (tokensLoading || listLoading) {
    return (
      <div className="mx-auto mt-12 px-7 sm:mt-[170px]">
        <div className="my-auto">
          <AnimatedStream />
        </div>
      </div>
    );
  }

  // TODO show no tokens placeholder
  if (!tokens) return null;

  return <DepositForm tokens={tokens} userAddress={userAddress} />;
};

const DepositForm = ({ tokens, userAddress }: { tokens: ITokenBalance[]; userAddress: string }) => {
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const { mutate: deposit, isLoading, data: transaction } = useDepositToken();

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  // store input amount in a ref to check against token allowance
  const inputAmount = React.useRef('');

  // handle select element change
  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      // don't check for allowance when not required
      if (inputAmount.current !== '') {
        checkApproval({
          tokenDetails: data,
          userAddress,
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
        userAddress,
        approvedForAmount: inputAmount.current,
        checkTokenApproval,
      });
    }
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // read amountToDeposit from form element
    // make sure it matches the name prop on that element
    const form = e.target as typeof e.target & { amountToDeposit: { value: string } };
    const amountToDeposit = form.amountToDeposit?.value;

    // make sure we are setting tokenAddress in the setTokenAddress and not name or symbol
    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (tokenDetails && amountToDeposit) {
      // format amount to bignumber
      const bigAmount = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails?.decimals);

      // call deposit method only if token is approved to spend
      if (isApproved && tokenDetails.llamaContractAddress) {
        deposit({
          amountToDeposit: bigAmount.toFixed(0),
          llamaContractAddress: tokenDetails.llamaContractAddress,
        });
      } else {
        approveToken(
          {
            tokenAddress: tokenAddress,
            amountToApprove: bigAmount.toFixed(0),
            spenderAddress: tokenDetails.llamaContractAddress,
          },
          {
            onSettled: () => {
              checkApproval({
                tokenDetails,
                userAddress,
                approvedForAmount: amountToDeposit,
                checkTokenApproval,
              });
            },
          }
        );
      }
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <form
      className="mx-auto mt-12 mb-7 flex w-full flex-1 flex-col justify-between gap-4 px-7 sm:mt-[104px]"
      onSubmit={handleSubmit}
    >
      <span>
        <div className="mb-[30px]">
          <SelectToken
            label="What token do you want to deposit?"
            tokens={tokenOptions}
            handleTokenChange={handleTokenChange}
            className="mt-[5px] w-full rounded border border-[#CBCBCB] bg-white !py-[0px] slashed-zero"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#303030]" htmlFor="obAmountToDeposit">
            How much do you want to Deposit in total?
          </label>
          <div className="relative flex">
            <input
              className="mt-[5px] w-full rounded border border-[#CBCBCB] px-3 py-[7px] slashed-zero"
              name="amountToDeposit"
              id="obAmountToDeposit"
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
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-[#4E575F] px-2 text-xs font-bold text-[#4E575F]"
            >
              MAX
            </button>
          </div>
        </div>
      </span>

      {isApproved ? (
        <button
          className="mx-auto w-fit rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-3 px-12 font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]"
          disabled={isLoading}
        >
          {isLoading ? 'Confirming Deposit' : 'Deposit'}
        </button>
      ) : (
        <button
          className="mx-auto w-fit rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-3 px-12 font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]"
          disabled={disableApprove}
        >
          {checkingApproval ? 'Checking Approval' : approvingToken ? 'Confirming Approval' : 'Approve on Wallet'}
        </button>
      )}
    </form>
  );
};

const ConnectWallet = () => {
  const isMounted = useIsMounted();
  const [
    {
      data: { connectors },
      loading: connecting,
    },
    connect,
  ] = useConnect();

  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect(connector);
    },
    [connect]
  );

  const hideConnectors = connecting || accountDataLoading;

  return (
    <div className="mt-12 flex flex-1 flex-col overflow-auto sm:mt-[104px]">
      <main className="mx-auto flex w-full flex-1 flex-col gap-4 px-7 sm:max-w-[26rem]">
        {hideConnectors ? (
          <AnimatedStream />
        ) : (
          <>
            {connectors.map((x) => (
              <button
                key={x.id}
                onClick={() => handleConnect(x)}
                className="mt-8 w-full rounded-xl border border-[#CDCDCD] bg-white p-2 py-4 font-bold text-[#4E575F] first-of-type:mt-0"
              >
                {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
              </button>
            ))}
          </>
        )}
      </main>
      {!accountData && (
        <p className="my-7 w-full px-5 text-center text-xs text-[#303030]">Connecting a wallet doesn't move funds</p>
      )}
    </div>
  );
};
