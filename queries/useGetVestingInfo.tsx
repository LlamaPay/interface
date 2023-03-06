import type { Provider } from '~/utils/contract';
import BigNumber from 'bignumber.js';
import { ContractCallContext, Multicall } from 'ethereum-multicall';
import { ContractInterface, ethers } from 'ethers';
import { useNetworkProvider } from '~/hooks';
import { useQuery } from '@tanstack/react-query';
import type { IVesting } from '~/types';
import { networkDetails } from '~/lib/networkDetails';
import { erc20ABI, useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';
import { vestingFactoryABI } from '~/lib/abis/vestingFactory';
import { vestingReasonsABI } from '~/lib/abis/vestingReasons';
import vestingEscrowABI from '~/lib/abis/vestingEscrow';
import { getAddress } from 'ethers/lib/utils';

const vestingEscrowCalls = [
  { reference: 'unclaimed', methodName: 'unclaimed', methodParameters: [] },
  { reference: 'locked', methodName: 'locked', methodParameters: [] },
  { reference: 'recipient', methodName: 'recipient', methodParameters: [] },
  { reference: 'token', methodName: 'token', methodParameters: [] },
  { reference: 'startTime', methodName: 'start_time', methodParameters: [] },
  { reference: 'endTime', methodName: 'end_time', methodParameters: [] },
  { reference: 'cliffLength', methodName: 'cliff_length', methodParameters: [] },
  { reference: 'totalLocked', methodName: 'total_locked', methodParameters: [] },
  { reference: 'totalClaimed', methodName: 'total_claimed', methodParameters: [] },
  { reference: 'admin', methodName: 'admin', methodParameters: [] },
  { reference: 'disabled_at', methodName: 'disabled_at', methodParameters: [] },
];

const escrowCallsSubgraph = [
  { reference: 'unclaimed', methodName: 'unclaimed', methodParameters: [] },
  { reference: 'locked', methodName: 'locked', methodParameters: [] },
  { reference: 'totalClaimed', methodName: 'total_claimed', methodParameters: [] },
];

const subgraphs: { [key: number]: string } = {
  1: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-vesting-mainnet',
  5: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-vesting-goerli',
  42161: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-vesting-arbitrum',
};

const multicalls: { [key: number]: string } = {
  2222: '0x30A62aA52Fa099C4B227869EB6aeaDEda054d121',
  42161: '0xcA11bde05977b3631167028862bE2a173976CA11',
};

async function getVestingInfo(userAddress: string | undefined, provider: Provider | null, chainId: number | null) {
  try {
    if (!provider) throw new Error('No provider');
    if (!userAddress) throw new Error('No account');
    if (!chainId) throw new Error('No Chain ID');
    let results: IVesting[] = [];
    const multicall = multicalls[chainId]
      ? new Multicall({
          nodeUrl: networkDetails[chainId].rpcUrl,
          multicallCustomContractAddress: multicalls[chainId],
        })
      : new Multicall({ ethersProvider: provider, tryAggregate: true });
    const runMulticall = async (calls: any[]) => {
      const pending = [];
      for (let i = 0; i < calls.length; i += 200) {
        pending.push(multicall.call(calls.slice(i, i + 200)));
      }
      return (await Promise.all(pending)).reduce((all, r) => {
        Object.assign(all, r.results);
        return all;
      }, {} as any);
    };
    if (subgraphs[chainId]) {
      const GET_ADMIN = gql`
        {
          vestingEscrows(where: {admin: "${userAddress.toLowerCase()}"}, first:1000) {
            id
            factory
            admin
            recipient
            token {
              id
              symbol
              name
              decimals
            }
            escrow
            amount
            start
            totalLocked
            totalClaimed
            disabledAt
            duration
            cliff
            end
          }
        }
        `;
      const GET_RECIPIENT = gql`
        {
          vestingEscrows(where: {recipient: "${userAddress.toLowerCase()}"}) {
            id
            factory
            admin
            recipient
            token {
              id
              symbol
              name
              decimals
            }
            escrow
            amount
            start
            totalLocked
            totalClaimed
            disabledAt
            duration
            cliff
            end
          }
        }
        `;
      const admins = (await request(subgraphs[chainId], GET_ADMIN)).vestingEscrows;
      const recipients = (await request(subgraphs[chainId], GET_RECIPIENT)).vestingEscrows;
      const escrows = admins.concat(recipients);
      const vestingContractInfoContext: ContractCallContext[] = Object.keys(escrows).map((p: any) => ({
        reference: escrows[p].id,
        contractAddress: escrows[p].id,
        abi: vestingEscrowABI,
        calls: escrowCallsSubgraph,
      }));
      const vestingContractInfoResults = await runMulticall(vestingContractInfoContext);
      const unsortedResults: IVesting[] = [];

      const vestingContractReasonContext: ContractCallContext[] = Object.keys(escrows).map((p: any) => ({
        reference: escrows[p].id,
        abi: vestingReasonsABI,
        contractAddress: networkDetails[chainId].vestingReason,
        calls: [
          {
            reference: 'reason',
            methodName: 'reasons',
            methodParameters: [escrows[p].id],
          },
        ],
      }));
      const vestingContractReasonResults = await runMulticall(vestingContractReasonContext);

      for (const i in escrows) {
        const returns = vestingContractInfoResults[escrows[i].id].callsReturnContext;
        const reason = vestingContractReasonResults[escrows[i].id].callsReturnContext[0].returnValues[0];
        const result = {
          contract: escrows[i].id.toString(),
          unclaimed: new BigNumber(returns[0].returnValues[0].hex).toString(),
          locked: new BigNumber(returns[1].returnValues[0].hex).toString(),
          recipient: escrows[i].recipient.toString(),
          token: escrows[i].token.id.toString(),
          tokenName: escrows[i].token.name.toString(),
          tokenSymbol: escrows[i].token.symbol.toString(),
          tokenDecimals: escrows[i].token.decimals.toString(),
          startTime: escrows[i].start.toString(),
          endTime: escrows[i].end.toString(),
          cliffLength: escrows[i].cliff.toString(),
          totalLocked: escrows[i].totalLocked.toString(),
          totalClaimed: new BigNumber(returns[2].returnValues[0].hex).toString(),
          admin: escrows[i].admin.toString(),
          disabledAt: escrows[i].disabledAt.toString(),
          timestamp: Date.now() / 1e3,
          reason: reason !== '' ? reason : null,
        };
        unsortedResults.push(result);
      }

      results = unsortedResults.sort((a: any, b: any) => a.index - b.index);
    } else {
      const factoryAddress = networkDetails[chainId].vestingFactory;
      const factoryContract = new ethers.Contract(factoryAddress, vestingFactoryABI, provider);
      const amtOfContracts = Number(await factoryContract.escrows_length({ gasLimit: 10000000 }));
      const vestingContractsContext: ContractCallContext[] = Array.from({ length: Number(amtOfContracts) }, (_, k) => ({
        reference: k.toString(),
        contractAddress: factoryAddress,
        abi: vestingFactoryABI,
        calls: [{ reference: 'escrow', methodName: 'escrows', methodParameters: [k] }],
      }));
      const vestingContractsResults: any[] = await runMulticall(vestingContractsContext);
      const vestingContractInfoContext: ContractCallContext[] = Object.keys(vestingContractsResults).map((p: any) => ({
        reference: vestingContractsResults[p].callsReturnContext[0].returnValues[0],
        contractAddress: vestingContractsResults[p].callsReturnContext[0].returnValues[0],
        abi: vestingEscrowABI,
        calls: vestingEscrowCalls,
      }));
      let vestingContractReasonResults;
      if (networkDetails[chainId].vestingReason !== '0x0000000000000000000000000000000000000000') {
        const vestingContractReasonContext: ContractCallContext[] = Object.keys(vestingContractsResults).map(
          (p: any) => ({
            reference: vestingContractsResults[p].callsReturnContext[0].returnValues[0].toLowerCase(),
            abi: vestingReasonsABI,
            contractAddress: networkDetails[chainId].vestingReason,
            calls: [
              {
                reference: 'reason',
                methodName: 'reasons',
                methodParameters: [vestingContractsResults[p].callsReturnContext[0].returnValues[0]],
              },
            ],
          })
        );
        vestingContractReasonResults = await runMulticall(vestingContractReasonContext);
      }
      const vestingContractInfoResults = await runMulticall(vestingContractInfoContext);
      const tokenContractCallContext = Object.keys(vestingContractInfoResults).map((p: any) => ({
        reference: vestingContractInfoResults[p].callsReturnContext[3].returnValues[0],
        contractAddress: vestingContractInfoResults[p].callsReturnContext[3].returnValues[0],
        abi: erc20ABI,
        calls: [
          { reference: 'name', methodName: 'name', methodParameters: [] },
          { reference: 'symbol', methodName: 'symbol', methodParameters: [] },
          { reference: 'decimals', methodName: 'decimals', methodParameters: [] },
        ],
      }));
      const tokenContractCallResults: any[] = await runMulticall(tokenContractCallContext);
      for (const key in vestingContractInfoResults) {
        const vestingReturnContext = vestingContractInfoResults[key].callsReturnContext;
        const recipient = vestingReturnContext[2].returnValues[0].toLowerCase();
        const admin = vestingReturnContext[9].returnValues[0].toLowerCase();
        if (userAddress.toLowerCase() !== recipient && userAddress.toLowerCase() !== admin) continue;
        const tokenReturnContext = tokenContractCallResults[vestingReturnContext[3].returnValues[0]].callsReturnContext;
        const reason =
          networkDetails[chainId].vestingReason === '0x0000000000000000000000000000000000000000'
            ? ''
            : vestingContractReasonResults[key.toLowerCase()].callsReturnContext[0].returnValues[0];
        results.push({
          contract: key,
          unclaimed: new BigNumber(vestingReturnContext[0].returnValues[0].hex).toString(),
          locked: new BigNumber(vestingReturnContext[1].returnValues[0].hex).toString(),
          recipient: recipient,
          token: vestingReturnContext[3].returnValues[0],
          tokenName: tokenReturnContext[0].returnValues[0],
          tokenSymbol: tokenReturnContext[1].returnValues[0],
          tokenDecimals: tokenReturnContext[2].returnValues[0],
          startTime: new BigNumber(vestingReturnContext[4].returnValues[0].hex).toString(),
          endTime: new BigNumber(vestingReturnContext[5].returnValues[0].hex).toString(),
          cliffLength: new BigNumber(vestingReturnContext[6].returnValues[0].hex).toString(),
          totalLocked: new BigNumber(vestingReturnContext[7].returnValues[0].hex).toString(),
          totalClaimed: new BigNumber(vestingReturnContext[8].returnValues[0].hex).toString(),
          admin: admin,
          disabledAt: new BigNumber(vestingReturnContext[10].returnValues[0].hex).toString(),
          timestamp: Date.now() / 1e3,
          reason: reason !== '' ? reason : null,
        });
      }
    }
    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function useGetVestingInfo() {
  const { provider, chainId } = useNetworkProvider();

  const { address } = useAccount();

  return useQuery(['vestingInfo', address, chainId], () => getVestingInfo(address, provider, chainId));
}

interface IVestingInfoByQueryParams {
  address: string;
  chainId: number | null;
  provider: Provider | null;
}

export function useGetVestingInfoByQueryParams({ address, chainId, provider }: IVestingInfoByQueryParams) {
  return useQuery(['vestingInfo', address, chainId], () => getVestingInfo(address, provider, chainId), {
    refetchInterval: 60000,
  });
}
