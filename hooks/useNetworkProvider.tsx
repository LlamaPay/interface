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

  if (pathname === '/streams' && !Number.isNaN(Number(query.chainId))) {
    const chain = chains.find((c) => c.id === Number(query.chainId));

    if (chain) {
      chainId = Number(chain.id);
      name = chain.name;
    }
  }

  if (
    pathname === '/salaries/[chain]/[address]' ||
    pathname === '/salaries/withdraw' ||
    pathname === '/salaries/withdraw/[chain]/[stream]' ||
    pathname === '/vesting/[chain]/[address]' ||
    pathname === '/yearn'
  ) {
    const chainParam = pathname === '/yearn' ? 'ethereum' : query.chain;

    const isParamChainId = chainParam && !Number.isNaN(Number(chainParam));

    let chain = null;

    // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
    if (isParamChainId) {
      chain = typeof chainParam === 'string' && chains.find((c) => c.id === Number(chainParam));
    } else {
      chain = typeof chainParam === 'string' && chains.find((c) => c.name.toLowerCase() === chainParam.toLowerCase());
    }

    if (chain) {
      chainId = Number(chain.id);
      name = chain.name;
    }
  }

  const chainDetails = chainId && networkDetails[chainId];

  return {
    provider: chainDetails ? chainDetails.chainProviders : null,
    network: name?.toLowerCase() === 'mainnet' ? 'Ethereum' : name,
    chainId,
    nativeCurrency: data.chain?.nativeCurrency,
    unsupported: data.chain?.unsupported,
    tokenListId: networkDetails[chainId ?? 0]?.tokenListId,
  };
};
