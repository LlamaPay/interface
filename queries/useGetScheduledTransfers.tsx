import { BaseProvider } from '@ethersproject/providers';
import scheduledTransfer from 'abis/scheduledTransferContract';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { erc20ABI, useAccount } from 'wagmi';

const txcontract = '0xfF00899b2dec27677Da79FA0061827eeE17D3f91';

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
        const amount = event.args.amount;
        const toSend = event.args.toRelease;
        // const toSend = new Date(Number(event.args.toRelease) * 1e3).toISOString().slice(0, 10);
        const id = event.args.id;
        if (userAddress !== from && userAddress != to) continue;
        if (event.event === 'Created') {
          toInclude[id] = {
            token,
            from,
            to,
            amount,
            toSend,
          };
        } else if (event.event === 'Redeemed' || event.event === 'Rugged') {
          delete toInclude[id];
        }
      }

      for (const i in toInclude) {
        const tokenContract = new ethers.Contract(toInclude[i].token, erc20ABI, provider);
        toInclude[i].tokenSymbol = await tokenContract.symbol();
        toInclude[i].decimals = await tokenContract.decimals();
      }
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
