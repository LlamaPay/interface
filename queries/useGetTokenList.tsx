import { useQuery } from 'react-query';
import axios from 'axios';

import { useNetworkProvider } from 'hooks';

const fetchTokenList = async (id?: string) => {
  if (!id) return null;

  const { data } = await axios.get(`https://api.llama.fi/tokenlist/${id}`);

  return data?.coins ?? [];
};

export function useGetTokenList() {
  const { tokenListId } = useNetworkProvider();

  return useQuery(['tokenlist', tokenListId], () => fetchTokenList(tokenListId), {
    refetchInterval: 10000,
  });
}
