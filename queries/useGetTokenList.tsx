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

  try {
    const { data } = await axios.get(`https://defillama-datasets.llama.fi/tokenlist/${id}.json`);
    return data ?? {};
  } catch (e) {
    return {};
  }
};

export function useGetTokenList() {
  const { tokenListId } = useNetworkProvider();

  return useQuery<ITokenList>(['tokenlist', tokenListId], () => fetchTokenList(tokenListId), {
    staleTime: 30000,
    refetchInterval: 30000,
  });
}
