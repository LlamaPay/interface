import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { StaticImageData } from 'next/image';
import Salaries from 'components/Salaries';
import getSalariesInfo from 'components/Salaries/getSalariesInfo';

interface StreamsProps {
  subgraphEndpoint: string;
  address: string;
  resolvedAddress: string;
  network: string;
  logoURI: StaticImageData;
}

const Yearn: NextPage<StreamsProps> = (props) => {
  return <Salaries {...props} />;
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const data = await getSalariesInfo({ locale, chain: 'ethereum', address: 'ychad.eth' });

  return data;
};

export default Yearn;
