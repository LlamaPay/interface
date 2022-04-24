import llamaContract from 'abis/llamaContract';
import { DisclosureState } from 'ariakit';
import { BigNumber } from 'bignumber.js';
import React from 'react';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { secondsByDuration } from 'utils/constants';
import { useContractWrite, useProvider } from 'wagmi';

interface WithdrawOnBehalfSubmitProps {
  dialog: DisclosureState;
  contract: string;
  payer: string;
  payee: string;
  amount: number;
  duration: string;
}

export default function WithdrawOnBehalfSubmit({
  dialog,
  contract,
  payer,
  payee,
  amount,
  duration,
}: WithdrawOnBehalfSubmitProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const provider = useProvider();

  const [{}, withdraw] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
      signerOrProvider: provider,
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
    setIsLoading(true);
    withdraw({ args: [payer, payee, amountPerSec] }).then((data) => {
      dialog.hide();
      setIsLoading(false);
      const loading = data.error ? toast.error(data.error.message) : toast.loading('Sending Funds');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loading);
        receipt.status === 1 ? toast.success('Funds Successfully Sent') : toast.error('Error Sending Funds');
      });
    });
  }

  return (
    <>
      <button onClick={handleWithdraw} type="button" className="form-submit-button">
        {isLoading ? <BeatLoader size={6} color="white" /> : 'Withdraw'}
      </button>
    </>
  );
}
