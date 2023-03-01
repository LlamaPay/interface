import Layout from '~/components/Layout';
import * as React from 'react';
import { GetStaticPropsContext, NextPage } from 'next';
import VestingSection from '~/components/Vesting';

const Vesting: NextPage = () => {
  return (
    <Layout>
      <VestingSection />
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

export default Vesting;
