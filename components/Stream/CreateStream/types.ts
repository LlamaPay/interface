import { IToken } from 'types';
import { OnChangeValue } from 'react-select';

export interface TokenOption {
  label: string;
  value: string;
}

export interface ICreateStreamOnlyProps {
  tokenOptions: TokenOption[];
  handleTokenChange: (token: OnChangeValue<TokenOption, false>) => void;
  handleAmountPerSecChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disableSubmit: boolean;
  isApproving: boolean;
  isApproved: boolean;
  handleApproval: () => void;
  isDark: boolean;
}

export interface IDepositAndCreateProps extends ICreateStreamOnlyProps {
  handleDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  amountPerSec: { value: string };
  addressToStream: { value: string };
}

export interface ICreateStreamForm {
  balancesExist: boolean;
  tokens: IToken[];
}
