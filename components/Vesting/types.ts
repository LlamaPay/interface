export interface IVestingElements {
  recipientAddress: { value: string };
  tokenDecimals: number;
  vestedToken: { value: string };
  vestingAmount: { value: string };
  vestingDuration: { value: 'year' | 'month' | 'week' };
  cliffTime: { value: string };
  startDate: { value: string };
}

export interface IVestingGnosisFormValues {
  vestingContracts: {
    recipientAddress: string;
    vestedAmount: string;
    vestingTime: string;
    vestingDuration: 'month' | 'year' | 'week';
    includeCliff: boolean;
    includeCustomStart: boolean;
    cliffTime: string;
    cliffDuration: 'month' | 'year' | 'week';
    startDate: string;
  }[];
}

export interface IChartValues {
  tokenSymbol: string;
  amount: number;
  vestingPeriod: number;
  cliffPeriod: number | null;
  startTime: Date;
  vestedDays?: string | null | undefined;
}
