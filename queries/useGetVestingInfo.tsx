import { BaseProvider } from '@ethersproject/providers';
import vestingEscrow from 'abis/vestingEscrow';
import vestingFactory from 'abis/vestingFactory';
import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { IVesting } from 'types';
import { networkDetails } from 'utils/constants';
import { erc20ABI, useAccount } from 'wagmi';

async function getVestingInfo(userAddress: string | undefined, provider: BaseProvider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const factoryAddress = networkDetails[chainId].vestingFactory;
      const factoryContract = new ethers.Contract(factoryAddress, vestingFactory, provider);
      const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
      const amtOfContracts = await factoryContract.escrows_length();
      const vestingContractsContext: ContractCallContext[] = Array.from({ length: Number(amtOfContracts) }, (_, k) => ({
        reference: k.toString(),
        contractAddress: factoryAddress,
        abi: vestingFactory,
        calls: [{ reference: 'escrow', methodName: 'escrows', methodParameters: [k] }],
      }));
      const vestingContractsResults: ContractCallResults = await multicall.call(vestingContractsContext);
      const vestingContractInfoContext: ContractCallContext[] = Object.keys(vestingContractsResults.results).map(
        (p: any) => ({
          reference: vestingContractsResults.results[p].callsReturnContext[0].returnValues[0],
          contractAddress: vestingContractsResults.results[p].callsReturnContext[0].returnValues[0],
          abi: vestingEscrow,
          calls: [
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
          ],
        })
      );
      const vestingContractInfoResults = await multicall.call(vestingContractInfoContext);
      const tokenContractCallContext: ContractCallContext[] = Object.keys(vestingContractInfoResults.results).map(
        (p: any) => ({
          reference: vestingContractInfoResults.results[p].callsReturnContext[3].returnValues[0],
          contractAddress: vestingContractInfoResults.results[p].callsReturnContext[3].returnValues[0],
          abi: erc20ABI,
          calls: [
            { reference: 'name', methodName: 'name', methodParameters: [] },
            { reference: 'symbol', methodName: 'symbol', methodParameters: [] },
            { reference: 'decimals', methodName: 'decimals', methodParameters: [] },
          ],
        })
      );
      const tokenContractCallResults: ContractCallResults = await multicall.call(tokenContractCallContext);
      const results: IVesting[] = [];

      for (const key in vestingContractInfoResults.results) {
        const vestingReturnContext = vestingContractInfoResults.results[key].callsReturnContext;
        const recipient = vestingReturnContext[2].returnValues[0].toLowerCase();
        const admin = vestingReturnContext[9].returnValues[0].toLowerCase();
        if (userAddress.toLowerCase() !== recipient && userAddress.toLowerCase() !== admin) continue;
        const tokenReturnContext =
          tokenContractCallResults.results[vestingReturnContext[3].returnValues[0]].callsReturnContext;
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
        });
      }
      return results;
    }
  } catch (error) {
    return null;
  }
}

export default function useGetVestingInfo() {
  const { provider, chainId } = useNetworkProvider();

  const [{ data: accountData }] = useAccount();

  return useQuery(
    ['vestingInfo', accountData?.address, chainId],
    () => getVestingInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 30000,
    }
  );
}

interface IVestingInfoByQueryParams {
  address: string;
  chainId: number | null;
  provider: BaseProvider | null;
}

export function useGetVestingInfoByQueryParams({ address, chainId, provider }: IVestingInfoByQueryParams) {
  return useQuery(['vestingInfo', address, chainId], () => getVestingInfo(address, provider, chainId), {
    refetchInterval: 30000,
  });
}
