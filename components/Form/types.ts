import * as React from 'react';

export interface InputElement {
  name: string;
  label: string;
  isRequired: boolean;
  className?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface InputWithTokenElement extends InputElement {
  handleTokenChange: (token: string) => void;
  tokens: string[];
}

export interface InputWithTokenSelectProps extends InputElement {
  handleTokenChange: (token: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tokenOptions: string[];
}

export interface InputAmountWithDaysProps {
  name: string;
  selectInputName: string;
  label: string;
  isRequired: boolean;
  className?: string;
}
