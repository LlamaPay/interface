import type { GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';
import { OutgoingSalaries } from '~/containers/Salaries/Outgoing';

const Home: NextPage = () => {
  return <OutgoingSalaries />;
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

export default Home;
