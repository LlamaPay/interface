import * as React from 'react';
import { UseMutateFunction } from 'react-query';
import { ICheckTokenAllowance } from 'utils/tokenUtils';

export interface InputElement {
  name: string;
  label: string;
  isRequired: boolean;
  className?: string;
}

export interface InputWithTokenElement extends InputElement {
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTokenChange: (token: string) => void;
  tokens: string[];
}

export interface InputWithTokenSelectProps extends InputElement {
  tokenAddress: string;
  setTokenAddress: React.Dispatch<React.SetStateAction<string>>;
  checkTokenApproval?: UseMutateFunction<boolean, unknown, ICheckTokenAllowance, unknown>;
}
