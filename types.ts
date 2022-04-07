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
  tokenDecimals: number;
  tokenContract: Contract;
}

export interface IPayer {
  name: string;
  address: string;
  symbol: string;
  contractAddress: string;
  tokenDecimals: number;
  tokenContract: Contract;
  totalPaidPerSec: string | null;
  lastPayerUpdate: string | null;
}
