import { DisclosureState } from 'ariakit';
import { Contract } from 'ethers';
import type { ITokenBalance } from '~/queries/useTokenBalances';

export type TokenAction = 'deposit' | 'withdraw';

export interface IFormData {
  actionType: string;
  title: string;
  llamaContractAddress: string;
  symbol: string;
  logoURI: string;
  userBalance: string;
  selectedToken: ITokenBalance | null;
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

export interface IFormProps {
  data: IFormData;
  formDialog: DisclosureState;
}
