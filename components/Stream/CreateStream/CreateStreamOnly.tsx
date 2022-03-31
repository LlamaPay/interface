import Select from 'react-select';
import { ICreateStreamOnlyProps } from './types';

const CreateStreamOnly = (props: ICreateStreamOnlyProps) => {
  const {
    tokenOptions,
    handleTokenChange,
    handleAmountPerSecChange,
    disableSubmit,
    isApproving,
    isApproved,
    handleApproval,
    isDark,
  } = props;
  return (
    <>
      <label>
        <p>Select a token to stream</p>
        <Select
          options={tokenOptions}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
              primary: '#3f3f46',
            },
          })}
          onChange={handleTokenChange}
          name="tokenAddress"
        />
      </label>
      <label>
        <p>Address to stream</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="addressToStream"
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <label>
        <p>Amount per sec</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="amountPerSec"
          pattern="\S(.*\S)?"
          title="This field is required"
          onChange={handleAmountPerSecChange}
        />
      </label>
      <button
        className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
        type="button"
        disabled={disableSubmit || isApproved}
        onClick={handleApproval}
      >
        {isApproving ? '...' : isApproved ? 'Approved' : 'Approve'}
      </button>
      <button
        className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
        disabled={disableSubmit || !isApproved}
      >
        Create Stream
      </button>
    </>
  );
};

export default CreateStreamOnly;
