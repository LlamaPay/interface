import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { useNetworkProvider } from 'hooks';
import { useAccount } from 'wagmi';
import CustomWithdrawalDialog from './CustomWithdrawDialog';

export default function CustomWithdraw() {
  const customDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();

  return (
    <>
      <button
        onClick={customDialog.toggle}
        className="secondary-button disabled:cursor-not-allowed"
        disabled={accountData && !unsupported ? false : true}
      >
        Custom Withdraw
      </button>
      <FormDialog dialog={customDialog} title="Withdraw on Behalf of Another Wallet" className="v-min h-min">
        <div className="space-y-3">
          <CustomWithdrawalDialog />
        </div>
      </FormDialog>
    </>
  );
}
