import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { chainDetails } from '~/utils/network';
import { IncomingDashboard } from '~/containers/Dashboard/Incoming';

interface DashboardProps {
  userAddress: string;
}

const Streams: NextPage<DashboardProps> = (props) => {
  return <IncomingDashboard {...props} />;
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { network: mainnet } = chainDetails('1');

  const defaultAddress = typeof query.address === 'string' ? query.address : '';

  if (defaultAddress === '') {
    return { notFound: true };
  }

  const userAddress = await mainnet?.chainProviders
    .resolveName(defaultAddress)
    .then((address) => address || defaultAddress)
    .catch(() => defaultAddress);

  // Pass data to the page via props
  return {
    props: {
      userAddress: userAddress?.toLowerCase() ?? query.address,
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Streams;
