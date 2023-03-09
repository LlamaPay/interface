import { useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';

export const fetchTokenPrice = async (id: string, prefix?: string | null) => {
  if (!id || !prefix || id.length !== 42) return null;

  const { coins } = await fetch(`https://coins.llama.fi/prices/current/${prefix}:${id.toLowerCase()}`).then((r) =>
    r.json()
  );

  return coins?.[`${prefix}:${id.toLowerCase()}`] ?? null;
};

export function useTokenPrice(id: string) {
  const { chain } = useNetwork();

  const prefix = chain ? networkDetails[Number(chain?.id)].prefix : null;

  return useQuery(['token', id, prefix], () => fetchTokenPrice(id, prefix), {
    refetchInterval: 30_000,
  });
}
