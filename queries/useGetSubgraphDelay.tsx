import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';

interface useGetSubgraphDelayProps {
  chainId: number | undefined;
}

const GET_LAST_INDEXED_BLOCK = gql`
  {
    _meta {
      block {
        number
      }
    }
  }
`;

async function getSubgraphDelay({ chainId }: useGetSubgraphDelayProps) {
  try {
    if (chainId === undefined) {
      throw new Error('Could not get chain');
    } else {
      const rpcUrl = networkDetails[chainId].rpcUrl;

      const subgraphEndpoint = networkDetails[chainId].subgraphEndpoint;

      const currentBlock = await fetch(rpcUrl, {
        method: 'POST',
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBlockByNumber', params: ['latest', false], id: 1 }),
      }).then((res) => res.json());

      const lastBlockIndexed = await request(subgraphEndpoint, GET_LAST_INDEXED_BLOCK).then(
        async (lastBlockIndexedResult) => {
          const height = lastBlockIndexedResult._meta.block.number;
          const block = await fetch(rpcUrl, {
            method: 'POST',
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBlockByNumber',
              params: ['0x' + height.toString(16), false],
              id: 1,
            }),
          }).then((res) => res.json());

          return {
            height,
            time: Number(block.result.timestamp),
          };
        }
      );

      const timeDelay = Number(currentBlock.result.timestamp) - lastBlockIndexed.time;

      const blockDelay = Number(currentBlock.result.number) - lastBlockIndexed.height;

      if (!timeDelay || !blockDelay) {
        throw new Error('Unable to get block or time information');
      }
      return { timeDelay, blockDelay, currentBlock: currentBlock.result.number };
    }
  } catch (error) {
    return null;
  }
}

export default function useGetSubgraphDelay() {
  const { chain } = useNetwork();

  const chainId = chain?.id;

  return useQuery(['subgraphDelay', chainId], () => getSubgraphDelay({ chainId }), {
    refetchInterval: 30000,
  });
}
