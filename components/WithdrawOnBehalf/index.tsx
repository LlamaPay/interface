import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { useNetworkProvider } from 'hooks';
import useTokenList from 'hooks/useTokenList';
import React from 'react';
import { useAccount } from 'wagmi';
import WithdrawOnBehalfSubmit from './WithdrawOnBehalfSubmit';

export default function WithdrawOnBehalf() {
  const customDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();
  const { data: tokens, isLoading, error } = useTokenList();
  const [contract, setContract] = React.useState<string>('');
  const [payer, setPayer] = React.useState<string>('');
  const [payee, setPayee] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<string>('month');

  return (
    <>
      <button
        onClick={customDialog.toggle}
        className="secondary-button disabled:cursor-not-allowed"
        disabled={accountData && !unsupported ? false : true}
      >
        Withdraw Other Wallet
      </button>
      <FormDialog dialog={customDialog} title="Withdraw on Behalf of Another Wallet" className="v-min h-min">
        <div className="space-y-3">
          <form>
            <div className="space-y-2">
              <div>
                <label className="input-label">Token:</label>
                {isLoading ? (
                  <p>Loading Token List...</p>
                ) : error ? (
                  <p>Unable to Load Tokens</p>
                ) : (
                  <select className="input-field" required onChange={(e) => setContract(e.target.value)}>
                    <option value="initOption" selected hidden disabled>
                      Choose Token
                    </option>
                    {tokens?.map((p) => (
                      <option key={p.tokenAddress} value={p.llamaContractAddress}>
                        <p>{`${p.name} (${p.symbol})`}</p>
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="input-label">Payer:</label>
                <input className="input-field" required onChange={(e) => setPayer(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Payee:</label>
                <input className="input-field" required onChange={(e) => setPayee(e.target.value)} />
              </div>
              <div>
                <label className="input-label">Streamed Amount:</label>
                <div className=" relative flex">
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) setAmount(0);
                      setAmount(Number(e.target.value));
                    }}
                  />
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
              <WithdrawOnBehalfSubmit
                dialog={customDialog}
                contract={contract}
                payer={payer}
                payee={payee}
                amount={amount}
                duration={duration}
              />
            </div>
          </form>
        </div>
      </FormDialog>
    </>
  );
}
