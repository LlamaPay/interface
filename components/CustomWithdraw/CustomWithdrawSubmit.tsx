import llamaContract from 'abis/llamaContract';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import React from 'react';
import { secondsByDuration } from 'utils/constants';
import { useContractRead, useContractWrite, useProvider } from 'wagmi';

interface CustomWithdrawSubmitProps {
  contract: string;
  payer: string;
  payee: string;
  amount: number;
  duration: string;
}

export default function CustomWithdrawSubmit({ contract, payer, payee, amount, duration }: CustomWithdrawSubmitProps) {
  const [isError, setisError] = React.useState<boolean>(true);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const provider = useProvider();

  const [{}, getStreamId] = useContractRead(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
      signerOrProvider: provider,
    },
    'getStreamId'
  );

  const [{}, streamToStart] = useContractRead(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
      signerOrProvider: provider,
    },
    'streamToStart'
  );

  const [{}, withdraw] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: llamaContract,
      signerOrProvider: provider,
    },
    'withdraw'
  );

  function handleWithdraw() {
    setisError(false);
    if (!ethers.utils.isAddress(payer) || !ethers.utils.isAddress(payee)) {
      setisError(true);
      setErrorMessage('Invalid Address');
      return;
    }
    let amountPerSec = '';
    if (duration === 'month') {
      amountPerSec = new BigNumber(amount * 1e20).div(secondsByDuration.month).toFixed(0);
    } else if (duration === 'year') {
      amountPerSec = new BigNumber(amount * 1e20).div(secondsByDuration.year).toFixed(0);
    }

    getStreamId({ args: [payer, payee, amountPerSec] }).then((streamId) => {
      streamToStart({ args: [streamId.data] }).then((toStart) => {
        if (toStart.data?.toString() === '0') {
          setisError(true);
          setErrorMessage('Stream Does Not Exist');
          return;
        } else {
          withdraw({ args: [payer, payee, amountPerSec] }).then((data) => {
            if (data.error) {
              setisError(true);
              setErrorMessage(data.error.message);
            }
            data.data?.wait().then((receipt) => {
              if (receipt.status !== 1) {
                setisError(true);
                setErrorMessage('Failed to Send Transaction');
              }
            });
          });
        }
      });
    });
  }
  return (
    <>
      {isError ? <p className="text-center text-sm text-red-600">{errorMessage}</p> : ''}
      <button onClick={handleWithdraw} type="button" className="form-submit-button">
        Withdraw
      </button>
    </>
  );
}
