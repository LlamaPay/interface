import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { chains, networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

export type Provider = ethers.providers.BaseProvider;

export const useNetworkProvider = () => {
  const [{ data }] = useNetwork();

  const { pathname, query } = useRouter();

  let chainId = data?.chain?.id ?? null;

  let name: string | null = data?.chain?.name ?? null;

  if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
    chainId = Number(query.chainId);
    name = networkDetails[chainId]?.blockExplorerName;
  }

  if (pathname === '/salaries/[chain]/[address]' || pathname === '/vesting/[chain]/[address]') {
    const chainParam = query.chain;

    const isParamChainId = Number.isNaN(Number(chainParam));

    let chain = null;

    // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
    if (isParamChainId) {
      chain = typeof chainParam === 'string' && chains.find((c) => c.name.toLowerCase() === chainParam.toLowerCase());
    } else {
      chain = typeof chainParam === 'string' && chains.find((c) => c.id === Number(chainParam));
    }

    if (chain) {
      chainId = Number(chain.id);
      name = networkDetails[chainId]?.blockExplorerName;
    }
  }

  const chainDetails = chainId && networkDetails[chainId];

  return {
    provider: chainDetails ? chainDetails.chainProviders : null,
    network: name,
    chainId,
    nativeCurrency: data.chain?.nativeCurrency,
    unsupported: data.chain?.unsupported,
    tokenListId: networkDetails[chainId ?? 0]?.tokenListId,
  };
};
