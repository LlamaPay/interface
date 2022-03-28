import { useQuery } from 'react-query';
import { createContract, llamapayFactory } from 'utils/contract';
import { useNetwork } from 'wagmi';

const fetchContracts = async (network: string) => {
  if (!network || network === '') return null;

  const count = await llamapayFactory.getLlamaPayContractCount();
  const contractsCount = Number(count.toString());

  if (!Number.isNaN(contractsCount)) {
    // TODO handle edge cases like when the contracts is not present, it returns 0x0000 etc
    const data = await Promise.all(
      Array(contractsCount)
        .fill(null)
        .map((_, i) => llamapayFactory.getLlamaPayContractByIndex(i))
    );

    if (data.length > 0) {
      const tokens = await Promise.all(data.map((c) => createContract(c).token()));
      return tokens.map((token, i) => ({ token, address: data[i] }));
    } else throw new Error("Couldn't fetch contracts");
  } else throw new Error("Couldn't fetch contracts");
};

export function useGetContracts() {
  const [{ data }] = useNetwork();
  const chainName = data?.chain?.name ?? '';

  return useQuery(['contracts', chainName], () => fetchContracts(chainName), {
    refetchInterval: 10000,
    select: (data) => {
      return (
        data?.map((c) => ({
          token: c.token,
          address: c.address,
          contract: createContract(c.address),
        })) ?? []
      );
    },
  });
}
