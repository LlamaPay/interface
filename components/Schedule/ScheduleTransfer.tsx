import scheduledTransfer from 'abis/scheduledTransferContract';
import { DisclosureState } from 'ariakit';
import BigNumber from 'bignumber.js';
import { FormDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import { checkApproval } from 'components/Form/utils';
import { getAddress } from 'ethers/lib/utils';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import * as React from 'react';
import Calendar from 'react-calendar';
import { BeatLoader } from 'react-spinners';
import { createERC20Contract } from 'utils/tokenUtils';
import { useContractWrite, useProvider } from 'wagmi';

export default function ScheduleTransfer({ dialog, userAddress }: { dialog: DisclosureState; userAddress: string }) {
  const provider = useProvider();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();
  const spender = '0x54976f3e6c0c150172a01bf594ee9e360115af00';
  const [{ loading }, create] = useContractWrite(
    {
      addressOrName: spender,
      contractInterface: scheduledTransfer,
    },
    'create'
  );

  const [formData, setFormData] = React.useState({
    token: '',
    amount: '',
    sendTo: '',
    toSend: new Date(Date.now()).toISOString().slice(0, 10),
  });
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }
  function onCurrentDate() {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(Date.now()).toISOString().slice(0, 10) }));
  }
  function handleCalendarClick(e: any) {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(e).toISOString().slice(0, 10) }));
    setShowCalendar(false);
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tokenContract = createERC20Contract({ tokenAddress: getAddress(formData.token), provider });
    const decimals = await tokenContract.decimals();
    const formattedAmount = new BigNumber(formData.amount).times(10 ** decimals).toFixed(0);
    const formattedToSend = new Date(formData.toSend).getTime() / 1e3;

    if (isApproved) {
      create({
        args: [formData.sendTo, formData.token, formattedAmount, formattedToSend],
      });
      setFormData({ token: '', amount: '', sendTo: '', toSend: new Date(Date.now()).toISOString().slice(0, 10) });
    } else {
      approveToken(
        {
          tokenAddress: formData.token,
          amountToApprove: formattedAmount,
          spenderAddress: spender,
        },
        {
          onSettled: () => {
            checkApproval({
              tokenDetails: { tokenContract, llamaContractAddress: spender, decimals },
              userAddress: userAddress,
              approvedForAmount: formattedAmount,
              checkTokenApproval,
            });
          },
        }
      );
    }
  }
  return (
    <>
      <FormDialog dialog={dialog} title="Schedule Transfer" className="h-min max-w-xl">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <form onSubmit={onSubmit}>
            <InputText
              name="sendTo"
              isRequired
              label="Send To"
              placeholder="0x..."
              handleChange={(e) => handleChange(e.target.value, 'sendTo')}
            />
            <InputText
              name="token"
              isRequired
              label="Token"
              placeholder="0x..."
              handleChange={(e) => handleChange(e.target.value, 'token')}
            />
            <InputAmount
              name="amount"
              label="Amount"
              isRequired
              handleChange={(e) => handleChange(e.target.value, 'amount')}
            />
            <div className="flex space-x-1 pb-2">
              <div className="w-full">
                <label className="input-label">To Send</label>
                <div className="relative flex">
                  <input
                    className="input-field"
                    onChange={(e) => handleChange(e.target.value, 'toSend')}
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={formData.toSend}
                    onClick={(e) => setShowCalendar(true)}
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
            <SubmitButton className="mt-5">
              {' '}
              {checkingApproval || approvingToken ? (
                <BeatLoader size={6} color="white" />
              ) : isApproved ? (
                'Schedule Transfer'
              ) : (
                'Approve Token'
              )}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>
    </>
  );
}
