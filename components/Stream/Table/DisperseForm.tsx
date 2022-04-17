import { XCircleIcon } from '@heroicons/react/solid';
import React from 'react';
import DisperseSend from './DisperseSend';

interface DisperseFormProps {
  custom: boolean;
}

export default function DisperseForm({ custom }: DisperseFormProps) {
  const [addressState, setAddress] = React.useState<string>('');
  const [amountState, setAmount] = React.useState<number>(0);
  const [data, setdata] = React.useState<{ [key: string]: number }>({});
  function handleAddPayee() {
    const newPayeeData = { ...data };
    if (custom) {
      newPayeeData[addressState] = amountState;
    } else {
      newPayeeData[addressState] = 0;
    }
    setdata(newPayeeData);
  }
  function handleRemovePayee(key: string) {
    const newPayeeData = { ...data };
    delete newPayeeData[key];
    setdata(newPayeeData);
  }
  return (
    <div className="space-y-2">
      <form>
        <div className="space-y-2">
          <label>
            Address:
            <input
              type="text"
              autoComplete="off"
              onChange={(e) => setAddress(e.target.value)}
              name="address"
              className="w-full"
              placeholder="Enter address"
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              autoComplete="off"
              onChange={(e) => {
                if (Number(e.target.value) < 0) setAmount(0);
                setAmount(Number(e.target.value));
              }}
              name="amount"
              className="w-full"
              placeholder="0.0"
              min="0"
            />
          </label>
        </div>
      </form>
      <button type="button" className="w-full rounded-xl bg-[#23BD8F] py-2" onClick={handleAddPayee}>
        Add Address
      </button>
      <table className="border">
        <tbody>
          {Object.keys(data).map((p) => (
            <tr key={p}>
              <td className="w-72 px-2 text-sm">{p}</td>
              <td className="w-full px-2 text-center text-sm">
                {custom ? data[p] : Number(amountState) / Object.keys(data).length}
              </td>
              <td>
                <button onClick={() => handleRemovePayee(p)} className="flex align-middle">
                  <XCircleIcon className="h-6 w-6 text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DisperseSend data={data} custom={custom} amount={amountState} />
    </div>
  );
}
