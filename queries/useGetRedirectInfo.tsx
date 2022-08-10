import { BaseProvider } from '@ethersproject/providers';
import botContract from 'abis/botContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { botContractCreationBlock, networkDetails } from 'utils/constants';
import { erc20ABI, useAccount } from 'wagmi';

async function getRedirectInfo(userAddress: string | undefined, provider: BaseProvider | null, chainId: number | null) {
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

      const redirectEvents: any = {};
      for (const i in events) {
        const event = events[i];
        if (!event.args) continue;
        if (!event.event?.startsWith('Redirect')) continue;
        if (event.args.from.toLowerCase() !== userAddress.toLowerCase()) continue;
        if (redirectEvents[event.args.id] === undefined) {
          redirectEvents[event.args.id] = [];
        }
        const newArr = redirectEvents[event.args.id];
        newArr.push(event);
        redirectEvents[event.args.id] = newArr;
      }

      const llamaPayToToken: any = {};
      const toInclude: any = {};
      for (const i in redirectEvents) {
        const last = redirectEvents[i][redirectEvents[i].length - 1];
        if (last.event === 'RedirectCancelled') continue;
        if (llamaPayToToken[last.args.token] === undefined) {
          const tokenContract = new ethers.Contract(last.args.token, erc20ABI, provider);
          llamaPayToToken[last.args.token] = {
            symbol: await tokenContract.symbol(),
            decimals: await tokenContract.decimals(),
          };
        }
        toInclude[i] = {
          token: llamaPayToToken[last.args.token].symbol,
          decimals: llamaPayToToken[last.args.token].decimals,
          from: last.args.from,
          to: last.args.to,
          amount: Number(last.args.amount),
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

export default function useGetRedirectInfo() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['redirectInfo', accountData?.address, chainId],
    () => getRedirectInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 10000,
    }
  );
}
