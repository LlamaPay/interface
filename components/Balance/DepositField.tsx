import * as React from 'react';
import { InputAmountWithMaxButton, SelectToken } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useDepositForm } from 'hooks';
import { ITokenBalance } from 'queries/useTokenBalances';
import AvailableAmount from 'components/AvailableAmount';
import { useAccount } from 'wagmi';

interface IDepositFieldprops {
  tokens: ITokenBalance[];
  userAddress: string;
  dialog: DisclosureState;
}

const DepositField = ({ tokens, userAddress, dialog }: IDepositFieldprops) => {
  const transactionDialog = useDialogState();

  const {
    checkingApproval,
    approvingToken,
    approvalError,
    confirmingDeposit,
    tokenOptions,
    handleTokenChange,
    handleInputChange,
    handleSubmit,
    isApproved,
    depositTransaction,
    selectedToken,
    inputAmount,
    fillMaxAmountOnClick,
  } = useDepositForm({ userAddress, tokens, transactionDialog, componentDialog: dialog });

  const disableApprove = checkingApproval || approvingToken;

  return (
    <>
      <FormDialog title="" dialog={dialog} className="h-fit">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
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
            id="bdAmountToDeposit"
          />

          <p className="my-2 text-center text-sm text-red-500">{approvalError?.message}</p>

          {isApproved || process.env.NEXT_PUBLIC_SAFE === 'true' ? (
            <button disabled={confirmingDeposit} className="form-submit-button mt-5">
              {confirmingDeposit ? <BeatLoader size={6} color="white" /> : 'Deposit'}
            </button>
          ) : (
            <button disabled={disableApprove} className="form-submit-button mt-5">
              {disableApprove ? <BeatLoader size={6} color="white" /> : 'Approve on Wallet'}
            </button>
          )}
        </form>
      </FormDialog>
      {depositTransaction && (
        <TransactionDialog dialog={transactionDialog} transactionHash={depositTransaction.hash || ''} />
      )}
    </>
  );
};

export default DepositField;
