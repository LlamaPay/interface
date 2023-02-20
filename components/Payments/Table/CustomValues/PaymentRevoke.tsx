import { paymentsContractABI } from '~/lib/abis/paymentsContract';
import { useNetworkProvider } from '~/hooks';
import toast from 'react-hot-toast';
import type { IPayments } from '~/types';
import { networkDetails } from '~/lib/networkDetails';
import { zeroAdd } from '~/utils/constants';
import { useAccount, useContractWrite } from 'wagmi';
import BigNumber from 'bignumber.js';

export default function PaymentRevokeButton({ data }: { data: IPayments }) {
  const { chainId } = useNetworkProvider();
  const { address } = useAccount();
  const contract = chainId && networkDetails[chainId].paymentsContract;
  const { writeAsync: revoke } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: (contract || zeroAdd) as `0x${string}`,
    abi: paymentsContractABI,
    functionName: 'revoke',
  });

  function handleRevoke() {
    revoke({
      recklesslySetUnpreparedArgs: [data.tokenAddress, data.payee, BigNumber(data.amount).toFixed(0), data.release],
    })
      .then((data) => {
        const toastid = toast.loading('Revoking');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Revoked') : toast.error('Failed to Revoke');
        });
      })
      .catch(() => {
        toast.error('Failed to Revoke');
      });
  }

  return (
    <>
      {data.active && address && data.payer.toLowerCase() === address.toLowerCase() && (
        <button onClick={handleRevoke} className="row-action-links font-exo float-left dark:text-white">
          Revoke
        </button>
      )}
    </>
  );
}
