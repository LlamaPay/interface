import toast from 'react-hot-toast';
import { useAccount, useContractWrite } from 'wagmi';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';

export default function RenounceOwnershipButton({ data }: { data: IVesting }) {
  const [{}, renounce] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadableABI,
    },
    'renounce_ownership',
    {
      overrides: {
        gasLimit: 180000,
      },
    }
  );

  function handleRenounce() {
    renounce().then((data) => {
      if (data.error) {
        toast.error('Failed to Renounce');
      } else {
        const toastid = toast.loading('Renouncing');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Renounced') : toast.error('Failed to Renounce');
        });
      }
    });
  }
  const [{ data: accountData }] = useAccount();
  return (
    <>
      {data.admin.toLowerCase() === accountData?.address.toLowerCase() && (
        <button onClick={handleRenounce} className="row-action-links font-exo float-right dark:text-white">
          Renounce
        </button>
      )}
    </>
  );
}
