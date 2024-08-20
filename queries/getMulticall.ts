import { Multicall } from "ethereum-multicall";
import { ethers } from "ethers";
import { networkDetails } from "~/lib/networkDetails";

const multicalls: { [key: number]: string } = {
    2222: '0x30A62aA52Fa099C4B227869EB6aeaDEda054d121',
};

export function getMulticall(provider: ethers.providers.BaseProvider, chainId?: number) {
    return chainId && multicalls[chainId]
        ? new Multicall({
            nodeUrl: networkDetails[chainId].rpcUrl,
            multicallCustomContractAddress: multicalls[chainId],
            tryAggregate: true
        })
        : new Multicall({
            ethersProvider: provider,
            tryAggregate: true,
            multicallCustomContractAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
        });
}