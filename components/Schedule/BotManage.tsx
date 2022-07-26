import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { networkDetails, secondsByDuration } from 'utils/constants';
import { useContractRead, useContractWrite } from 'wagmi';
import botContract from 'abis/botContract';
import { InputAmount, SubmitButton } from 'components/Form';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import useGetBotInfo from 'queries/useGetBotInfo';
import { formatAddress } from 'utils/address';

export default function BotFunds({
  dialog,
  chainId,
  accountAddress,
  nativeCurrency,
}: {
  dialog: DisclosureState;
  chainId: number;
  accountAddress: string;
  nativeCurrency: string | undefined;
}) {
  if (!chainId || !accountAddress) {
  }
  const botAddress = networkDetails[chainId].botAddress;
  const queryClient = useQueryClient();

  const { data: botInfo } = useGetBotInfo();

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'balances',
    {
      args: accountAddress,
    }
  );

  const [{}, refund] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'refund'
  );

  const [{}, deposit] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'deposit'
  );
  const [{}, cancelWithdraw] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'cancelWithdraw'
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    deposit({
      overrides: {
        value: (Number(form.amount.value) * 1e18).toString(),
      },
    }).then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Sending ${form.amount.value} ${nativeCurrency} to Bot`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Sent to Bot') : toast.error('Failed to Send to Bot');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function handleRefund() {
    refund().then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Refunding ${Number(balance) / 1e18} ${nativeCurrency}`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Refunded') : toast.error('Failed to Refund');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function handleCancel(p: string) {
    const ele = botInfo[p];
    cancelWithdraw({ args: [ele.llamaPay, ele.from, ele.to, ele.amountPerSec, ele.starts, ele.frequency] }).then(
      (data) => {
        if (data.error) {
          toast.error(data.error.message);
        } else {
          const toastid = toast.loading(`Cancelling Withdrawal`);
          data.data?.wait().then((receipt) => {
            toast.dismiss(toastid);
            receipt.status === 1 ? toast.success('Successfully Cancelled') : toast.error('Failed to Cancel');
          });
          queryClient.invalidateQueries();
        }
      }
    );
  }

  return (
    <>
      <FormDialog dialog={dialog} title="Manage Bot" className="h-min">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <div className="flex space-x-2">
            <span>{`Balance: ${(Number(balance) / 1e18).toFixed(5)} ${nativeCurrency}`}</span>
            <button className="row-action-links" onClick={handleRefund}>
              Refund
            </button>
          </div>
          <section>
            <form onSubmit={onSubmit}>
              <InputAmount name="amount" isRequired label="Amount to Deposit" />
              <SubmitButton className="mt-5">Deposit</SubmitButton>
            </form>
          </section>
          {botInfo ? (
            <div className="overflow-x-auto">
              <h1 className="pb-2">Schedule:</h1>
              <table className="border">
                <thead>
                  <tr>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Address
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Amount/Month
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Frequency
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(botInfo).map((p) => (
                    <tr key={p} className="table-row">
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].from.toLowerCase() === accountAddress.toLowerCase()
                            ? formatAddress(botInfo[p].to)
                            : formatAddress(botInfo[p].from)}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>{((botInfo[p].amountPerSec * secondsByDuration['month']) / 1e20).toFixed(5)}</span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].frequency === secondsByDuration['day']
                            ? 'Every Day'
                            : botInfo[p].frequency === secondsByDuration['week']
                            ? 'Every 7 Days'
                            : botInfo[p].frequency === secondsByDuration['biweek']
                            ? 'Every 14 Days'
                            : botInfo[p].frequency === secondsByDuration['month']
                            ? 'Every 30 days'
                            : ''}
                        </span>
                      </td>
                      <td className="table-description">
                        <div className="text-center">
                          <button className="row-action-links" onClick={(e) => handleCancel(p)}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            ''
          )}
        </span>
      </FormDialog>
    </>
  );
}
