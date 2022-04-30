import llamaContract from 'abis/llamaContract';
import llamaContractABI from 'abis/llamaContract';
import factoryABI from 'abis/llamaFactory';
import { ethers, Signer } from 'ethers';
import { getAddress, Interface } from 'ethers/lib/utils';

export type Provider = ethers.providers.BaseProvider;

export const createContract = (cId: string, provider: Provider) =>
  new ethers.Contract(getAddress(cId), llamaContractABI, provider);

export const createWriteContract = (id: string, signer: Signer) =>
  new ethers.Contract(getAddress(id), llamaContractABI, signer);

export const createFactoryWriteContract = (factoryAddress: string, signer: Signer) =>
  new ethers.Contract(getAddress(factoryAddress), factoryABI, signer);

export const LlamaContractInterface = new Interface(llamaContract);
