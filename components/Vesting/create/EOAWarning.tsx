import { DialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';

export default function EOAWarning({ address, dialog }: { address: string | null; dialog: DialogState }) {
  return (
    <>
      <FormDialog dialog={dialog} title={'WARNING: NOT EOA'}>
        <div className="space-y-2 text-sm">
          <p>{`The address:`}</p>
          <p>{`${address} is a contract!`}</p>
          <p>{`The recipient will not be able to withdraw`}</p>
        </div>
      </FormDialog>
    </>
  );
}
