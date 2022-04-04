import llamaContractABI from 'abis/llamaContract';
import factoryABI from 'abis/llamaFactory';
import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { FACTORY_RINKEBY } from './constants';

export type Provider = ethers.providers.BaseProvider;

// TODO update provider based on user's network
export const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/c580a3487b1241a09f9e27b02c004f5b`
);

export const createContract = (cId: string) => new ethers.Contract(getAddress(cId), llamaContractABI, provider);

export const createWriteContract = (id: string, signer: Signer) =>
  new ethers.Contract(getAddress(id), llamaContractABI, signer);

export const createFactoryWriteContract = (signer: Signer) =>
  new ethers.Contract(getAddress(FACTORY_RINKEBY), factoryABI, signer);
