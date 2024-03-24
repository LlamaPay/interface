const rawChains=
`arbitrum_nova https://nova.arbitrum.io/rpc 42170
astar https://evm.astar.network 592
astar_zkevm https://rpc.startale.com/astar-zkevm 3776
base https://mainnet.base.org 8453
aurora https://aurora.drpc.org 1313161554
blast https://rpc.blast.io 81457
canto https://canto.slingshot.finance 7700
celo https://forno.celo.org 42220
cronos https://evm.cronos.org 25
dogechain https://rpc.dogechain.dog 2000
evmos https://evmos.lava.build 9001
fraxtal https://rpc.frax.com 252
harmony https://rpc.ankr.com/harmony 1666600000
kava https://evm.kava.io 2222
kcc https://rpc-mainnet.kcc.network 321
linea https://rpc.linea.build 59144
manta https://pacific-rpc.manta.network/http 169
mantle https://rpc.mantle.xyz 5000
moonbeam https://rpc.api.moonbeam.network 1284
moonriver https://rpc.api.moonriver.moonbeam.network 1285
merlin https://rpc.merlinchain.io 4200
opbnb https://opbnb-mainnet-rpc.bnbchain.org 204
pulsechain https://rpc.pulsechain.com 369
scroll https://rpc.scroll.io 534352
zora https://rpc.zora.energy 7777777
ethclassic https://etc.etcdesktop.com 61
fuse https://rpc.fuse.io 122
fusion https://mainnet.fusionnetwork.io 32659
klaytn https://public-en-cypress.klaytn.net 8217
mode https://mainnet.mode.network 34443
satoshivm https://alpha-rpc-node-http.svmscan.io 3109
telos https://mainnet.telos.net/evm 40`

async function main(){
    const data:any[] = await fetch(`https://chainid.network/chains.json`).then(r=>r.json())
    rawChains.split(`\n`).map(c=>{
        const [name, url, id] = c.split(" ")
        let extra = data.find(cc=>cc.chainId == id)
        if(extra === undefined){
            console.log("error", name)
            extra = {explorers:[{}]}
        }
        const {explorers} = extra
        console.log(
`${id}: {
    rpcUrl: '${url}',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('${url}'),
    blockExplorerURL: '${explorers[0].url}',
    blockExplorerName: '${explorers[0].name}',
    prefix: '${name}',
    tokenListId: '${name}',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${name}/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
},`)
    })
}
main()
// bun cli/generateChains.ts