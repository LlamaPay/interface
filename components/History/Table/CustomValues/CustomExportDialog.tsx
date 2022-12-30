import * as React from 'react';
import { Switch } from '@headlessui/react';
import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { InputText, SubmitButton } from 'components/Form';
import { IHistory } from 'types';
import { formatAddress } from 'utils/address';
import { downloadCustomHistory } from 'utils/downloadCsv';
import Calendar from 'react-calendar';

interface ICustomExportElements {
  start: string;
  end: string;
  event: string;
}
export function CustomExportDialog({ data, dialog }: { data: IHistory[]; dialog: DisclosureState }) {
  const [hasAssignNames, setHasAssignNames] = React.useState<boolean>(false);
  const [showStartCalendar, setShowStartCalendar] = React.useState<boolean>(false);
  const [showEndCalendar, setShowEndCalendar] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<ICustomExportElements>({
    start: new Date(Date.now()).toISOString().slice(0, 10),
    end: new Date(Date.now()).toISOString().slice(0, 10),
    event: 'All Events',
  });

  function downloadCSV(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    downloadCustomHistory(
      data,
      { start: formData.start, end: formData.end },
      formData.event !== '' ? formData.event : null,
      tableContents
    );
  }

  const addresses = React.useMemo(() => {
    if (!data) return {};
    const addresses: { [key: string]: string } = {};
    data.forEach((event) => {
      if (!event.addressRelated) return;
      if (addresses[event.addressRelated] !== undefined) return;
      addresses[event.addressRelated] = '';
    });
    return addresses;
  }, [data]);

  const [tableContents, setTableContents] = React.useState<{ [key: string]: string }>(addresses);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const address = e.target.name;
    const newTableContents = { ...tableContents };
    const value = e.target.value;
    newTableContents[address] = value;
    setTableContents(newTableContents);
  }

  function onChange(val: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: val }));
  }

  function onCalendarChange(
    val: string,
    type: keyof typeof formData,
    calendar: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setFormData((prev) => ({ ...prev, [type]: val }));
    calendar(false);
  }

  return (
    <FormDialog title="Export Custom CSV" className="h-fit" dialog={dialog}>
      <form className="space-y-2" onSubmit={downloadCSV}>
        <InputText
          label={'Start Date (YYYY-MM-DD)'}
          name="startDate"
          isRequired
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          handleClick={(e) => setShowStartCalendar(true)}
          handleChange={(e) => onChange(e.target.value, 'start')}
          showValue={formData.start}
        ></InputText>
        {showStartCalendar && (
          <section className="max-w-xs place-self-center border px-2 py-2">
            <Calendar
              onChange={(e: any) =>
                onCalendarChange(new Date(e).toISOString().slice(0, 10), 'start', setShowStartCalendar)
              }
            />
          </section>
        )}
        <InputText
          label={'End Date (YYYY-MM-DD)'}
          name="endDate"
          isRequired
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          handleClick={(e) => setShowEndCalendar(true)}
          handleChange={(e) => onChange(e.target.value, 'end')}
          showValue={formData.end}
        ></InputText>
        {showEndCalendar && (
          <section className="max-w-xs place-self-center border px-2 py-2">
            <Calendar
              onChange={(e: any) => onCalendarChange(new Date(e).toISOString().slice(0, 10), 'end', setShowEndCalendar)}
            />
          </section>
        )}
        <select
          onChange={(e) => onChange(e.target.value, 'event')}
          required
          className="input-label w-full rounded dark:border-[#252525] dark:bg-[#202020]"
        >
          <option value="AllEvents">{'All Events'}</option>
          <option value="Deposit">{'Deposit'}</option>
          <option value="Withdraw">{'Withdraw'}</option>
          <option value="PayerWithdraw">{'Payer Withdraw'}</option>
          <option value="StreamCreated">{'Create Stream'}</option>
          <option value="StreamCancelled">{'Cancel Stream'}</option>
          <option value="StreamModified">{'Modify Stream'}</option>
          <option value="StreamPaused">{'Pause'}</option>
          <option value="Gusto">{'Gusto'}</option>
        </select>
        <div className="flex gap-2">
          <span className="font-exo">{'Assign Names'}</span>
          <Switch
            checked={hasAssignNames}
            onChange={setHasAssignNames}
            className={`${
              hasAssignNames ? 'bg-lp-primary' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                hasAssignNames ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
        {hasAssignNames && (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">Address</th>
                <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableContents).map((p) => (
                <tr key={p} className="table-row">
                  <td className="table-description w-1/3 text-center dark:text-white">{formatAddress(p)}</td>
                  <td className="table-description dark:text-white">
                    <input
                      className="input-field m-0 min-w-[8rem] py-1 dark:text-white"
                      spellCheck="false"
                      inputMode="text"
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      value={tableContents[p]}
                      onChange={(e) => onNameChange(e)}
                      name={p}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <SubmitButton className="mt-5">{'Download'}</SubmitButton>
      </form>
    </FormDialog>
  );
}
