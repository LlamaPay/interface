import * as React from 'react';
import { DisclosureState } from 'ariakit';
import { IVesting } from 'types';
import { useAccount } from 'wagmi';

export default function ClaimButton({
  data,
  claimValues,
  claimDialog,
}: {
  data: IVesting;
  claimDialog: DisclosureState;
  claimValues: React.MutableRefObject<IVesting | null>;
}) {
  const [{ data: accountData }] = useAccount();

  const handleClaim = () => {
    claimValues.current = { ...data };
    claimDialog.toggle();
  };

  return (
    <>
      <div>
        {Date.now() / 1e3 >= Number(data.startTime) + Number(data.cliffLength) &&
          accountData?.address.toLowerCase() === data.recipient.toLowerCase() && (
            <button onClick={handleClaim} className="row-action-links font-exo float-right dark:text-white">
              Claim Tokens
            </button>
          )}
      </div>
    </>
  );
}
