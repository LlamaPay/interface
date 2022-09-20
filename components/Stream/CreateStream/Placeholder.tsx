import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import { useTranslations } from 'next-intl';
import { BeatLoader } from 'react-spinners';

const Placeholder = () => {
  const t = useTranslations('Forms');
  return (
    <form className="flex flex-col gap-4">
      <InputText
        name="addressToStream"
        isRequired={true}
        label={t('addressToStream')}
        placeholder={t('recipientAddress')}
      />

      <InputText
        name="shortName"
        isRequired={false}
        label={t('associateName')}
        placeholder={t('fastIdentification')}
        optional
      />

      <span>
        <SelectToken
          handleTokenChange={() => null}
          tokens={[]}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label={t('selectTokenFromBalances')}
        />
      </span>

      <InputAmountWithDuration
        name="placeholderAmountToStream"
        isRequired={true}
        label={t('amountToStream')}
        selectInputName="placeholderStreamDuration"
      />
      <button
        type="button"
        className="w-fit rounded-[10px] border border-red-400 py-[6px] px-6 text-sm font-normal shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        disabled={true}
      >
        {t('delete')}
      </button>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="form-submit-button flex-1 rounded-[10px] bg-white text-lp-primary"
          disabled={true}
        >
          {t('addStream')}
        </button>
        <SubmitButton className="flex-1" disabled={true}>
          <BeatLoader size={6} color="white" />
        </SubmitButton>
      </div>
    </form>
  );
};

export default Placeholder;
