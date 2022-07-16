import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import Balance from 'components/Balance';
import { HistorySection } from 'components/History';
import { StreamSection } from 'components/Stream';
import { NO_BANNER } from 'utils/banner';

interface HomePageProps {
  noBanner: boolean;
}

const Home: NextPage<HomePageProps> = ({ noBanner }) => {
  return (
    <Layout className="dark: flex flex-col gap-[30px] dark:bg-[#161818]" noBanner={noBanner}>
      <section className="app-section dark:bg-[#161818]">
        <Balance />
      </section>
      <section className="app-section flex h-full flex-1 flex-col gap-[50px] bg-[#D9F2F4]/10 py-[22px] dark:bg-[#161818]">
        <StreamSection />
        <HistorySection />
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  console.log({ locale });
  const messages = locale
    ? (await import(`translations/${locale}.json`)).default
    : (await import(`translations/en.json`)).default;
  // Pass data to the page via props
  return {
    props: {
      messages: messages || (await import(`translations/en.json`)).default,
      noBanner: req.cookies[NO_BANNER] ?? false,
    },
  };
};

export default Home;
