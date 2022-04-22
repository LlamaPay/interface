import * as React from 'react';
import AnimatedStream from 'components/AnimatedStream';
import { InputAmountWithMaxButton, SelectToken } from 'components/Form';
import useTokenList from 'hooks/useTokenList';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import { BeatLoader } from 'react-spinners';
import { useDepositForm } from 'hooks';
import AvailableAmount from 'components/AvailableAmount';

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

export function DepositForm({ tokens, userAddress }: { tokens: ITokenBalance[]; userAddress: string }) {
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
      </span>

      {!isApproved && approvalError && (
        <p className="mb-auto mt-4 text-center text-xs text-red-500">Couldn't approve token</p>
      )}
      {isApproved && depositError && (
        <p className="mb-auto mt-4 text-center text-xs text-red-500">Couldn't deposit token amount</p>
      )}

      {isApproved ? (
        <button className="form-submit-button mx-auto w-full max-w-xs" disabled={confirmingDeposit}>
          {confirmingDeposit ? <BeatLoader size={6} color="white" /> : 'Deposit'}
        </button>
      ) : (
        <button className="form-submit-button mx-auto w-full max-w-xs" disabled={disableApprove}>
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
  );
}

export default DepositField;
