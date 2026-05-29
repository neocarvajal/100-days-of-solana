import { createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const targetAddress = address("8H8nCS6JUhKNJRHbC2fmr6ofHRLsYCapqVmb5CJJ6VE6");

const { value: balanceInLamports } = await rpc.getBalance(targetAddress).send();

const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

console.log(`Address: ${targetAddress}`);
console.log(`Balance: ${balanceInSol}`);