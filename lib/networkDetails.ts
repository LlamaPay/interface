import { ethers, providers } from 'ethers';

import * as CONTRACTS from './contracts';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    subgraphEndpoint?: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress?: string;
    disperseAddress?: string;
    botAddress?: string;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory?: string;
    vestingFactory_v2?: string;
    vestingReason?: string;
    paymentsContract?: string;
    paymentsGraphApi?: string;
    botSubgraph?: string;
    scheduledTransferFactory?: string;
    scheduledTransferSubgraph?: string;
  };
}

/*
function scramble(str) {
  return str.split("").reduce(function(a, b) {
    return a + String.fromCharCode(b.charCodeAt(0)-8)
  }, "");
}
*/

function unscramble(str: string) {
  return str.split('').reduce(function (a, b) {
    return a + String.fromCharCode(b.charCodeAt(0) + 8);
  }, '');
}

const apiKey = unscramble('.[^+0](,0[+1,*\\YZY\\[(*+Z,][/**,]');

const NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS = '0x09c39B8311e4B7c678cBDAD76556877ecD3aEa07';

export const networkDetails: INetworkDetails = {
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/EWy9CqLKcTP6XTUkCAFmLcLX2mSvddwPVMYN4ZBrqaF1`,
    chainProviders: new ethers.providers.StaticJsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FUJI,
    disperseAddress: '0x267F83942214d11fDce5E8AA98351AFF6392946A',
    botAddress: '',
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
  },
  43114: {
    rpcUrl: 'https://rpc.ankr.com/avalanche',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/CGYMJE88Ek6Kju2cp16AxmqiSGAqmvxJAiAkEFJkwgVs`,
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/avalanche'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_AVALANCHE,
    disperseAddress: CONTRACTS.DISPERSE_AVALANCHE,
    botAddress: CONTRACTS.BOT_AVALANCHE,
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    tokenListId: 'avalanche',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/A49QjCZ2GbzRfCMQKJQF3SQYZ8MpFacpHuw5Q53PBKz9`,
    paymentsContract: CONTRACTS.PAYMENTS_AVALANCHE,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/CrJxHvquW6sNuCj1mNXrDZ8hWHWnfu7X9snazWtTqQtF`,
  },
  137: {
    rpcUrl: 'https://polygon-rpc.com/',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/egF47mBwB7ytP3aQafhRNHAdtAFHUaZUGy5Me7bq2ew`,
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://polygon-rpc.com/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_POLYGON,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_POLYGON,
    blockExplorerURL: 'https://polygonscan.com/',
    blockExplorerName: 'Polygonscan',
    prefix: 'polygon',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    tokenListId: 'polygon-pos',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    paymentsContract: CONTRACTS.PAYMENTS_POLYGON,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/FDauzKUtS4UZmKEVKXdR37APeXdwSXDCePkf3U5iDzrc`,
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/JBfEeS3J7meG1WzU8NMxTRJCBE7tKHfRWAQahRth6T14`,
  },
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/5zwyXgo58VdUvfAZP2Bz1EVsLHCdzfAMWGaRu2Y4U1J3`,
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FANTOM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_FANTOM,
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/41NgkGvcU7jjyJpWHNnKVVRZFAsCWX6rbWWCjjpwgQok`,
    paymentsContract: CONTRACTS.PAYMENTS_FANTOM,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/6vyhosmB3xF2f5sU2PJK3hxtA2wTGfPZsg28vau9JZCd`,
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/5Ac1MryeCPqmzmXGMcchhmKsdaVKwzQ796KApoLGNtqZ`, //llamapay-mainnet',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/eth'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_MAINNET,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_MAINNET,
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    tokenListId: 'ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0xcf61782465Ff973638143d6492B51A85986aB347',
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/AVrj3QRTzRs5ZfogtGewCtu8S7CwagnVCozNNikustRA`,
    paymentsContract: CONTRACTS.PAYMENTS_MAINNET,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/8HG4Tn3WC6659dLtJF5fuJcasoBSN9N62v78K76tKGXN`,
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_MAINNET,
    scheduledTransferSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/C7rea3gfQLg8yUjgbYkgLsSX3VMu3wHucMqfazMFGhwP`,
  },
  10: {
    rpcUrl: 'https://rpc.ankr.com/optimism',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/Hw2mERc7LMD9papcf1QPq4puBpHJqh4tNrEZYRC65Hqe`, //llamapay-optimism',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/optimism'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_OPTIMISM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_OPTIMISM,
    blockExplorerURL: 'https://optimistic.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'optimism',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    tokenListId: 'optimistic-ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/F3wRbPXX9nuvtrU361kuZwZ4bz6upzPZ4J2RBLZCzu8b`,
    paymentsContract: CONTRACTS.PAYMENTS_OPTIMISM,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/GVgKyZugHeFpvYySSG3mxJ7tFZTMGKL8mzs5781L5VSL`,
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_OPTIMISM,
    //scheduledTransferSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/scheduledtransfers-optimism`, BROKEN
  },
  42161: {
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/6ULAzMy7FSRdHngU9S725hr51tq9zqB5Q6LbRYHMSSuy`, //llamapay-arbitrum',
    chainProviders: new ethers.providers.FallbackProvider([
      new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/arbitrum'),
      new ethers.providers.StaticJsonRpcProvider('https://arb1.arbitrum.io/rpc'),
    ]),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_ARBITRUM,
    disperseAddress: CONTRACTS.DISPERSE_ARBITRUM,
    botAddress: CONTRACTS.BOT_ARBITRUM,
    blockExplorerURL: 'https://arbiscan.io/',
    blockExplorerName: 'Arbiscan',
    prefix: 'arbitrum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    tokenListId: 'arbitrum-one',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    paymentsContract: CONTRACTS.PAYMENTS_ARBITRUM,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/FqvRmJgUDxy2vgUHW3bGzCE1TdcydQGYoGDyDxe5R69C`,
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/J5Qy3zArdBEoqxMy6gKvWHzxgCbsoHTZYfZmoWMjvS7M`,
  },
  56: {
    rpcUrl: 'https://rpc.ankr.com/bsc',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/4e3YbwrXML1gFuRSmtqvt89N4APWjyfvkBA8pDDuYZAD`, //llamapay-bsc',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/bsc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_BSC,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_BSC,
    blockExplorerURL: 'https://www.bscscan.com/',
    blockExplorerName: 'BscScan',
    prefix: 'bsc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    tokenListId: 'binance-smart-chain',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
    paymentsContract: CONTRACTS.PAYMENTS_BSC,
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/GHqfBrZG3dYAE6zHimsJ8eAsodfMw44AotkYyaFCH1wY`,
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/6sUKbzqrzrH4LVpCMB5tV8vbTKR3MeBSqBe1ax3mQ22a`,
  },
  100: {
    rpcUrl: 'https://rpc.ankr.com/gnosis',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/6v1scbmkvnKQbGTT45aVTv1rKHQa9zPsm9iqwKb4Vcd7`, //llamapay-xdai',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/gnosis'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_XDAI,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: '',
    blockExplorerURL: 'https://blockscout.com/xdai/mainnet/',
    blockExplorerName: 'Blockscout',
    prefix: 'xdai',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
    tokenListId: 'xdai',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  82: {
    rpcUrl: 'https://rpc.meter.io',
    subgraphEndpoint: 'https://graph-meter.voltswap.finance/subgraphs/name/nemusonaneko/llamapay-subgraph',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.meter.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METER,
    disperseAddress: CONTRACTS.DISPERSE_METER,
    botAddress: '',
    blockExplorerURL: 'https://scan.meter.io/',
    blockExplorerName: 'Meter Blockchain Explorer',
    prefix: 'meter',
    logoURI: 'https://assets.coingecko.com/coins/images/11848/large/mtrg-logo.png?1595062273',
    tokenListId: 'meter',
  },
  /*
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/llamapay-goerli`,
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
    paymentsGraphApi: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/token-escrow-goerli',
    botSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/llamapay-bot-subgraph-goerli',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_GOERLI,
    scheduledTransferSubgraph: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/scheduledtransfers-subgraph',
  },
  */
  1088: {
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    subgraphEndpoint: 'https://andromeda-graph.metis.io/subgraphs/name/maia-dao/llama-pay',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://andromeda.metis.io/?owner=1088'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METIS,
    disperseAddress: CONTRACTS.DISPERSE_METIS,
    botAddress: '',
    blockExplorerURL: 'https://andromeda-explorer.metis.io/',
    blockExplorerName: 'Andromeda Metis Explorer',
    prefix: 'metis',
    tokenListId: 'metis-andromeda',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png',
  },
  2222: {
    rpcUrl: 'https://evm.kava.io',
    subgraphEndpoint: 'https://the-graph.kava.io/subgraphs/name/nemusonaneko/llamapay-subgraph/',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.kava.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_KAVA,
    disperseAddress: CONTRACTS.DISPERSE_KAVA,
    botAddress: '',
    blockExplorerURL: 'https://explorer.kava.io/',
    blockExplorerName: 'Kava Explorer',
    prefix: 'kava',
    tokenListId: 'kava-evm',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kava/info/logo.png',
  },
  42170: {
    rpcUrl: 'https://nova.arbitrum.io/rpc',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://nova.arbitrum.io/rpc'),
    blockExplorerURL: 'https://nova-explorer.arbitrum.io',
    blockExplorerName: 'Arbitrum Nova Chain Explorer',
    prefix: 'arbitrum_nova',
    tokenListId: 'arbitrum_nova',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_arbitrum-nova.jpg',
  },
  592: {
    rpcUrl: 'https://evm.astar.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.astar.network'),
    blockExplorerURL: 'https://astar.subscan.io',
    blockExplorerName: 'subscan',
    prefix: 'astar',
    tokenListId: 'astar',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_astar.jpg',
  },
  3776: {
    rpcUrl: 'https://rpc.startale.com/astar-zkevm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.startale.com/astar-zkevm'),
    blockExplorerURL: 'https://astar-zkevm.explorer.startale.com',
    blockExplorerName: 'Blockscout Astar zkEVM explorer',
    prefix: 'astar_zkevm',
    tokenListId: 'astar_zkevm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_astar-zkevm.jpg',
  },
  8453: {
    rpcUrl: 'https://mainnet.base.org',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/9LPDj38RmbDzyPaPWKSkxHPm9Bzv6oRCHJ2oMxr4LPaz`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.base.org'),
    blockExplorerURL: 'https://basescan.org',
    blockExplorerName: 'basescan',
    prefix: 'base',
    tokenListId: 'base',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  1313161554: {
    rpcUrl: 'https://aurora.drpc.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://aurora.drpc.org'),
    blockExplorerURL: 'https://aurorascan.dev',
    blockExplorerName: 'aurorascan.dev',
    prefix: 'aurora',
    tokenListId: 'aurora',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/info/logo.png',
  },
  81457: {
    rpcUrl: 'https://rpc.blast.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.blast.io'),
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/By6DNXZrFn1KPXzRuH9UtMDFCv5MRo97c56rhDZW9PYS`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    blockExplorerURL: 'https://blastscan.io',
    blockExplorerName: 'Blastscan',
    prefix: 'blast',
    tokenListId: 'blast',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_blast.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  7700: {
    rpcUrl: 'https://canto.slingshot.finance',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://canto.slingshot.finance'),
    blockExplorerURL: 'https://www.oklink.com/canto',
    blockExplorerName: 'Canto Explorer (OKLink)',
    prefix: 'canto',
    tokenListId: 'canto',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/nativecanto/info/logo.png',
  },
  42220: {
    rpcUrl: 'https://forno.celo.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://forno.celo.org'),
    blockExplorerURL: 'https://celoscan.io',
    blockExplorerName: 'Celoscan',
    prefix: 'celo',
    tokenListId: 'celo',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png',
  },
  25: {
    rpcUrl: 'https://evm.cronos.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.cronos.org'),
    blockExplorerURL: 'https://explorer.cronos.org',
    blockExplorerName: 'Cronos Explorer',
    prefix: 'cronos',
    tokenListId: 'cronos',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cronos/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  2000: {
    rpcUrl: 'https://rpc.dogechain.dog',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.dogechain.dog'),
    blockExplorerURL: 'https://explorer.dogechain.dog',
    blockExplorerName: 'dogechain explorer',
    prefix: 'dogechain',
    tokenListId: 'dogechain',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_dogechain.jpg',
  },
  9001: {
    rpcUrl: 'https://evmos.lava.build',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evmos.lava.build'),
    blockExplorerURL: 'https://escan.live',
    blockExplorerName: 'Evmos Explorer (Escan)',
    prefix: 'evmos',
    tokenListId: 'evmos',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/evmos/info/logo.png',
  },
  252: {
    rpcUrl: 'https://rpc.frax.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.frax.com'),
    subgraphEndpoint: `https://api.goldsky.com/api/public/project_clze000kutrlu01w16vdvdcrz/subgraphs/fraxtal-pay/1.0.0/gn`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    blockExplorerURL: 'https://fraxscan.com',
    blockExplorerName: 'fraxscan',
    prefix: 'fraxtal',
    tokenListId: 'fraxtal',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_fraxtal.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  1666600000: {
    rpcUrl: 'https://rpc.ankr.com/harmony',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/harmony'),
    blockExplorerURL: 'https://explorer.harmony.one',
    blockExplorerName: 'Harmony Block Explorer',
    prefix: 'harmony',
    tokenListId: 'harmony',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/harmony/info/logo.png',
  },
  321: {
    rpcUrl: 'https://rpc-mainnet.kcc.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc-mainnet.kcc.network'),
    blockExplorerURL: 'https://explorer.kcc.io/en',
    blockExplorerName: 'KCC Explorer',
    prefix: 'kcc',
    tokenListId: 'kcc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kcc/info/logo.png',
  },
  59144: {
    rpcUrl: 'https://rpc.linea.build',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.linea.build'),
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/By6DNXZrFn1KPXzRuH9UtMDFCv5MRo97c56rhDZW9PYS`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    blockExplorerURL: 'https://lineascan.build',
    blockExplorerName: 'Etherscan',
    prefix: 'linea',
    tokenListId: 'linea',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png',
  },
  169: {
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://pacific-rpc.manta.network/http'),
    blockExplorerURL: 'https://pacific-explorer.manta.network',
    blockExplorerName: 'manta-pacific Explorer',
    prefix: 'manta',
    tokenListId: 'manta',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/manta/info/logo.png',
  },
  5000: {
    rpcUrl: 'https://rpc.mantle.xyz',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.mantle.xyz'),
    blockExplorerURL: 'https://explorer.mantle.xyz',
    blockExplorerName: 'Mantle Explorer',
    prefix: 'mantle',
    tokenListId: 'mantle',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  1284: {
    rpcUrl: 'https://rpc.api.moonbeam.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.api.moonbeam.network'),
    blockExplorerURL: 'https://moonbeam.moonscan.io',
    blockExplorerName: 'moonscan',
    prefix: 'moonbeam',
    tokenListId: 'moonbeam',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonbeam/info/logo.png',
  },
  1285: {
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.api.moonriver.moonbeam.network'),
    blockExplorerURL: 'https://moonriver.moonscan.io',
    blockExplorerName: 'moonscan',
    prefix: 'moonriver',
    tokenListId: 'moonriver',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonriver/info/logo.png',
  },
  4200: {
    rpcUrl: 'https://rpc.merlinchain.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.merlinchain.io'),
    blockExplorerURL: 'https://scan.merlinchain.io',
    blockExplorerName: 'blockscout',
    prefix: 'merlin',
    tokenListId: 'merlin',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_merlin.jpg',
  },
  204: {
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://opbnb-mainnet-rpc.bnbchain.org'),
    blockExplorerURL: 'https://mainnet.opbnbscan.com',
    blockExplorerName: 'opbnbscan',
    prefix: 'opbnb',
    tokenListId: 'opbnb',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/opbnb/info/logo.png',
  },
  369: {
    rpcUrl: 'https://rpc.pulsechain.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.pulsechain.com'),
    blockExplorerURL: 'https://scan.pulsechain.com',
    blockExplorerName: 'blockscout',
    prefix: 'pulsechain',
    tokenListId: 'pulsechain',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_pulsechain.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0xcf61782465Ff973638143d6492B51A85986aB347',
  },
  534352: {
    rpcUrl: 'https://rpc.scroll.io',
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/8cXMpknAm6FRBrZHssLYGVy2q2qFPiVXujMD7YvJZ1SZ`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.scroll.io'),
    blockExplorerURL: 'https://scrollscan.com',
    blockExplorerName: 'Scrollscan',
    prefix: 'scroll',
    tokenListId: 'scroll',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png',
  },
  7777777: {
    rpcUrl: 'https://rpc.zora.energy',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.zora.energy'),
    blockExplorerURL: 'https://explorer.zora.energy',
    blockExplorerName: 'Zora Network Explorer',
    prefix: 'zora',
    tokenListId: 'zora',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_zora.webp',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  61: {
    rpcUrl: 'https://etc.etcdesktop.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://etc.etcdesktop.com'),
    blockExplorerURL: 'https://etc.blockscout.com',
    blockExplorerName: 'blockscout-ethereum-classic',
    prefix: 'ethclassic',
    tokenListId: 'ethclassic',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/classic/info/logo.png',
  },
  122: {
    rpcUrl: 'https://rpc.fuse.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.fuse.io'),
    blockExplorerURL: 'https://explorer.fuse.io',
    blockExplorerName: 'blockscout',
    prefix: 'fuse',
    tokenListId: 'fuse',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_fuse.jpg',
  },
  32659: {
    rpcUrl: 'https://mainnet.fusionnetwork.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.fusionnetwork.io'),
    blockExplorerURL: 'https://fsnscan.com',
    blockExplorerName: 'fsnscan',
    prefix: 'fusion',
    tokenListId: 'fusion',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fusion/info/logo.png',
  },
  8217: {
    rpcUrl: 'https://public-en-cypress.klaytn.net',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://public-en-cypress.klaytn.net'),
    blockExplorerURL: 'https://scope.klaytn.com',
    blockExplorerName: 'Klaytnscope',
    prefix: 'klaytn',
    tokenListId: 'klaytn',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/klaytn/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  34443: {
    rpcUrl: 'https://mainnet.mode.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.mode.network'),
    //subgraphEndpoint: `https://api.studio.thegraph.com/query/73158/llamapay-salaries-mode/version/latest`, // nobody is using it
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    blockExplorerURL: 'https://explorer.mode.network',
    blockExplorerName: 'modescout',
    prefix: 'mode',
    tokenListId: 'mode',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_mode.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },
  /*
  3109: {
    rpcUrl: 'https://alpha-rpc-node-http.svmscan.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://alpha-rpc-node-http.svmscan.io'),
    blockExplorerURL: 'https://svmscan.io/',
    blockExplorerName: 'Explorer',
    prefix: 'satoshivm',
    tokenListId: 'satoshivm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_satoshivm.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: '0x62E13BE78af77C86D38a027ae432F67d9EcD4c10',
  },*/
  40: {
    rpcUrl: 'https://mainnet.telos.net/evm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.telos.net/evm'),
    blockExplorerURL: 'https://teloscan.io',
    blockExplorerName: 'teloscan',
    prefix: 'telos',
    tokenListId: 'telos',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_telos.jpg',
  },
  1101: {
    rpcUrl: 'https://rpc.ankr.com/polygon_zkevm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/polygon_zkevm'),
    subgraphEndpoint: `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/3ehrSQYHWsy6b1ebN54fUUV5Kup2UqUXVup9tKRsTXGz`,
    llamapayFactoryAddress: NEW_LLAMAPAY_SALARIES_FACTORY_ADDRESS,
    blockExplorerURL: 'https://zkevm.polygonscan.com/',
    blockExplorerName: 'polygonscan',
    prefix: 'polygon_zkevm',
    tokenListId: 'polygon_zkevm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_polygon zkevm.jpg',
  },
  146: {
    rpcUrl: 'https://rpc.soniclabs.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.soniclabs.com'),
    subgraphEndpoint: `https://api.studio.thegraph.com/query/73158/llamapay-salaries-sonic/version/latest`, // production url not used because of "no allocations" error `https://gateway-arbitrum.network.thegraph.com/api/${apiKey}/subgraphs/id/6UHAK4JCA2X1auiM3HnCjss613Uo5kjLqskJCngtwhoe`,
    vestingFactory_v2: '0xB93427b83573C8F27a08A909045c3e809610411a',
    llamapayFactoryAddress: '0x09c39B8311e4B7c678cBDAD76556877ecD3aEa07',
    blockExplorerURL: 'https://sonicscan.org/',
    blockExplorerName: 'sonicscan',
    prefix: 'sonic',
    tokenListId: 'sonic',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_sonic.jpg',
  },
};
