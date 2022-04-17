import disperseContract from 'abis/disperseContract';
import BigNumber from 'bignumber.js';
import React from 'react';
import toast from 'react-hot-toast';
import { DISPERSE_ADDRESS } from 'utils/constants';
import { useContractWrite } from 'wagmi';

interface DisperseSendProps {
  custom: boolean;
  data: { [key: string]: number };
  amount: number;
}

export default function DisperseSend({ data, custom, amount }: DisperseSendProps) {
  const [{}, disperseEther] = useContractWrite(
    {
      addressOrName: DISPERSE_ADDRESS,
      contractInterface: disperseContract,
    },
    'disperseEther'
  );
  function sendGas() {
    let ether = new BigNumber(0);
    let recipients: string[] = [];
    let values: number[] = [];
    if (custom) {
      Object.keys(data).map((p) => {
        recipients.push(p);
        const value = new BigNumber(data[p]).times(1e18).toFixed(0);
        values.push(Number(value));
        ether = ether.plus(value);
      });
    } else {
      const amountPerPayee = new BigNumber(amount / Object.keys(data).length).times(1e18).toFixed(0);
      recipients = Object.keys(data);
      values = Array(Object.keys(data).length).fill(amountPerPayee);
      ether = new BigNumber(amountPerPayee).times(Object.keys(data).length);
    }
    disperseEther({
      args: [recipients, values],
      overrides: {
        value: ether.toString(),
      },
    }).then((data) => {
      const loading = data.error ? toast.error(data.error.message) : toast.loading('Sending');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loading);
        receipt.status === 1 ? toast.success('Successfully Sent') : toast.error('Failed to Send');
      });
    });
  }

  return (
    <button onClick={sendGas} type="button" className="w-full rounded-xl bg-[#23BD8F] py-2">
      Send
    </button>
  );
}
