import { providers } from 'ethers';

export const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
export const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
export const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

interface ISecondsByDuration {
  [key: string]: number;
}

interface ITokenWhitelist {
  [key: string]: {
    logoURI: string;
    isVerified: boolean;
    name: string;
  };
}

export const defaultProvider = providers.getDefaultProvider(4, {
  alchemy: alchemyId,
  etherscan: etherscanKey,
  infura: infuraId,
});

export const secondsByDuration: ISecondsByDuration = {
  hour: 60 * 60,
  day: 24 * 60 * 60,
  week: 7 * 24 * 60 * 60,
  biweek: 2 * 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};

export const blacklist = ['0x5729cb3716a315d0bde3b5e489163bf8b9659436', '0x6abaedab0ba368f1df52d857f24154cc76c8c972'];

export const whitelist: ITokenWhitelist = {
  '0x687a6294d0d6d63e751a059bf1ca68e4ae7b13e2': {
    logoURI:
      'https://assets.coingecko.com/coins/images/12149/large/Meter-Logo-Vertical-Gray-Light-Blue-rgb-200x200px.png?1597618760',
    name: 'Meter',
    isVerified: true,
  },
};

export const zeroAdd = '0x0000000000000000000000000000000000000000';

export const botDeployedOn: number[] = [43114, 5, 1, 137, 10, 250, 56, 42161];

export const timeframes = ['Hour', 'Day', 'Week', 'Month', 'Year'];
