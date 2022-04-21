import AnimatedStream from 'components/AnimatedStream';
import { SelectToken } from 'components/Form';
import { useDepositForm } from 'hooks';
import useTokenList from 'hooks/useTokenList';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import * as React from 'react';

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

      {!isApproved && approvalError && <p className="text-xs text-red-500">Couldn't approve token</p>}
      {isApproved && depositError && <p className="text-xs text-red-500">Couldn't deposit token amount</p>}

      {/* TODO fix button flashing after approving a token */}
      {isApproved ? (
        <button
          className="mx-auto w-fit rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-3 px-12 font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]"
          disabled={confirmingDeposit}
        >
          {confirmingDeposit ? 'Confirming Deposit' : 'Deposit'}
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

export default DepositField;
