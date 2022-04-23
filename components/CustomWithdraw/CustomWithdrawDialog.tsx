import React from 'react';
import CustomWithdrawSubmit from './CustomWithdrawSubmit';
import useTokenList from 'hooks/useTokenList';

export default function CustomWithdrawalDialog() {
  const { data: tokens } = useTokenList();
  const [contract, setContract] = React.useState<string>('');
  const [payer, setPayer] = React.useState<string>('');
  const [payee, setPayee] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<string>('month');

  return (
    <form>
      <div className="space-y-2">
        <div>
          <label className="input-label">Token:</label>
          <select className="input-field" onChange={(e) => setContract(e.target.value)}>
            {tokens?.map((p) => (
              <option key={p.tokenAddress} value={p.llamaContractAddress}>
                <p>{`${p.name} (${p.symbol})`}</p>
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Payer:</label>
          <input className="input-field" onChange={(e) => setPayer(e.target.value)} />
        </div>
        <div>
          <label className="input-label">Payee:</label>
          <input className="input-field" onChange={(e) => setPayee(e.target.value)} />
        </div>
        <div>
          <label className="input-label">Streamed Amount:</label>
          <div className=" relative flex">
            <input className="input-field" onChange={(e) => setAmount(Number(e.target.value))} />
            <select
              required
              className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 text-sm shadow-sm dark:bg-stone-600"
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>
        <CustomWithdrawSubmit contract={contract} payer={payer} payee={payee} amount={amount} duration={duration} />
      </div>
    </form>
  );
}
