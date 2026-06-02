import { 
  generateKeyPairSigner,
  createSolanaRpc,
  devnet,
  address,
} from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
// const wallet = await generateKeyPairSigner();
const wallet = address("83XKs2X9t2nXbdzFY3rvkEGevdHRT6V6rYCSUqvcWK6n");
console.log("Wallet address: ", wallet);

const { value: balance } = await rpc.getBalance(wallet).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`Balance: ${balanceInSol} SOL`);