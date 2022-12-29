import { useQuery } from 'react-query';
import axios from 'axios';
import { useNetwork } from 'wagmi';
import { networkDetails } from 'lib/networkDetails';

const fetchTokenPrice = async (id: string, prefix: string | null) => {
  if (!id || !prefix) return null;

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

  const token = data.coins && data.coins[`${prefix}:${id}`];

  return token?.price;
};

export function useTokenPrice(id: string) {
  const [{ data: network }] = useNetwork();

  const prefix = network.chain?.id ? networkDetails[Number(network.chain?.id)].prefix : null;

  return useQuery(['token', id], () => fetchTokenPrice(id, prefix), {
    refetchInterval: 30000,
  });
}
