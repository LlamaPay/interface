import { botContractABI } from '~/lib/abis/botContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from '~/hooks';
import { useQuery } from '@tanstack/react-query';
import { zeroAdd } from '~/utils/constants';
import { networkDetails } from '~/lib/networkDetails';
import { erc20ABI, useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';
import type { Provider } from '~/utils/contract';

async function getBotInfo(userAddress: string | null, provider: Provider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      if (!networkDetails[chainId].botSubgraph) throw new Error('No subgraph');
      const get_from = gql`
        {
          schedules(where: { from: "${userAddress}", active: true }) {
            owner
            token
            from
            to
            amountPerSec
            starts
            frequency
          }
        }
      `;

      const get_to = gql`
        {
          schedules(where: { to: "${userAddress}", active: true }) {
            owner
            token
            from
            to
            amountPerSec
            starts
            frequency
          }
        }
      `;

      const froms = ((await request(networkDetails[chainId].botSubgraph!, get_from)) as any).schedules;
      const tos = ((await request(networkDetails[chainId].botSubgraph!, get_to)) as any).schedules;

      const schedules = froms.concat(tos);

      const tokenSymbols: any = {};

      const toInclude: {
        [key: string]: {
          owner: string;
          from: string;
          to: string;
          token: string;
          tokenSymbol: string;
          amountPerSec: number;
          starts: number;
          frequency: number;
        };
      } = {};
      for (const i in schedules) {
        const schedule = schedules[i];
        if (tokenSymbols[schedule.token] === undefined && schedule.token !== zeroAdd) {
          const tokenContract = new ethers.Contract(schedule.token, erc20ABI, provider);
          tokenSymbols[schedule.token] = await tokenContract.symbol();
        }
        toInclude[schedule] = {
          owner: schedule.owner,
          from: schedule.from,
          to: schedule.to,
          token: schedule.token,
          tokenSymbol: tokenSymbols[schedule.token],
          amountPerSec: schedule.amountPerSec,
          starts: schedule.starts,
          frequency: schedule.frequency,
        };
      }
      const contract = new ethers.Contract(networkDetails[chainId].botAddress!, botContractABI, provider);
      const redirect = await contract.redirects(userAddress);
      return { toInclude, redirect, tokenSymbols };
    }
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default function useGetBotInfo() {
  const { provider, chainId } = useNetworkProvider();
  const { address } = useAccount();
  return useQuery(
    ['botInfo', address && address.toLowerCase(), chainId],
    () => getBotInfo(address ? address.toLowerCase() : null, provider, chainId),
    {
      staleTime: 180000,
      refetchInterval: 180000,
    }
  );
}
