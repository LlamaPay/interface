import { useQuery } from 'react-query';
import axios from 'axios';

// TODO update chain name based on user wallet network
const fetchTokenPrice = async (id: string) => {
  if (!id) return null;

  const { data } = await axios.post(
    'https://coins.llama.fi/prices',
    JSON.stringify({
      coins: [`ethereum:${id}`],
      timestamp: 1603966688,
    })
  );
  return data;
};

export function useTokenPrice(id: string) {
  // TODO handle error
  return useQuery(['token', id], () => fetchTokenPrice(id), {});
}
