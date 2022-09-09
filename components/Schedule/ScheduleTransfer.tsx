import scheduledTransfer from 'abis/scheduledTransferContract';
import { DisclosureState } from 'ariakit';
import BigNumber from 'bignumber.js';
import { FormDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import { checkApproval, createContractAndCheckApproval } from 'components/Form/utils';
import { getAddress } from 'ethers/lib/utils';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import * as React from 'react';
import Calendar from 'react-calendar';
import { BeatLoader } from 'react-spinners';
import { createERC20Contract } from 'utils/tokenUtils';
import { useContractWrite, useProvider } from 'wagmi';

const spender = '0x54976f3e6c0c150172a01bf594ee9e360115af00';

export default function ScheduleTransfer({ dialog, userAddress }: { dialog: DisclosureState; userAddress: string }) {
  const provider = useProvider();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

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

  const checkApprovalOnChange = (token: string, amount: string) => {
    if (userAddress && provider && token.startsWith('0x') && token.length === 42 && amount !== '') {
      createContractAndCheckApproval({
        userAddress,
        tokenAddress: token,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: amount,
        approveForAddress: spender,
      });
    }
  };

  const handleChange = (value: string | boolean, type: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, token: e.target.value }));
    checkApprovalOnChange(e.target.value, formData.amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, amount: e.target.value }));
    checkApprovalOnChange(formData.token, e.target.value);
  };

  function onCurrentDate() {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(Date.now()).toISOString().slice(0, 10) }));
  }

  function handleCalendarClick(e: any) {
    setFormData((prev) => ({ ...prev, ['toSend']: new Date(e).toISOString().slice(0, 10) }));
    setShowCalendar(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const recipientAddress = form.sendTo?.value;
    const tokenAddress = form.token?.value;
    const scheduledAmount = form.amount?.value;
    const scheduledDate = form.toSend?.value;

    const tokenContract = createERC20Contract({ tokenAddress: getAddress(tokenAddress), provider });
    const decimals = await tokenContract.decimals();
    const formattedAmount = new BigNumber(scheduledAmount).times(10 ** decimals).toFixed(0);
    const formattedscheduledDate = new Date(scheduledDate).getTime() / 1e3;

    if (isApproved) {
      create({
        args: [recipientAddress, tokenAddress, formattedAmount, formattedscheduledDate],
      });
      // form.reset();
      setFormData({ token: '', amount: '', sendTo: '', toSend: new Date(Date.now()).toISOString().slice(0, 10) });
    } else {
      approveToken(
        {
          tokenAddress,
          amountToApprove: formattedAmount,
          spenderAddress: spender,
        },
        {
          onSettled: () => {
            createContractAndCheckApproval({
              userAddress,
              tokenAddress,
              provider,
              approvalFn: checkTokenApproval,
              approvedForAmount: scheduledAmount,
              approveForAddress: spender,
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

            <InputText name="token" isRequired label="Token" placeholder="0x..." handleChange={handleTokenChange} />

            <InputAmount name="amount" label="Amount" isRequired handleChange={handleAmountChange} />

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

            <SubmitButton className="mt-5">
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
