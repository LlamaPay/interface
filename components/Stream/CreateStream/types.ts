import { IToken } from 'types';

export interface TokenOption {
  label: string;
  value: string;
}

export interface IStreamFormProps {
  tokens: IToken[];
  tokenOptions: TokenOption[];
  isDark: boolean;
}

export interface ICreateProps {
  tokens: IToken[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

export interface ICheckApproval {
  tokenAddress: string;
  userAddress?: string;
  approvedForAmount: string;
}

export interface IFormElements {
  tokenAddress: { value: string };
  amountToDeposit: { value: string };
  amountPerSec: { value: string };
  addressToStream: { value: string };
}

export interface ICreateStreamForm {
  balancesExist: boolean;
  tokens: IToken[];
}
