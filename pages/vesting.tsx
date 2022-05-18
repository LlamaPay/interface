import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import Layout from 'components/Layout';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';

const vesting: NextPage = () => {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e.target);
  }
  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 dark:bg-[#161818]">
      <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
        <span className="font-exo text-2xl font-semibold text-[#3D3D3D] dark:text-white">
          Set Up Vesting for a Wallet
        </span>
        <InputText label={'Recipient Address'} name="recipientAddress" isRequired />
        <InputAmount label={'Vesting Amount'} name="vestingAmount" isRequired />
        <InputAmountWithDuration
          label={'Vesting Duration'}
          name="vestingDuration"
          isRequired
          selectInputName="vestingDuration"
        />
        <SubmitButton className="mt-5">Create Contract</SubmitButton>
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`../translations/${locale}.json`)).default,
    },
  };
};

export default vesting;
