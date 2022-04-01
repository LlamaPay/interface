import { Contract } from 'ethers';
import { IBalance } from 'types';

export interface IBalanceProps {
  balances: IBalance[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

export type TokenAction = 'deposit' | 'withdraw';

export interface IFormData {
  actionType: string;
  title: string;
  llamaContractAddress: string;
  symbol: string;
  tokenDecimals: number;
  tokenAddress: string;
  tokenContract: Contract;
  submit: string;
}

export interface IFormElements {
  amount: { value: string };
}

export interface ICheckApproval {
  tokenAddress: string;
  userAddress?: string;
  approvedForAmount: string;
}
