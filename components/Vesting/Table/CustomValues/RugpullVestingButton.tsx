import vestingContractReadable from 'abis/vestingContractReadable';
import toast from 'react-hot-toast';
import { IVesting } from 'types';
import { useAccount, useContractWrite } from 'wagmi';

export default function RugpullVestingButton({ data }: { data: IVesting }) {
  const [{}, rug_pull] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadable,
    },
    'rug_pull',
    {
      overrides: {
        gasLimit: 180000,
      },
    }
  );

  function handleRugpull() {
    rug_pull().then((data) => {
      if (data.error) {
        toast.error('Failed to Rug');
      } else {
        const toastid = toast.loading('Rugging');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Rugged') : toast.error('Failed to Rug');
        });
      }
    });
  }
  const [{ data: accountData }] = useAccount();
  return (
    <>
      {data.admin.toLowerCase() === accountData?.address.toLowerCase() && (
        <button onClick={handleRugpull} className="row-action-links font-exo float-right dark:text-white">
          Rug
        </button>
      )}
    </>
  );
}
