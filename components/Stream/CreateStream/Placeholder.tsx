import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';

const Placeholder = () => {
  return (
    <form className="flex flex-col space-y-4">
      <InputText name="addressToStream" isRequired={true} label="Address to stream" />
      <span>
        <SelectToken
          handleTokenChange={() => null}
          tokens={['Ethereum']}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label="Token"
        />
      </span>

      <InputAmountWithDuration
        name="amountToStream"
        isRequired={true}
        label="Amount to stream"
        selectInputName="streamDuration"
      />

      <SubmitButton disabled={true} className="mt-8">
        Create Stream
      </SubmitButton>
    </form>
  );
};

export default Placeholder;
