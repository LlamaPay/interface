import { useQueries, useQuery } from '@tanstack/react-query';
import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';

interface IPrice {
  confidence: number;
  decimals: number;
  price: number;
  symbol: string;
  timestamp: number;
}

export const fetchTokenPrice = async (id: string, prefix?: string | null): Promise<IPrice | null> => {
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

export function useMultipleTokenPrices({ tokens }: { tokens: Array<string> }) {
  const { chain } = useNetwork();

  const prefix = chain ? networkDetails[Number(chain?.id)].prefix : null;

  const res = useQueries({
    queries: tokens.map((token) => {
      return {
        queryKey: ['token', token, prefix],
        queryFn: () => fetchTokenPrice(token, prefix),
        refetchInterval: 30_000,
      };
    }),
  });

  const resData = Object.fromEntries(tokens.map((token, index) => [token, res[index].data]));

  return {
    isLoaded: res.filter((r) => r.status === 'loading').length === 0,
    isLoading: (res?.filter((r) => r.status === 'success') ?? []).length >= 1 ? false : true,
    data: resData || {},
  };
}
