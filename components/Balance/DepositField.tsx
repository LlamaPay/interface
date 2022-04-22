import * as React from 'react';
import { InputWithTokenSelect, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useDepositForm } from 'hooks';
import { ITokenBalance } from 'queries/useTokenBalances';

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
  } = useDepositForm({ userAddress, tokens });

  const disableApprove = checkingApproval || approvingToken;

  return (
    <>
      <FormDialog title="Deposit" dialog={dialog} className="h-fit">
        <form onSubmit={handleSubmit}>
          <InputWithTokenSelect
            name="amountToDeposit"
            label="Amount"
            handleTokenChange={handleTokenChange}
            handleInputChange={handleInputChange}
            tokenOptions={tokenOptions}
            isRequired
          />
          <p className="my-2 text-center text-sm text-red-500">{approvalError && "Couldn't approve token"}</p>
          {isApproved ? (
            <SubmitButton
              disabled={confirmingDeposit}
              className="mt-4 rounded !bg-green-200 py-2 px-3 dark:!bg-stone-600"
            >
              {confirmingDeposit ? <BeatLoader size={6} color="#171717" /> : 'Deposit'}
            </SubmitButton>
          ) : (
            <SubmitButton disabled={disableApprove} className="mt-4 rounded !bg-green-200 py-2 px-3 dark:!bg-stone-600">
              {disableApprove ? <BeatLoader size={6} color="#171717" /> : 'Approve'}
            </SubmitButton>
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
