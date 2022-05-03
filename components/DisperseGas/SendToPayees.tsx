import * as React from 'react';
import { useAccount } from 'wagmi';
import DisperseSend from './DisperseSend';
import PayeeBalance from './PayeeBalance';
import { useAddressStore } from 'store/address';
import { formatAddress } from 'utils/address';
import { DisclosureState } from 'ariakit';
import AvailableToDisperse from './AvailableToDisperse';
import { useTranslations } from 'next-intl';

export default function SendToPayees({
  dialog,
  setTransactionHash,
  transactionDialog,
  initialPayeeData,
}: {
  dialog: DisclosureState;
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
  transactionDialog: DisclosureState;
  initialPayeeData: {
    [key: string]: string;
  };
}) {
  const [{ data: accountData }] = useAccount();

  const addresses = useAddressStore();

  const [tableContents, setTableContents] = React.useState<{ [key: string]: string }>(initialPayeeData);
  const [toSend, setToSend] = React.useState<{ [key: string]: number }>({});
  const [amountState, setAmount] = React.useState<number>(0);

  function onSelectAll() {
    const newToSend: { [key: string]: number } = {};
    Object.keys(tableContents).forEach((p) => {
      newToSend[p] = Number(newToSend[p]);
    });
    setToSend(newToSend);
  }

  function onUnselectAll() {
    setToSend({});
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    const address = e.target.name;
    const newToSend = { ...toSend };
    if (checked) {
      newToSend[address] = Number(tableContents[address]);
    } else {
      delete newToSend[address];
    }
    setToSend(newToSend);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const address = e.target.name;
    const newtableContents = { ...tableContents };
    const value = e.target.value;
    newtableContents[address] = value;
    setTableContents(newtableContents);
    if (toSend[address] !== undefined) {
      const newToSend = { ...toSend };
      newToSend[address] = Number(value);
      setToSend(newToSend);
    }
  }

  function onSplitEqually() {
    const newtableContents = { ...tableContents };
    const newToSend = { ...toSend };
    const amountPerPayee = amountState / Object.keys(toSend).length;
    Object.keys(tableContents).map((p) => {
      if (toSend[p] !== undefined) {
        newToSend[p] = amountPerPayee;
        newtableContents[p] = amountPerPayee.toString();
      } else {
        newtableContents[p] = '0';
      }
    });
    setTableContents(newtableContents);
    setToSend(newToSend);
  }

  const t = useTranslations('Disperse');

  return (
    <form className="flex flex-col gap-2">
      <div className="mb-5">
        <div className="flex w-full flex-wrap items-center space-x-2">
          <label className="flex-1">
            <span className="sr-only">{t('amountToDisperse')}</span>
            <input
              onChange={(e) => {
                if (Number(e.target.value) < 0) setAmount(0);
                setAmount(Number(e.target.value));
              }}
              autoComplete="off"
              autoCorrect="off"
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minLength={1}
              maxLength={79}
              spellCheck="false"
              inputMode="decimal"
              title="Enter numbers only."
              className="input-field mt-0 flex-1"
            />
          </label>
          <button
            onClick={onSplitEqually}
            type="button"
            className="rounded border border-[#1BDBAD] bg-white py-2 px-4 text-sm font-normal text-[#23BD8F]"
          >
            {t('splitEqually')}
          </button>
        </div>
        {accountData?.address && <AvailableToDisperse id={accountData.address.toLowerCase()} />}
      </div>
      <div className="flex space-x-2">
        <button onClick={onSelectAll} type="button" className="rounded-3xl border bg-white px-3 py-[6px] text-xs">
          {t('selectAll')}
        </button>
        <button onClick={onUnselectAll} type="button" className="rounded-3xl border bg-white px-3 py-[6px] text-xs">
          {t('unselectAll')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border">
          <thead>
            <tr>
              <th className="table-description text-sm font-semibold !text-[#3D3D3D]"></th>
              <th className="table-description text-sm font-semibold !text-[#3D3D3D]">{t('nameOrAddress')}</th>
              <th className="table-description text-sm font-semibold !text-[#3D3D3D]">{t('payeeBalance')}</th>
              <th className="table-description text-sm font-semibold !text-[#3D3D3D]">{t('amountToSend')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tableContents).map((p) => (
              <tr key={p} className="table-row">
                <td className="table-description">
                  <label>
                    <input
                      type="checkbox"
                      name={p}
                      onChange={(e) => onSelect(e)}
                      checked={toSend[p] !== undefined ? true : false}
                    ></input>
                  </label>
                </td>
                <td className="table-description">
                  {addresses.addressBook.find((e) => e.id === p)?.shortName
                    ? addresses.addressBook.find((e) => e.id === p)?.shortName
                    : formatAddress(p)}
                </td>
                <td className="table-description">
                  <PayeeBalance id={p} />
                </td>
                <td className="table-description">
                  <input
                    className="input-field m-0 min-w-[8rem] py-1"
                    autoComplete="off"
                    autoCorrect="off"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder="0.0"
                    minLength={1}
                    maxLength={79}
                    spellCheck="false"
                    inputMode="text"
                    title="Enter numbers only."
                    name={p}
                    value={tableContents[p]}
                    onChange={(e) => onInputChange(e)}
                  ></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DisperseSend
        dialog={dialog}
        data={toSend}
        setTransactionHash={setTransactionHash}
        transactionDialog={transactionDialog}
      />
    </form>
  );
}
