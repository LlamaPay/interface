import { ITokenList } from 'types';

const kovan: ITokenList = {
  '0xd0a1e359811322d97991e03f863a0c30c2cf029c': {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    chainId: 42,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa': {
    chainId: 42,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  '0x07de306ff27a2b630b1141956844eb1552b956b5': {
    chainId: 42,
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png',
  },
  '0xd3a691c852cdb01e281545a27064741f0b7f6825': {
    chainId: 42,
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  '0xb7a4f3e9097c08da09517b5ab877f7a917224ede': {
    chainId: 42,
    name: 'USD Coin USDC',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
};

export default kovan;
