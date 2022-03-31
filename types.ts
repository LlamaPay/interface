import { Contract } from 'ethers';

export interface IToken {
  tokenAddress: string;
  llamaContractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  llamaTokenContract: Contract;
}

export interface IBalance {
  name: string;
  address: string;
  symbol: string;
  amount: string;
  contractAddress: string;
}
