import { XCircleIcon } from '@heroicons/react/solid';
import { ethers } from 'ethers';
import React from 'react';
import DisperseSend from './DisperseSend';

export default function DisperseForm() {
  const [addressState, setAddress] = React.useState<string>('');
  const [data, setdata] = React.useState<{ [key: string]: number }>({});
  const [amountState, setAmount] = React.useState<number>(0);
  function handleAddPayee() {
    if (!ethers.utils.isAddress(addressState.toLowerCase())) return;
    const newPayeeData = { ...data };
    newPayeeData[addressState.toLowerCase()] = 0;
    setdata(newPayeeData);
  }
  function handleRemovePayee(key: string) {
    const newPayeeData = { ...data };
    delete newPayeeData[key];
    setdata(newPayeeData);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const address = e.target.name;
    const newPayeeData = { ...data };
    newPayeeData[address] = Number(e.target.value);
    setdata(newPayeeData);
  }

  function onSplitEqually() {
    const amountPerPayee = amountState / Object.keys(data).length;
    const newPayeeData = { ...data };
    Object.keys(data).map((p) => {
      newPayeeData[p] = amountPerPayee;
    });
    setdata(newPayeeData);
  }
  return (
    <form>
      <div className="space-y-2">
        <div className="flex w-full space-x-2">
          <label>
            <input
              type="number"
              autoComplete="off"
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              name="amount"
              className="w-32"
              placeholder="0.0"
              min="0"
            />
          </label>
          <button onClick={onSplitEqually} type="button" className=" w-28 rounded-3xl bg-[#ffffff]  px-1  text-sm">
            Split Equally
          </button>
        </div>
        <div className="space-y-2">
          <label>
            Add Address:
            <input
              type="text"
              autoComplete="off"
              onChange={(e) => setAddress(e.target.value)}
              name="address"
              className="w-full"
              placeholder="Enter address"
            />
          </label>
        </div>

        <button type="button" className="w-full rounded-3xl bg-[#23BD8F] py-2" onClick={handleAddPayee}>
          Add Address
        </button>
        <table className="border">
          <tbody>
            {Object.keys(data).map((p) => (
              <tr key={p}>
                <td className="w-full px-1 text-left text-sm">{p}</td>
                <td className="w-32">
                  <label>
                    <input
                      className="w-32"
                      autoComplete="off"
                      type="number"
                      min="0"
                      name={p}
                      value={data[p] === 0 ? '' : data[p]}
                      placeholder="0.0"
                      onChange={(e) => onInputChange(e)}
                    ></input>
                  </label>
                </td>
                <td className="h-8 w-8">
                  <button onClick={() => handleRemovePayee(p)} className="flex align-middle">
                    <XCircleIcon className="h-8 w-8 text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DisperseSend data={data} />
      </div>
    </form>
  );
}
