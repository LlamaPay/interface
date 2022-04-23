import llamaContract from 'abis/llamaContract';
import { BigNumber } from 'bignumber.js';
import CustomToast from 'components/CustomToast';
import toast from 'react-hot-toast';
import { secondsByDuration } from 'utils/constants';
import { useContractRead, useContractWrite } from 'wagmi';

interface CustomWithdrawSubmitProps {
  contract: string;
  payer: string;
  payee: string;
  amount: number;
  duration: string;
}

export default function CustomWithdrawSubmit({ contract, payer, payee, amount, duration }: CustomWithdrawSubmitProps) {
  const [{}, getStreamId] = useContractRead(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
    },
    'getStreamId'
  );

  const [{}, streamToStart] = useContractRead(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
    },
    'streamToStart'
  );

  const [{}, withdraw] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
    },
    'withdraw'
  );

  function handleWithdraw() {
    let amountPerSec = '';
    if (duration === 'month') {
      amountPerSec = new BigNumber(amount * 1e20).div(secondsByDuration.month).toFixed(0);
    } else if (duration === 'year') {
      amountPerSec = new BigNumber(amount * 1e20).div(secondsByDuration.year).toFixed(0);
    }

    getStreamId({ args: [payer, payee, amountPerSec] }).then((streamId) => {
      streamToStart({ args: [streamId.data] }).then((toStart) => {
        if (toStart.data?.toString() === '0') {
          toast.error('Stream Does Not Exist');
        } else {
          withdraw({ args: [payer, payee, amountPerSec] }).then((data) => {
            const loading = data.error ? toast.error(data.error.message) : toast.loading('Withdrawing');
            data.data?.wait().then((receipt) => {
              toast.dismiss(loading);
              receipt.status === 1
                ? toast.success('Successful Withdrawn Payment')
                : toast.error('Failed to Withdraw Payment');
            });
          });
        }
      });
    });
  }
  return (
    <>
      <button onClick={handleWithdraw} type="button" className="form-submit-button">
        Withdraw
      </button>
    </>
  );
}
