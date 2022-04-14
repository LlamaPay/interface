import { ITokenList } from 'types';

const kovan: ITokenList[] = [
  {
    name: 'Wrapped Ether',
    address: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    symbol: 'WETH',
    decimals: 18,
    chainId: 42,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    chainId: 42,
    address: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    chainId: 42,
    address: '0x07de306FF27a2B630B1141956844eB1552B956B5',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    chainId: 42,
    address: '0xd3A691C852CDB01E281545A27064741F0B7f6825',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    chainId: 42,
    address: '0xb7a4F3E9097C08dA09517b5aB877F7a917224ede',
    name: 'USD Coin USDC',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
];

export default kovan;
