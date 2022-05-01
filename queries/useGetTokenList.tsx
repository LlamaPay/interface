import { useQuery } from 'react-query';
import axios from 'axios';

import { useNetworkProvider } from 'hooks';

const fetchTokenList = async (id?: string) => {
  if (!id) return null;

  const { data } = await axios.get(`https://defillama-datasets.s3.eu-central-1.amazonaws.com/tokenlist/${id}.json`);

  return data ?? {};
};

export function useGetTokenList() {
  const { tokenListId } = useNetworkProvider();

  return useQuery(['tokenlist', tokenListId], () => fetchTokenList(tokenListId), {
    refetchInterval: 10000,
  });
}
