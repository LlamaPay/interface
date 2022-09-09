import { BaseProvider } from '@ethersproject/providers';
import scheduledTransfer from 'abis/scheduledTransferContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { erc20ABI, useAccount } from 'wagmi';

async function getScheduledTransfers(
  userAddress: string | undefined,
  provider: BaseProvider | null,
  chainId: number | null
) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const txcontract = '0x54976f3e6c0c150172a01bf594ee9e360115af00';
      const contract = new ethers.Contract(txcontract, scheduledTransfer, provider);
      const endBlock = await provider.getBlockNumber();
      let currBlock = 7549761;
      const filters = contract.filters;
      let events: ethers.Event[] = [];
      do {
        const start = currBlock;
        if (currBlock + 2048 > endBlock) {
          currBlock = endBlock;
        } else {
          currBlock += 2048;
        }
        const queriedEvents = await contract.queryFilter(filters, start, currBlock);
        events = events.concat(queriedEvents);
      } while (currBlock < endBlock);
      const toInclude: any = {};
      for (const i in events) {
        const event = events[i];
        if (!event.args) continue;
        const token = event.args.token;
        const from = event.args.from.toLowerCase();
        const to = event.args.to.toLowerCase();
        const amount = Number(event.args.amount);
        const id = event.args.id;
        if (userAddress !== from && userAddress != to) continue;
        if (event.event === 'Created') {
          toInclude[id] = {
            token,
            from,
            to,
            amount,
          };
        } else if (event.event === 'Redeemed' || event.event === 'Rugged') {
          delete toInclude[id];
        }
      }
      console.log(toInclude);
      return toInclude;
    }
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default function useGetScheduledTransfers() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['scheduledTransfers', accountData?.address.toLowerCase(), chainId],
    () => getScheduledTransfers(accountData?.address.toLowerCase(), provider, chainId),
    {
      refetchInterval: 10000,
    }
  );
}
