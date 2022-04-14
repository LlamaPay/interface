import { useQuery } from 'react-query';
import axios from 'axios';
import { useNetwork } from 'wagmi';
import { networkDetails } from 'utils/constants';

// TODO update chain name based on user wallet network
const fetchTokenPrice = async (id: string, prefix: string) => {
  if (!id) return null;

  // remove later this is used for testing
  // id = '0xc7198437980c041c805a1edcba50c1ce5db95118';
  // prefix = 'avax';

  const { data } = await axios.post(
    'https://coins.llama.fi/prices',
    JSON.stringify({
      coins: [`${prefix}:${id}`],
      timestamp: Date.now() / 1e3,
    })
  );
  return data.coins[`${prefix}:${id}`].price;
};

export function useTokenPrice(id: string) {
  const [{ data: network }] = useNetwork();
  const prefix = networkDetails[Number(network.chain?.id)].prefix;
  // TODO handle errorde
  return useQuery(['token', id], () => fetchTokenPrice(id, prefix), {});
}
