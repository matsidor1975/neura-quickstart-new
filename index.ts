import {
    createMeeClient,
    DEFAULT_MEE_TESTNET_SPONSORSHIP_CHAIN_ID,
    DEFAULT_MEE_TESTNET_SPONSORSHIP_PAYMASTER_ACCOUNT,
    DEFAULT_MEE_TESTNET_SPONSORSHIP_TOKEN_ADDRESS,
    DEFAULT_STAGING_PATHFINDER_URL,
    toMultichainNexusAccount
} from "@biconomy/abstractjs";
import { createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { neuraTestnet } from "./neuraTestnet";

async function main() {
    /**
     * Creates an MEE client loaded with the EOA account
     */
    const privateKey = generatePrivateKey();
    
    const signer = createWalletClient({
        chain: neuraTestnet, // loads Neura Testnet chain config
        transport: http(),
        account: privateKeyToAccount(privateKey)
    });
    
    const smartAccount = await toMultichainNexusAccount({
        signer: signer.account,
        chains: [neuraTestnet],
        factoryAddress: "0x0000006648ED9B2B842552BE63Af870bC74af837",
        implementationAddress: "0x00000000383e8cBe298514674Ea60Ee1d1de50ac",
        bootStrapAddress: "0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3",
        transports: [http()]
    });
    
    const meeClient = await createMeeClient({
        account: smartAccount,
        url: DEFAULT_STAGING_PATHFINDER_URL, // connect to staging environment for testnet access
        apiKey: "mee_3Zmc7H6Pbd5wUfUGu27aGzdf", // default staging api key (rate limited)
    });

    /**
     * Builds a dummy instruction that does nothing
     */
    const dummyInstruction = await smartAccount.build({
        type: "default",
        data: {
            calls: [{
                to: "0x0000000000000000000000000000000000000000",
                value: BigInt(0),
                data: "0x",
                gasLimit: 20000n,
            }],
            chainId: 267
        },
    });

    /**
     * Executes the dummy instruction with MEE client.
     * Result will contain the MEE hash which can be used to get the receipt on MEE scan:
     * https://meescan.biconomy.io/
     */
    const result = await meeClient.execute({
        instructions: [dummyInstruction],
        sponsorship: true,
        sponsorshipOptions: {
            url: DEFAULT_STAGING_PATHFINDER_URL,
            gasTank: {
                address: DEFAULT_MEE_TESTNET_SPONSORSHIP_PAYMASTER_ACCOUNT,
                token: DEFAULT_MEE_TESTNET_SPONSORSHIP_TOKEN_ADDRESS,
                chainId: DEFAULT_MEE_TESTNET_SPONSORSHIP_CHAIN_ID
            }
        },
    });
    console.log(result);
}

main().then(console.log).catch(console.log);
