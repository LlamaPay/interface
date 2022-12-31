import { paymentsContractABI } from '~/lib/abis/paymentsContract';
import { useNetworkProvider } from '~/hooks';
import toast from 'react-hot-toast';
import type { IPayments } from '~/types';
import { networkDetails } from '~/lib/networkDetails';
import { zeroAdd } from '~/utils/constants';
import { useAccount, useContractWrite } from 'wagmi';

export default function PaymentRevokeButton({ data }: { data: IPayments }) {
  const { chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  const contract = chainId
    ? networkDetails[chainId].paymentsContract
      ? networkDetails[chainId].paymentsContract!
      : zeroAdd
    : zeroAdd;
  const [{}, revoke] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: paymentsContractABI,
    },
    'revoke'
  );

  function handleRevoke() {
    revoke({ args: [data.tokenAddress, data.payee, data.amount, data.release] }).then((data) => {
      if (data.error) {
        toast.error('Failed to Revoke');
      } else {
        const toastid = toast.loading('Revoking');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Revoked') : toast.error('Failed to Revoke');
        });
      }
    });
  }

  return (
    <>
      {data.active && data.payer.toLowerCase() === accountData?.address.toLowerCase() && (
        <button onClick={handleRevoke} className="row-action-links font-exo float-left dark:text-white">
          Revoke
        </button>
      )}
    </>
  );
}
