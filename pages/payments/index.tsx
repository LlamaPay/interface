import Layout from '~/components/Layout';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import PaymentsSection from '~/components/Payments';

const Payments: NextPage = () => {
  return (
    <Layout>
      <PaymentsSection />
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

export default Payments;
