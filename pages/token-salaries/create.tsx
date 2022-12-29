import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { InputText, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import useCreateScheduledTransferContract from 'queries/useCreateScheduledTransfer';
import { TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';
import { StreamIcon } from 'components/Icons';
import { useNetworkProvider } from 'hooks';
import { networkDetails } from 'lib/networkDetails';

interface IFormElements {
  oracleAddress: { value: string };
}

const Home: NextPage = () => {
  const [txHash, setTxHash] = React.useState('');

  const txDialogState = useDialogState();

  const { chainId } = useNetworkProvider();

  const factoryAddress = chainId ? networkDetails[chainId].scheduledTransferFactory : null;

  const { mutateAsync, isLoading } = useCreateScheduledTransferContract({ factoryAddress });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & IFormElements;
    const oracleAddress = form.oracleAddress?.value;
    mutateAsync(
      { oracleAddress },
      {
        onSuccess: (data) => {
          setTxHash(data.hash);
          txDialogState.toggle();
        },
      }
    );
  };

  return (
    <Layout className="flex flex-col gap-12">
      <form className="mx-auto flex w-full max-w-lg flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="font-exo mx-auto mb-5 flex items-center gap-[0.625rem] text-2xl font-semibold text-lp-gray-4 dark:text-white">
          <StreamIcon />
          <span>Create Scheduled Transfers Contract</span>
        </h1>

        <InputText name="oracleAddress" isRequired={true} label="Oracle Address" placeholder="0x..." />

        <SubmitButton disabled={!factoryAddress || isLoading} className="mt-2">
          {!factoryAddress ? 'Chain not supported' : isLoading ? <BeatLoader size={6} color="white" /> : 'Create'}
        </SubmitButton>
      </form>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash || ''} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Home;
