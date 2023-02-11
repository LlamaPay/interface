import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';

const fetchTokenPrice = async (id: string, prefix: string | null) => {
  if (!id || !prefix || id.length !== 42) return null;

  const { data } = await axios.post(
    'https://coins.llama.fi/prices',
    JSON.stringify({
      coins: [`${prefix}:${id}`],
      timestamp: Date.now() / 1e3,
    })
  );

  return data?.coins?.[`${prefix}:${id.toLowerCase()}`] ?? null;
};

export function useTokenPrice(id: string) {
  const [{ data: network }] = useNetwork();

  const prefix = network.chain?.id ? networkDetails[Number(network.chain?.id)].prefix : null;

  return useQuery(['token', id, prefix], () => fetchTokenPrice(id, prefix), {
    refetchInterval: 30_000,
  });
}
