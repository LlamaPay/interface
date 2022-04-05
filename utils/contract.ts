import llamaContractABI from 'abis/llamaContract';
import factoryABI from 'abis/llamaFactory';
import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { FACTORY_RINKEBY } from './constants';

export type Provider = ethers.providers.BaseProvider;

export const createContract = (cId: string, provider: Provider) =>
  new ethers.Contract(getAddress(cId), llamaContractABI, provider);

export const createWriteContract = (id: string, signer: Signer) =>
  new ethers.Contract(getAddress(id), llamaContractABI, signer);

export const createFactoryWriteContract = (signer: Signer) =>
  new ethers.Contract(getAddress(FACTORY_RINKEBY), factoryABI, signer);
