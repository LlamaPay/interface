import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { TokenSalaries } from '~/containers/TokenSalaries';

import { chainDetails } from '~/utils/network';

interface StreamsProps {
  userAddress: string;
  chainId: number;
}

const Home: NextPage<StreamsProps> = (props) => {
  return <TokenSalaries isIncoming={true} {...props} />;
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { chain } = chainDetails(query.chain);

  const { network: mainnet } = chainDetails('1');

  const defaultAddress = typeof query.address === 'string' ? query.address : '';

  if (!chain || defaultAddress === '') {
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
      chainId: chain.id,
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Home;
