import { DialogState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';

export default function EOAWarning({ address, dialog }: { address: (string | null)[]; dialog: DialogState }) {
  return (
    <>
      <FormDialog dialog={dialog} title={'WARNING: NOT EOA'}>
        <div className="space-y-2 text-sm">
          <p>{`The following addresses are contracts:`}</p>
          {address.map((p) => (
            <p key={p}>{`${p}`}</p>
          ))}
          <p>{`Please make sure that the contracts can withdraw from the vesting contract!`}</p>
        </div>
      </FormDialog>
    </>
  );
}
