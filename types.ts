import { Contract } from 'ethers';

export interface IToken {
  tokenAddress: string;
  llamaTokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  llamaTokenContract: Contract;
}

export interface IBalance {
  token: string;
  address: string;
  amount: string;
}
