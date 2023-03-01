import { DialogState, useDialogState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import Confirm, { IVestingData } from './Confirm';
import { SubmitButton } from '~/components/Form';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { useQueryClient } from '@tanstack/react-query';

export default function EOAWarning({
  address,
  dialog,
  vestingData,
  factory,
  gnosis,
  gnosisCalls,
}: {
  address: (string | null)[];
  dialog: DialogState;
  vestingData?: IVestingData | null;
  factory?: string;
  gnosisCalls?: { [key: string]: string[] } | undefined;
  gnosis: boolean;
}) {
  const confirmDialog = useDialogState();

  const { mutate: gnosisBatch } = useGnosisBatch();
  const queryClient = useQueryClient();

  async function onSubmit() {
    if (!gnosis) {
      confirmDialog.show();
    } else if (gnosis && gnosisCalls) {
      gnosisBatch({ calls: gnosisCalls });
    }
    queryClient.invalidateQueries();
  }

  return (
    <>
      <FormDialog dialog={dialog} title={'WARNING: NOT EOA'}>
        <div className="space-y-2 text-sm">
          <p>{`The following addresses are contracts:`}</p>
          {address.map((p) => (
            <p key={p}>{`${p}`}</p>
          ))}
          <p>{`Please make sure that the contracts can withdraw from the vesting contract!`}</p>
          <SubmitButton onClick={onSubmit} className="mt-5">
            I understand
          </SubmitButton>
        </div>
      </FormDialog>
      {vestingData && factory && <Confirm dialog={confirmDialog} vestingData={vestingData} factory={factory} />}
    </>
  );
}
