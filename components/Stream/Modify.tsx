import * as React from 'react';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';
import BigNumber from 'bignumber.js';
interface ModifyProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  payee: string;
  payer: string;
  amtPerSec: number;
  contractAddress: string;
}

export const Modify = ({ isOpen, setIsOpen, payee, amtPerSec, contractAddress }: ModifyProps) => {
  const [{ data: signerData }] = useSigner();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamapayABI,
    signerOrProvider: signerData,
  });

  const options = { month: 2419200, year: 29030400 };

  const [newPayee, setNewPayee] = React.useState<string>(payee);
  const [newAmtPerSec, setNewAmtPerSec] = React.useState<number | string>(amtPerSec);
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('month');

  // TODO CHECKS AND STUFF
  const handleModifyInput = React.useCallback(() => {
    async function modifyStream() {
      try {
        // Replace with token decimals
        const actualAmtPerSec = new BigNumber(newAmtPerSec).times(1e18);
        if (selectedPeriod === 'month') actualAmtPerSec.div(options.month).toFixed(0);
        if (selectedPeriod === 'year') actualAmtPerSec.div(options.year).toFixed(0);
        await contract.modifyStream(payee, amtPerSec, newPayee, actualAmtPerSec);
      } catch {}
    }
    modifyStream();
  }, [contract, newPayee, newAmtPerSec]);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'payee') setNewPayee(value);
    if (name === 'amtpersec') setNewAmtPerSec(value);
  };

  const handlePeriodChange = (event: any) => {
    const name = event.target.name;
    setSelectedPeriod(name);
  };

  return (
    <>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader title="Modify Stream" setIsOpen={setIsOpen} />
        <div className="mt-3 flex flex-col space-y-2">
          <p className="text-md">Current Stream:</p>
          <div className=" flex space-x-2">
            <span className=" text-sm">You</span>
            <ArrowRightIcon className="h-5 w-4" />
            <span className="text-sm "> {payee}</span>
          </div>
          <span className="text-sm"> Amount Per Second: {amtPerSec / 1e18}</span>
          <p className="text-md">New Stream:</p>
          <div className="flex items-center space-x-1">
            <p className="text-sm">Payee:</p>
            <input name="payee" className="w-full text-sm" onChange={handleChange} value={newPayee} />
          </div>
          <div className="flex items-center space-x-1">
            <p className="text-sm">Per</p>
            <button
              name="month"
              onClick={handlePeriodChange}
              className={selectedPeriod === 'month' ? 'rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700' : 'text-sm'}
            >
              Month
            </button>
            <button
              name="year"
              onClick={handlePeriodChange}
              className={selectedPeriod === 'year' ? 'rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700' : 'text-sm'}
            >
              Year
            </button>
            <input name="amtpersec" className="w-full text-sm" onChange={handleChange} />
          </div>

          <button onClick={handleModifyInput} className="nav-button">
            Modify Stream
          </button>
        </div>
      </DialogWrapper>
    </>
  );
};
