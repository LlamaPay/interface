import { BaseProvider } from '@ethersproject/providers';
import botContract from 'abis/botContract';
import llamaContract from 'abis/llamaContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { networkDetails, zeroAdd } from 'utils/constants';
import { erc20ABI, useAccount } from 'wagmi';

const topics: { [key: string]: string } = {
  '0x2964df00d05d867fb39d81ec5ed1d5ab5125691de320bbc5cfc5faf7a5505369': 'WithdrawScheduled',
  '0x2d7e851ad23abc91818637874db4164af53ae6d837db0c7d96f847a556ab2f69': 'WithdrawCancelled',
  '0xf02b6913a0661fd5a19a298c7bac40f63b16c538b8799cf36812e1224e2e9c60': 'WithdrawExecuted',
};

const blockCreated: { [key: number]: number } = {
  5: 7343399,
  43114: 18219329,
};

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
      let currBlock = blockCreated[chainId];
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
      const scheduleEvents: {
        [key: string]: {
          owner: string;
          topic: string;
          llamaPay: string;
          from: string;
          to: string;
          amountPerSec: number;
          starts: number;
          frequency: number;
        }[];
      } = {};
      for (const i in events) {
        const args = events[i].args;
        if (!args) continue;
        const user = userAddress.toLowerCase();
        const owner = args.owner.toLowerCase();
        const topic = topics[events[i].topics[0]];
        const llamaPay = args.llamaPay.toLowerCase();
        const from = args.from.toLowerCase();
        const to = args.to.toLowerCase();
        const amountPerSec = args.amountPerSec;
        const starts = args.starts;
        const frequency = args.frequency;
        const id = args.id;
        if (from !== user && to !== user) continue;
        if (scheduleEvents[id] === undefined) {
          scheduleEvents[id] = [];
        }
        scheduleEvents[id].push({
          owner,
          topic,
          llamaPay,
          from,
          to,
          amountPerSec,
          starts,
          frequency,
        });
      }
      const llamaPayToToken: { [key: string]: string } = {};
      const toInclude: {
        [key: string]: {
          owner: string;
          token: string;
          llamaPay: string;
          from: string;
          to: string;
          amountPerSec: number;
          starts: number;
          frequency: number;
        };
      } = {};
      for (const i in scheduleEvents) {
        const last = scheduleEvents[i][scheduleEvents[i].length - 1];
        if (last.topic !== 'WithdrawExecuted' && last.topic !== 'WithdrawScheduled') continue;
        if (llamaPayToToken[last.llamaPay] === undefined && last.llamaPay !== zeroAdd) {
          const llamaPayContract = new ethers.Contract(last.llamaPay, llamaContract, provider);
          const tokenContract = new ethers.Contract(await llamaPayContract.token(), erc20ABI, provider);
          llamaPayToToken[last.llamaPay] = await tokenContract.symbol();
        }
        toInclude[i] = {
          owner: last.owner,
          token: llamaPayToToken[last.llamaPay],
          llamaPay: last.llamaPay,
          from: last.from,
          to: last.to,
          amountPerSec: last.amountPerSec,
          starts: last.starts,
          frequency: last.frequency,
        };
      }
      return toInclude;
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
