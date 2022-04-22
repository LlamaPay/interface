import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';

const Placeholder = () => {
  return (
    <form className="flex flex-col space-y-4">
      <InputText name="addressToStream" isRequired={true} label="Address to stream" />
      <span>
        <SelectToken
          handleTokenChange={() => null}
          tokens={[]}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label="Token"
        />
      </span>

      <InputAmountWithDuration
        name="placeholderAmountToStream"
        isRequired={true}
        label="Amount to stream"
        selectInputName="placeholderStreamDuration"
      />

      <SubmitButton disabled={true} className="mt-8">
        <BeatLoader size={6} color="white" />
      </SubmitButton>
    </form>
  );
};

export default Placeholder;
