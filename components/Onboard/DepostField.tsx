import * as React from 'react';
import AnimatedStream from 'components/AnimatedStream';
import { InputAmountWithMaxButton, SelectToken } from 'components/Form';
import useTokenList from 'hooks/useTokenList';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import { BeatLoader } from 'react-spinners';
import { useDepositForm } from 'hooks';
import AvailableAmount from 'components/AvailableAmount';
import { ArrowRightIcon } from '@heroicons/react/solid';

const DepositField = ({
  userAddress,
  setCreateStream,
}: {
  userAddress: string;
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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

  return <DepositForm tokens={tokens} userAddress={userAddress} setCreateStream={setCreateStream} />;
};

export function DepositForm({
  tokens,
  userAddress,
  setCreateStream,
}: {
  tokens: ITokenBalance[];
  userAddress: string;
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    checkingApproval,
    approvingToken,
    approvalError,
    confirmingDeposit,
    tokenOptions,
    handleTokenChange,
    handleInputChange,
    handleSubmit,
    depositError,
    isApproved,
    selectedToken,
    inputAmount,
    fillMaxAmountOnClick,
  } = useDepositForm({ userAddress, tokens });

  const disableApprove = checkingApproval || approvingToken;

  return (
    <>
      <form className="mx-auto mt-12 mb-7 flex w-full flex-1 flex-col gap-8 px-7 sm:mt-[104px]" onSubmit={handleSubmit}>
        <div>
          <SelectToken
            label="What token do you want to deposit?"
            tokens={tokenOptions}
            handleTokenChange={handleTokenChange}
          />
          <AvailableAmount selectedToken={selectedToken} title="Available for Deposit" />
        </div>

        <InputAmountWithMaxButton
          inputAmount={inputAmount}
          handleInputChange={handleInputChange}
          fillMaxAmountOnClick={fillMaxAmountOnClick}
          selectedToken={selectedToken}
          id="obAmountToDeposit"
        />

        {!isApproved && approvalError && (
          <p className="mb-auto mt-4 text-center text-xs text-red-500">Couldn't approve token</p>
        )}
        {isApproved && depositError && (
          <p className="mb-auto mt-4 text-center text-xs text-red-500">Couldn't deposit token amount</p>
        )}

        {isApproved ? (
          <button className="form-submit-button" disabled={confirmingDeposit}>
            {confirmingDeposit ? <BeatLoader size={6} color="white" /> : 'Deposit'}
          </button>
        ) : (
          <button className="form-submit-button" disabled={disableApprove}>
            {checkingApproval ? (
              <BeatLoader size={6} color="white" />
            ) : approvingToken ? (
              <BeatLoader size={6} color="white" />
            ) : (
              'Approve on Wallet'
            )}
          </button>
        )}
      </form>
      <div className="m-7">
        <button
          className="form-submit-button mx-auto flex w-full max-w-xs items-center justify-center gap-2 bg-white text-[#23BD8F]"
          onClick={() => setCreateStream(true)}
        >
          <span>Create a Stream</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

export default DepositField;
