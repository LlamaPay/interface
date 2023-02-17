import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNetworkProvider } from '~/hooks';

interface ITokenList {
  [key: string]: {
    name: string;
    symbol: string;
    logoURI: string;
  };
}

const fetchTokenList = async (id?: string) => {
  if (!id) return null;

  const { data } = await axios.get(`https://defillama-datasets.s3.eu-central-1.amazonaws.com/tokenlist/${id}.json`);

  return data ?? {};
};

export function useGetTokenList() {
  const { tokenListId } = useNetworkProvider();

  return useQuery<ITokenList>(['tokenlist', tokenListId], () => fetchTokenList(tokenListId), {
    refetchInterval: 30000,
  });
}
