import { BaseProvider } from '@ethersproject/providers';
import vestingEscrow from 'abis/vestingEscrow';
import vestingFactory from 'abis/vestingFactory';
import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { IVesting } from 'types';
import { useAccount, useProvider } from 'wagmi';

async function getVestingInfo(userAddress: string, provider: BaseProvider) {
  try {
    if (!provider) {
      throw new Error('No signer/provider');
    } else {
      const factoryContract = new ethers.Contract(
        '0xdC6Ac3c1ec8dC4bA2884AF348e76b8bc4807bF1E',
        vestingFactory,
        provider
      );
      const amountOfContracts = await factoryContract.get_contract_count();
      const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

      const vestingFactorycalls = Array.from({ length: amountOfContracts }, (_, k) => ({
        reference: k.toString(),
        methodName: 'vesting_info_by_index',
        methodParameters: [k],
      }));
      const factoryContractCallContext: ContractCallContext[] = [
        {
          reference: 'Factory',
          contractAddress: '0xdC6Ac3c1ec8dC4bA2884AF348e76b8bc4807bF1E',
          abi: vestingFactory,
          calls: vestingFactorycalls,
        },
      ];

      const factoryMulticallResults: ContractCallResults = await multicall.call(factoryContractCallContext);
      const vestingContracts: string[] = [];

      factoryMulticallResults.results.Factory.callsReturnContext.map((p) => {
        const arr = p.returnValues;
        if (arr[1].toLowerCase() === userAddress.toLowerCase() || arr[2].toLowerCase() === userAddress.toLowerCase()) {
          vestingContracts.push(arr[0]);
        }
      });

      const vestingContractCallContext: ContractCallContext[] = vestingContracts.map((p) => ({
        reference: p,
        contractAddress: p,
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
        ],
      }));
      const vestingContractMulticallResults: ContractCallResults = await multicall.call(vestingContractCallContext);

      const results: IVesting[] = [];
      Object.keys(vestingContractMulticallResults.results).forEach((key) => {
        const context = vestingContractMulticallResults.results[key].callsReturnContext;
        results.push({
          unclaimed: new BigNumber(context[0].returnValues[0].hex).toString(),
          locked: new BigNumber(context[1].returnValues[0].hex).toString(),
          recipient: context[2].returnValues[0],
          token: context[3].returnValues[0],
          startTime: new BigNumber(context[4].returnValues[0].hex).toString(),
          endTime: new BigNumber(context[5].returnValues[0].hex).toString(),
          cliffLength: new BigNumber(context[6].returnValues[0].hex).toString(),
          totalLocked: new BigNumber(context[7].returnValues[0].hex).toString(),
          totalClaimed: new BigNumber(context[8].returnValues[0].hex).toString(),
          admin: context[9].returnValues[0],
        });
      });

      return results;
    }
  } catch (error) {
    console.error(error);
  }
}

export default function useGetVestingInfo() {
  const provider = useProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(['vestingInfo'], () => getVestingInfo(accountData?.address ?? '', provider), {
    refetchInterval: 10000,
  });
}
