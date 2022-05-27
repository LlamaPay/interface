import { BaseProvider } from '@ethersproject/providers';
import vestingEscrow from 'abis/vestingEscrow';
import vestingFactory from 'abis/vestingFactory';
import BigNumber from 'bignumber.js';
import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { IVesting } from 'types';
import { erc20ABI, useAccount, useProvider } from 'wagmi';

async function getVestingInfo(userAddress: string, provider: BaseProvider) {
  try {
    if (!provider) {
      throw new Error('No signer/provider');
    } else {
      const factoryContract = new ethers.Contract(
        '0xE2c30F52776803FE554fbdE744bA8D993B4CD07E',
        vestingFactory,
        provider
      );
      const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

      const vestingContracts = await factoryContract.contract_by_address(userAddress);

      const vestingContractCallContext: ContractCallContext[] = vestingContracts.map((p: any) => ({
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
      for (const key in vestingContractMulticallResults.results) {
        const context = vestingContractMulticallResults.results[key].callsReturnContext;
        if (context[7].returnValues[0].hex === context[8].returnValues[0].hex) continue;
        const tokenInfo: ContractCallContext[] = [
          {
            reference: 'token',
            contractAddress: context[3].returnValues[0],
            abi: erc20ABI,
            calls: [
              { reference: 'name', methodName: 'name', methodParameters: [] },
              { reference: 'symbol', methodName: 'symbol', methodParameters: [] },
              { reference: 'decimals', methodName: 'decimals', methodParameters: [] },
            ],
          },
        ];
        const tokenInfoResult: ContractCallResults = await multicall.call(tokenInfo);
        const tokenContext = tokenInfoResult.results.token.callsReturnContext;
        results.push({
          contract: key,
          unclaimed: new BigNumber(context[0].returnValues[0].hex).toString(),
          locked: new BigNumber(context[1].returnValues[0].hex).toString(),
          recipient: context[2].returnValues[0],
          token: context[3].returnValues[0],
          tokenName: tokenContext[0].returnValues[0],
          tokenSymbol: tokenContext[1].returnValues[0],
          tokenDecimals: tokenContext[2].returnValues[0],
          startTime: new BigNumber(context[4].returnValues[0].hex).toString(),
          endTime: new BigNumber(context[5].returnValues[0].hex).toString(),
          cliffLength: new BigNumber(context[6].returnValues[0].hex).toString(),
          totalLocked: new BigNumber(context[7].returnValues[0].hex).toString(),
          totalClaimed: new BigNumber(context[8].returnValues[0].hex).toString(),
          admin: context[9].returnValues[0],
        });
      }

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
    retry: true,
  });
}
