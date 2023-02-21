import { DialogState, useDialogState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import Confirm, { IVestingData } from './Confirm';
import { SubmitButton } from '~/components/Form';

export default function EOAWarning({
  address,
  dialog,
  vestingData,
  factory,
  gnosis,
}: {
  address: (string | null)[];
  dialog: DialogState;
  vestingData?: IVestingData | null;
  factory?: string;
  gnosis: boolean;
}) {
  const confirmDialog = useDialogState();

  async function onSubmit() {
    if (!gnosis) {
      confirmDialog.show();
    } else {
      dialog.hide();
    }
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
