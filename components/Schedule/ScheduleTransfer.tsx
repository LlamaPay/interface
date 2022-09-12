import * as React from 'react';
import { DisclosureState } from 'ariakit';
import BigNumber from 'bignumber.js';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { BeatLoader } from 'react-spinners';
import { useContractWrite, useProvider } from 'wagmi';
import scheduledTransfer from 'abis/scheduledTransferContract';
import AvailableAmount from 'components/AvailableAmount';
import { FormDialog } from 'components/Dialog';
import { InputAmount, InputText, SelectToken, SubmitButton } from 'components/Form';
import { createContractAndCheckApproval } from 'components/Form/utils';
import useGetScheduledTransfers from 'queries/useGetScheduledTransfers';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import type { ITokenBalance } from 'queries/useTokenBalances';
import { formatAddress } from 'utils/address';
import { SCHEDULED_CONTRACTS_SPENDER } from 'utils/constants';
import { createERC20Contract } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';

export default function ScheduleTransfer({
  dialog,
  userAddress,
  tokens,
}: {
  dialog: DisclosureState;
  userAddress: string;
  tokens: Array<ITokenBalance>;
}) {
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');
  const [selectedToken, setSelectedToken] = React.useState<ITokenBalance | null>(tokens[0] || null);

  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  const provider = useProvider();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();
  const { data: scheduleInfo, isLoading } = useGetScheduledTransfers();

  const queryClient = useQueryClient();

  const [{}, create] = useContractWrite(
    {
      addressOrName: SCHEDULED_CONTRACTS_SPENDER,
      contractInterface: scheduledTransfer,
    },
    'create'
  );

  const [{}, rugpull] = useContractWrite(
    {
      addressOrName: SCHEDULED_CONTRACTS_SPENDER,
      contractInterface: scheduledTransfer,
    },
    'rugpull'
  );

  const [formData, setFormData] = React.useState({
    token: '',
    amount: '',
    sendTo: '',
    toSend: new Date(Date.now()).toISOString().slice(0, 10),
  });

  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);

  const checkApprovalOnChange = (token: string, amount: string) => {
    if (userAddress && provider && token.startsWith('0x') && token.length === 42 && amount !== '') {
      createContractAndCheckApproval({
        userAddress,
        tokenAddress: token,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: amount,
        approveForAddress: SCHEDULED_CONTRACTS_SPENDER,
      });
    }
  };

  const handleChange = (value: string | boolean, type: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const handleTokenChange = (token: string) => {
    // setFormData((prev) => ({ ...prev, token: e }));

    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      setSelectedToken(data);
      checkApprovalOnChange(token, formData.amount);
    } else setTokenAddress(token);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, amount: e.target.value }));
    checkApprovalOnChange(tokenAddress, e.target.value);
  };

  function onCurrentDate() {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(Date.now()).toISOString().slice(0, 10) }));
  }

  function handleCalendarClick(e: any) {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(e).toISOString().slice(0, 10) }));
    setShowCalendar(false);
  }

  function onRug(key: string) {
    rugpull({
      args: [scheduleInfo[key].token, scheduleInfo[key].to, scheduleInfo[key].amount, scheduleInfo[key].toSend],
    }).then((data) => {
      dialog.hide();
      if (data.error) {
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading('Rugging');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Rugged') : toast.error('Failed to Rugged');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const recipientAddress = form.sendTo?.value;

    const scheduledAmount = form.amount?.value;
    const scheduledDate = form.toSend?.value;

    if (tokenAddress !== '' && scheduledAmount) {
      const tokenContract = createERC20Contract({ tokenAddress: getAddress(tokenAddress), provider });
      const decimals = await tokenContract.decimals();

      const formattedAmount = new BigNumber(scheduledAmount).times(10 ** decimals).toFixed(0);

      const formattedscheduledDate = new Date(scheduledDate).getTime() / 1e3;

      // if approved, create scheduled transfers of selected token
      if (isApproved) {
        create({
          args: [tokenAddress, recipientAddress, formattedAmount, formattedscheduledDate],
        }).then((data) => {
          dialog.hide();
          if (data.error) {
            toast.error(data.error.message);
          } else {
            const toastid = toast.loading('Creating Scheduled Transfer');

            data.data.wait().then((receipt) => {
              toast.dismiss(toastid);
              receipt.status === 1 ? toast.success('Successfully Created') : toast.error('Failed to Create');
            });

            // reset form
            form.reset();
            setFormData({ token: '', amount: '', sendTo: '', toSend: new Date(Date.now()).toISOString().slice(0, 10) });
            setTokenAddress('');

            queryClient.invalidateQueries();
          }
        });
      } else {
        approveToken(
          {
            tokenAddress: tokenAddress,
            amountToApprove: formattedAmount,
            spenderAddress: SCHEDULED_CONTRACTS_SPENDER,
          },
          {
            onSettled: () => {
              createContractAndCheckApproval({
                userAddress,
                tokenAddress: tokenAddress,
                provider,
                approvalFn: checkTokenApproval,
                approvedForAmount: scheduledAmount,
                approveForAddress: SCHEDULED_CONTRACTS_SPENDER,
              });
            },
          }
        );
      }
    }
  }

  const loading = checkingApproval || approvingToken;

  return (
    <>
      <FormDialog dialog={dialog} title="Schedule Transfer" className="h-min  text-[#303030] dark:text-white">
        <form onSubmit={onSubmit} className="space-y-5">
          <InputText
            name="sendTo"
            isRequired
            label="Send To"
            placeholder="0x..."
            handleChange={(e) => handleChange(e.target.value, 'sendTo')}
          />

          <div className="mb-5">
            <SelectToken
              label="Token"
              tokens={tokenOptions}
              handleTokenChange={handleTokenChange}
              hideNewTokenForm={true}
            />
            <AvailableAmount selectedToken={selectedToken} title="Available to Schedule" />
          </div>

          <div>
            <InputAmount name="amount" label="Amount" isRequired handleChange={handleAmountChange} />
          </div>

          <div className="flex space-x-1 pb-2">
            <div className="w-full">
              <label className="input-label">To Send</label>
              <div className="relative flex">
                <input
                  name="toSend"
                  className="input-field"
                  onChange={(e) => handleChange(e.target.value, 'toSend')}
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="YYYY-MM-DD"
                  pattern="\d{4}-\d{2}-\d{2}"
                  value={formData.toSend}
                  onClick={() => setShowCalendar(true)}
                />
                <button
                  type="button"
                  className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-[#4E575F] px-2 text-xs font-bold text-[#4E575F] disabled:cursor-not-allowed"
                  onClick={onCurrentDate}
                >
                  {'Today'}
                </button>
              </div>
            </div>
          </div>

          {showCalendar && (
            <section className="max-w-xs place-self-center border px-2 py-2">
              <Calendar onChange={(e: any) => handleCalendarClick(e)} />
            </section>
          )}

          <SubmitButton className="mt-5" disabled={loading}>
            {loading ? <BeatLoader size={6} color="white" /> : isApproved ? 'Schedule Transfer' : 'Approve Token'}
          </SubmitButton>
        </form>

        {isLoading && <p className="my-5 text-center">Loading Transfer Info...</p>}

        {!isLoading && (
          <div className="my-5 overflow-x-auto">
            <table className="border">
              <thead>
                <tr>
                  <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">Type</th>
                  <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                    Address Related
                  </th>
                  <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">Amount</th>
                  <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">To Send</th>
                  <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white"></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(scheduleInfo).map((p) => (
                  <tr key={p} className="table-row">
                    <td className="table-description text-center dark:text-white">
                      <span>
                        {scheduleInfo[p].from.toLowerCase() === userAddress.toLowerCase()
                          ? 'To'
                          : scheduleInfo[p].to.toLowerCase() === userAddress.toLowerCase()
                          ? 'From'
                          : 'IDK'}
                      </span>
                    </td>
                    <td className="table-description text-center dark:text-white">
                      <span>
                        {scheduleInfo[p].from === userAddress.toLowerCase()
                          ? formatAddress(scheduleInfo[p].to)
                          : formatAddress(scheduleInfo[p].from)}
                      </span>
                    </td>
                    <td className="table-description text-center dark:text-white">
                      <span>
                        {`${scheduleInfo[p].amount / 10 ** scheduleInfo[p].decimals} ${scheduleInfo[p].tokenSymbol}`}
                      </span>
                    </td>
                    <td className="table-description text-center dark:text-white">
                      <span>{new Date(Number(scheduleInfo[p].toSend) * 1e3).toISOString().slice(0, 10)}</span>
                    </td>
                    <td className="table-description">
                      <div className="text-center">
                        <button onClick={(e) => onRug(p)} className="row-action-links">
                          Rug
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormDialog>
    </>
  );
}
