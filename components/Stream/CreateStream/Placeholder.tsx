import { InputAmount, InputText, SubmitButton } from 'components/Form';

const Placeholder = () => {
  return (
    <form className="flex flex-col space-y-4">
      <InputText name="addressToStream" isRequired={true} label="Address to stream" />
      <InputAmount name="amountPerSec" isRequired={true} label="Amount per sec" />
      <SubmitButton disabled={true} className="mt-8">
        Create Stream
      </SubmitButton>
    </form>
  );
};

export default Placeholder;
