import Layout from '~/components/Layout';
import * as React from 'react';
import { GetStaticPropsContext, NextPage } from 'next';
import PaymentsSection from '~/components/Payments';

const Payments: NextPage = () => {
  return (
    <Layout>
      <PaymentsSection />
    </Layout>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language.
      messages: (await import(`translations/${context.locale}.json`)).default,
    },
  };
}
export default Payments;
