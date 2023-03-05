import { ethers, providers } from 'ethers';

import * as CONTRACTS from './contracts';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    subgraphEndpoint: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress: string;
    disperseAddress: string;
    botAddress: string;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory: string;
    vestingReason: string;
    paymentsContract?: string;
    paymentsGraphApi?: string;
    botSubgraph?: string;
    scheduledTransferFactory?: string;
    scheduledTransferSubgraph?: string;
  };
}

function createProvider(name: string, defaultRpc: string[], chainId: number) {
  return new ethers.providers.FallbackProvider(
    defaultRpc.map((url, i) => ({
      provider: new ethers.providers.StaticJsonRpcProvider(
        url,
        {
          name,
          chainId,
        }
      ),
      priority: i
    })),
    1
  )
}

const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

export const networkDetails: INetworkDetails = {
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fuji',
    chainProviders: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FUJI,
    disperseAddress: '0x267F83942214d11fDce5E8AA98351AFF6392946A',
    botAddress: '',
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FUJI,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  43114: {
    rpcUrl: 'https://rpc.ankr.com/avalanche',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avalanche-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/avalanche'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_AVALANCHE,
    disperseAddress: CONTRACTS.DISPERSE_AVALANCHE,
    botAddress: CONTRACTS.BOT_AVALANCHE,
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    tokenListId: 'avalanche',
    vestingFactory: CONTRACTS.VESTING_FACTORY_AVALANCHE,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-avax',
    paymentsContract: CONTRACTS.PAYMENTS_AVALANCHE,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-avalanche',
  },
  137: {
    rpcUrl: 'https://polygon-rpc.com/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-polygon',
    chainProviders: new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_POLYGON,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_POLYGON,
    blockExplorerURL: 'https://polygonscan.com/',
    blockExplorerName: 'Polygonscan',
    prefix: 'polygon',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    tokenListId: 'polygon-pos',
    vestingFactory: CONTRACTS.VESTING_FACTORY_POLYGON,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: CONTRACTS.PAYMENTS_POLYGON,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-polygon',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-polygon',
  },
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fantom',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FANTOM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_FANTOM,
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-fantom',
    paymentsContract: CONTRACTS.PAYMENTS_FANTOM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-fantom',
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet',
    chainProviders: createProvider("ethereum", ['https://rpc.ankr.com/eth', 'https://eth.llamarpc.com', 'https://cloudflare-eth.com', 'https://rpc.builder0x69.io'], 1),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_MAINNET,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_MAINNET,
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    tokenListId: 'ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY_MAINNET,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-mainnet',
    paymentsContract: CONTRACTS.PAYMENTS_MAINNET,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-mainnet',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_MAINNET,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduled-transfers-mainnet',
  },
  10: {
    rpcUrl: 'https://rpc.ankr.com/optimism',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-optimism',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/optimism'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_OPTIMISM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_OPTIMISM,
    blockExplorerURL: 'https://optimistic.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'optimism',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    tokenListId: 'optimistic-ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY_OPTIMISM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-optimism',
    paymentsContract: CONTRACTS.PAYMENTS_OPTIMISM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-optimism',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_OPTIMISM,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduledtransfers-optimism',
  },
  42161: {
    rpcUrl: 'https://arbitrum.blockpi.network/v1/rpc/public',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-arbitrum',
    chainProviders: new ethers.providers.JsonRpcProvider('https://arbitrum.blockpi.network/v1/rpc/public'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_ARBITRUM,
    disperseAddress: CONTRACTS.DISPERSE_ARBITRUM,
    botAddress: CONTRACTS.BOT_ARBITRUM,
    blockExplorerURL: 'https://arbiscan.io/',
    blockExplorerName: 'Arbiscan',
    prefix: 'arbitrum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    tokenListId: 'arbitrum-one',
    vestingFactory: CONTRACTS.VESTING_FACTORY_ARBITRUM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: CONTRACTS.PAYMENTS_ARBITRUM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-arbitrum',
  },
  56: {
    rpcUrl: 'https://rpc.ankr.com/bsc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bsc',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_BSC,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_BSC,
    blockExplorerURL: 'https://www.bscscan.com/',
    blockExplorerName: 'BscScan',
    prefix: 'bsc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    tokenListId: 'binance-smart-chain',
    vestingFactory: CONTRACTS.VESTING_FACTORY_BSC,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: CONTRACTS.PAYMENTS_BSC,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-bsc',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-bsc',
  },
  100: {
    rpcUrl: 'https://xdai-rpc.gateway.pokt.network',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-xdai',
    chainProviders: new ethers.providers.JsonRpcProvider('https://xdai-rpc.gateway.pokt.network'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_XDAI,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: '',
    blockExplorerURL: 'https://blockscout.com/xdai/mainnet/',
    blockExplorerName: 'Blockscout',
    prefix: 'xdai',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
    tokenListId: 'xdai',
    vestingFactory: CONTRACTS.VESTING_FACTORY_XDAI,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  82: {
    rpcUrl: 'https://rpc.meter.io',
    subgraphEndpoint: 'https://graph-meter.voltswap.finance/subgraphs/name/nemusonaneko/llamapay-subgraph',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.meter.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METER,
    disperseAddress: CONTRACTS.DISPERSE_METER,
    botAddress: '',
    blockExplorerURL: 'https://scan.meter.io/',
    blockExplorerName: 'Meter Blockchain Explorer',
    prefix: 'meter',
    logoURI: 'https://assets.coingecko.com/coins/images/11848/large/mtrg-logo.png?1595062273',
    tokenListId: 'meter',
    vestingFactory: CONTRACTS.VESTING_FACTORY_METER,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-goerli',
    chainProviders: providers.getDefaultProvider(5, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_GOERLI,
    disperseAddress: CONTRACTS.DISPERSE_GOERLI,
    botAddress: CONTRACTS.BOT_GOERLI,
    blockExplorerURL: 'https://goerli.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_GOERLI,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    paymentsContract: CONTRACTS.PAYMENTS_GOERLI,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-goerli',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-goerli',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_GOERLI,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduledtransfers-subgraph',
  },
  1088: {
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    subgraphEndpoint: 'https://andromeda-graph.metis.io/subgraphs/name/maia-dao/llama-pay',
    chainProviders: new ethers.providers.JsonRpcProvider('https://andromeda.metis.io/?owner=1088'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METIS,
    disperseAddress: CONTRACTS.DISPERSE_METIS,
    botAddress: '',
    blockExplorerURL: 'https://andromeda-explorer.metis.io/',
    blockExplorerName: 'Andromeda Metis Explorer',
    prefix: 'metis',
    tokenListId: 'metis-andromeda',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_METIS,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  2222: {
    rpcUrl: 'https://evm.kava.io',
    subgraphEndpoint: 'https://the-graph.kava.io/subgraphs/name/nemusonaneko/llamapay-subgraph/',
    chainProviders: new ethers.providers.JsonRpcProvider('https://evm.kava.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_KAVA,
    disperseAddress: CONTRACTS.DISPERSE_KAVA,
    botAddress: '',
    blockExplorerURL: 'https://explorer.kava.io/',
    blockExplorerName: 'Kava Explorer',
    prefix: 'kava',
    tokenListId: 'kava-evm',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kava/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_KAVA,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
};
