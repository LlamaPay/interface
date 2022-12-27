import Layout from 'components/Layout';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import VestingSection from 'components/Vesting';

const Vesting: NextPage = () => {
  return (
    <Layout>
      <VestingSection />
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

export default Vesting;
