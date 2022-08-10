import { BaseProvider } from '@ethersproject/providers';
import botContract from 'abis/botContract';
import llamaContract from 'abis/llamaContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { botContractCreationBlock, networkDetails, zeroAdd } from 'utils/constants';
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
      let currBlock = botContractCreationBlock[chainId];

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

      const withdrawEvents: any = {};
      for (const i in events) {
        const event = events[i];
        if (!event.args) continue;
        if (
          event.args.from.toLowerCase() !== userAddress.toLowerCase() &&
          event.args.to.toLowerCase() !== userAddress.toLowerCase()
        )
          continue;
        if (!event.event?.startsWith('Withdraw')) continue;
        if (withdrawEvents[event.args.id] === undefined) {
          withdrawEvents[event.args.id] = [];
        }
        const newArr = withdrawEvents[event.args.id];
        newArr.push(event);
        withdrawEvents[event.args.id] = newArr;
      }

      const llamaPayToToken: any = {};
      const toInclude: any = {};
      for (const i in withdrawEvents) {
        const last = withdrawEvents[i][withdrawEvents[i].length - 1];
        if (last.event === 'WithdrawCancelled') continue;
        if (llamaPayToToken[last.args.llamaPay] === undefined && last.args.llamaPay !== zeroAdd) {
          const llamaPayContract = new ethers.Contract(last.args.llamaPay, llamaContract, provider);
          const tokenContract = new ethers.Contract(await llamaPayContract.token(), erc20ABI, provider);
          llamaPayToToken[last.args.llamaPay] = await tokenContract.symbol();
        }
        toInclude[i] = {
          owner: last.args.owner,
          token: llamaPayToToken[last.args.llamaPay],
          llamaPay: last.args.llamaPay,
          from: last.args.from,
          to: last.args.to,
          amountPerSec: last.args.amountPerSec,
          starts: last.args.starts,
          frequency: last.args.frequency,
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
