import * as React from 'react';

export interface InputElement {
  name: string;
  label: string;
  isRequired: boolean;
  className?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
  pattern?: string;
  handleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  showValue?: string | number | readonly string[] | undefined;
  type?: string;
}

export interface InputWithTokenElement extends InputElement {
  handleTokenChange: (token: string) => void;
  tokens: string[];
}

export interface InputWithTokenSelectProps extends InputElement {
  handleTokenChange: (token: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tokenOptions: string[];
  tokenBalanceOf: 'none' | 'wallet' | 'lpContract';
}

export interface InputAmountWithDaysProps {
  name: string;
  selectInputName: string;
  label: string;
  isRequired: boolean;
  className?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}
