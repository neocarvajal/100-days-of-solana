import { createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const targetAddress = address("8H8nCS6JUhKNJRHbC2fmr6ofHRLsYCapqVmb5CJJ6VE6");

const signatures = await rpc.getSignaturesForAddress(targetAddress, { limit: 5 }).send();

console.log(`\n Last 5 transactions for ${targetAddress}: \n`);

for (const tx of signatures) {
    const time = tx.blockTime
    ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
    : "unknow";

    console.log(`Signature : ${tx.signature}`);
    console.log(`Slot      : ${tx.slot}`);
    console.log(`Time      : ${time}`);
    console.log(`Status    : ${tx.err ? "Failed" : "Success"}`);
    console.log("---");
}

