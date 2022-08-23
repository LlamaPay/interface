import { BaseProvider } from '@ethersproject/providers';
import botContract from 'abis/botContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { botContractCreation, networkDetails, zeroAdd } from 'utils/constants';
import { erc20ABI, useAccount } from 'wagmi';

async function getBotInfo(userAddress: string | undefined, provider: BaseProvider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const contract = new ethers.Contract(networkDetails[chainId].botAddress, botContract, provider);
      const endBlock = await provider.getBlockNumber();
      let currBlock = botContractCreation[chainId];
      const filters = contract.filters;
      let events: ethers.Event[] = [];
      do {
        const start = currBlock;
        if (currBlock + 1024 > endBlock) {
          currBlock = endBlock;
        } else {
          currBlock += 1024;
        }
        const queriedEvents = await contract.queryFilter(filters, start, currBlock);
        events = events.concat(queriedEvents);
      } while (currBlock < endBlock);
      const withdraws: any = {};
      for (const i in events) {
        const event = events[i];
        if (!event.args) continue;
        const id = event.args.id;
        const user = userAddress.toLowerCase();
        const from = event.args.from.toLowerCase();
        const to = event.args.to.toLowerCase();
        if (from !== user && to !== user) continue;
        const newArr = withdraws[id] ?? [];
        newArr.push(event);
        withdraws[id] = newArr;
      }
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
      for (const i in withdraws) {
        const last = withdraws[i][withdraws[i].length - 1];
        if (last.event === 'WithdrawCancelled') continue;
        if (tokenSymbols[last.args.token] === undefined && last.args.llamaPay !== zeroAdd) {
          const tokenContract = new ethers.Contract(last.args.token, erc20ABI, provider);
          tokenSymbols[last.args.token] = await tokenContract.symbol();
        }
        toInclude[i] = {
          owner: last.args.owner,
          from: last.args.from,
          to: last.args.to,
          token: last.args.token,
          tokenSymbol: tokenSymbols[last.args.token],
          amountPerSec: last.args.amountPerSec,
          starts: last.args.starts,
          frequency: last.args.frequency,
        };
      }
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
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['botInfo', accountData?.address, chainId],
    () => getBotInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 10000,
    }
  );
}
