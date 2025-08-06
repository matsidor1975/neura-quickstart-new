export const neuraTestnet = {
    id: 267,
    name: "Neura Testnet",
    nativeCurrency: {
        name: "NEURA",
        symbol: "NEURA",
        decimals: 18,
    },
    rpcUrls: {
        default: {
        http: ["https://testnet.rpc.neuraprotocol.io"],
        },
    },
    blockExplorers: {
        default: {
        name: "Blockscout",
        url: "https://testnet-blockscout.infra.neuraprotocol.io/",
        },
    },
    testnet: true,
};
