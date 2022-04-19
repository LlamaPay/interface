import disperseContract from 'abis/disperseContract';
import BigNumber from 'bignumber.js';
import React from 'react';
import toast from 'react-hot-toast';
import { DISPERSE_ADDRESS } from 'utils/constants';
import { useContractWrite } from 'wagmi';

interface DisperseSendProps {
  data: { [key: string]: number };
}

export default function DisperseSend({ data }: DisperseSendProps) {
  const [{}, disperseEther] = useContractWrite(
    {
      addressOrName: DISPERSE_ADDRESS,
      contractInterface: disperseContract,
    },
    'disperseEther'
  );
  function sendGas() {
    let ether = new BigNumber(0);
    const recipients: string[] = [];
    const values: string[] = [];
    Object.keys(data).map((p) => {
      recipients.push(p);
      const value = new BigNumber(data[p]).times(1e18).toFixed(0);
      values.push(value.toString());
      ether = ether.plus(value);
    });

    console.log(ether);
    console.log(recipients);
    console.log(values);

    disperseEther({
      args: [recipients, values],
      overrides: {
        value: ether.toString(),
      },
    }).then((data) => {
      const loading = data.error ? toast.error(data.error.message) : toast.loading('Dispersing Gas');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loading);
        receipt.status === 1 ? toast.success('Successfully Dispersed Gas') : toast.error('Failed to Disperse Gas');
      });
    });
  }

  return (
    <button onClick={sendGas} type="button" className="w-full rounded-xl bg-[#23BD8F] py-2">
      Send
    </button>
  );
}
