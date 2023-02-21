import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import { StreamIcon } from '~/components/Icons';
import { Tab, TabList, TabPanel, useTabState } from 'ariakit/tab';
import { CreateRefundableContract } from '~/components/Subscriptions/CreateRefundableContract';
import { CreateNonRefundableContract } from '~/components/Subscriptions/CreateNonRefundableContract';

const Home: NextPage = () => {
  const defaultSelectedId = 'refundable';
  const tab = useTabState({ defaultSelectedId });

  return (
    <Layout className="max-w-xl">
      <h1 className="font-exo mx-auto flex items-center gap-[0.625rem] text-2xl font-semibold text-lp-gray-4 dark:text-white">
        <StreamIcon />
        <span>Set up Subscription</span>
      </h1>

      <TabList state={tab} className="my-2 flex items-center" aria-label="Subscription Type">
        <Tab
          className="flex-1 border-b border-transparent bg-lp-primary bg-opacity-10 p-2 hover:bg-opacity-30 aria-selected:border-lp-primary aria-selected:bg-opacity-20"
          id={defaultSelectedId}
        >
          Refundable
        </Tab>
        <Tab className="flex-1 border-b border-transparent bg-lp-primary bg-opacity-10 p-2 hover:bg-opacity-30 aria-selected:border-lp-primary aria-selected:bg-opacity-20">
          Non Refundable
        </Tab>
      </TabList>

      <TabPanel state={tab} tabId={defaultSelectedId}>
        <CreateRefundableContract />
      </TabPanel>

      <TabPanel state={tab}>
        <CreateNonRefundableContract />
      </TabPanel>
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
