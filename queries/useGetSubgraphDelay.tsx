import { useQuery } from 'react-query';
import axios from 'axios';
import { gql, request } from 'graphql-request';
import { useNetwork } from 'wagmi';
import { networkDetails } from 'utils/constants';

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
      const currentBlock = await axios.post(rpcUrl, {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      });
      const lastBlockIndexed = await request(subgraphEndpoint, GET_LAST_INDEXED_BLOCK).then(
        async (lastBlockIndexedResult) => {
          const height = lastBlockIndexedResult._meta.block.number;
          const block = await axios.post(rpcUrl, {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['0x' + height.toString(16), false],
            id: 1,
          });
          return {
            height,
            time: Number(block.data.result.timestamp),
          };
        }
      );
      return Number(currentBlock.data.result.timestamp) - lastBlockIndexed.time;
    }
  } catch (error) {
    return null;
  }
}

export default function useGetSubgraphDelay() {
  const [{ data }] = useNetwork();
  const chainId = data.chain?.id;

  return useQuery(['subgraphDelay', getSubgraphDelay], () => getSubgraphDelay({ chainId }), {
    refetchInterval: 10000,
  });
}
