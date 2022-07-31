import { BaseProvider } from '@ethersproject/providers';
import botContract from 'abis/botContract';
import llamaContract from 'abis/llamaContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { networkDetails } from 'utils/constants';
import { erc20ABI, useAccount } from 'wagmi';

const topics: any = {
  '0x2964df00d05d867fb39d81ec5ed1d5ab5125691de320bbc5cfc5faf7a5505369': 'WithdrawScheduled',
  '0x2d7e851ad23abc91818637874db4164af53ae6d837db0c7d96f847a556ab2f69': 'WithdrawCancelled',
  '0xf02b6913a0661fd5a19a298c7bac40f63b16c538b8799cf36812e1224e2e9c60': 'WithdrawExecuted',
};

const blockCreated: any = {
  43114: 18041202,
  5: 7323322,
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

      const scheduleEvents: any = {};
      const llamaPayToToken: any = {};
      events.forEach((e) => {
        const data = ethers.utils.defaultAbiCoder.decode(
          ['address', 'address', 'address', 'address', 'uint216', 'uint40', 'uint40', 'bytes32'],
          e.data
        );
        const owner = data[0].toLowerCase();
        const from = data[2].toLowerCase();
        const to = data[3].toLowerCase();
        const user = userAddress.toLowerCase();
        if (owner !== user && from !== user && to !== user) return;
        const id = data[7];
        if (scheduleEvents[id] === undefined) {
          scheduleEvents[id] = [];
        }
        scheduleEvents[id].push({
          owner: owner,
          topic: topics[e.topics[0]],
          llamaPay: data[1],
          from: from,
          to: to,
          amountPerSec: data[4],
          starts: data[5],
          frequency: data[6],
        });
      });
      const toInclude: any = {};
      for (const id in scheduleEvents) {
        const last = scheduleEvents[id][scheduleEvents[id].length - 1];
        if (last.topic === 'WithdrawExecuted' || last.topic === 'WithdrawScheduled') {
          if (llamaPayToToken[last.llamaPay] === undefined) {
            const llamapayContract = new ethers.Contract(last.llamaPay, llamaContract, provider);
            const tokenContract = new ethers.Contract(await llamapayContract.token(), erc20ABI, provider);
            llamaPayToToken[last.llamaPay] = tokenContract.symbol();
          }
          toInclude[id] = {
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
      }
      return toInclude;
    }
  } catch (error) {
    return null;
  }
}

export default function useGetBotInfo() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['botInfo', accountData?.address, chainId],
    () => getBotInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 30000,
    }
  );
}
