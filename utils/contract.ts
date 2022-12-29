import { llamaContractABI } from 'lib/abis/llamaContract';
import { factoryABI } from 'lib/abis/llamaFactory';
import { ethers, Signer } from 'ethers';
import { getAddress, Interface } from 'ethers/lib/utils';
import { erc20ABI } from 'wagmi';

export type Provider = ethers.providers.BaseProvider;

export const createContract = (cId: string, provider: Provider) =>
  new ethers.Contract(getAddress(cId), llamaContractABI, provider);

export const createWriteContract = (id: string, signer: Signer) =>
  new ethers.Contract(getAddress(id), llamaContractABI, signer);

export const createFactoryWriteContract = (factoryAddress: string, signer: Signer) =>
  new ethers.Contract(getAddress(factoryAddress), factoryABI, signer);

export const LlamaContractInterface = new Interface(llamaContractABI);

export const ERC20Interface = new Interface(erc20ABI);
