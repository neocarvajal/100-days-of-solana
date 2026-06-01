# Explore failed transactions

## 1. Create a broke wallet

Generate a fresh keypair with zero SOL balance. This wallet has never received an airdrop, so it can’t pay for anything.

```
solana-keygen new --outfile /tmp/broke-wallet.json --no-bip39-passphrase --force
```

## 2. Try to send SOL from an empty wallet

Attempt a transfer using your broke wallet as the fee payer. This will fail because the wallet has no SOL to cover the fee. The CLI catches this locally before the transaction reaches the network.

```
solana transfer --keypair /tmp/broke-wallet.json $(solana address) 1 --url devnet --allow-unfunded-recipient
```

You should see an error in the output. Note the error message carefully.

## 3. Try to send more SOL than you have

Switch back to your funded devnet wallet. Make sure it has some SOL (airdrop if needed), then try to send far more than your balance.

```
solana airdrop 1 --url devnet
solana transfer $(solana-keygen pubkey /tmp/broke-wallet.json) 500 --url devnet --allow-unfunded-recipient
```

Your wallet can pay the fee but not the 500 SOL transfer. The CLI shows the same “insufficient funds” error as step 2 because its local check lumps both cases together. Step 4 bypasses that check to show the on-chain difference.

> Note: The devnet airdrop can sometimes fail due to rate limiting. If this happens use the web faucet instead.

## 4. Capture a failed transaction signature

Some failures happen before the transaction ever reaches the network (the CLI catches them locally). To get a failed transaction that actually lands on-chain, you need to skip preflight simulation. The CLI’s --skip-preflight flag is unreliable for this, so you’ll use a small script in your Day 18 project instead.

Navigate to your Day 18 project.

Create a new file force-fail.mjs with the code in this gist.

Run it:

```
node force-fail.mjs
Copy the signature from the output.
```

## 5. Inspect the failure with the CLI

Use solana confirm -v to get a detailed breakdown of the failed transaction.

```
solana confirm -v 4guFrUJMYCjKrPaaEGyYHnbAH1yMgmuyEbHK9phWtE8NjsoXQXxCHpXGfK7j3mKbpvUS2UY62vaJikUwm8oqLsGU --url devnet
```

Study the output. You’ll see:

Status: an error message describing what went wrong
Fee: the transaction fee that was still charged (yes, failed transactions cost fees)
Compute Units Consumed: how much compute was used before the failure
Log Messages: a step-by-step trace from the program that processed the transaction
Account balances (before and after): notice the fee payer’s balance dropped by the fee amount, even though the transfer didn’t go through
6. View the failure on Solana Explorer

Open your browser and navigate to:

```
https://explorer.solana.com/tx/4guFrUJMYCjKrPaaEGyYHnbAH1yMgmuyEbHK9phWtE8NjsoXQXxCHpXGfK7j3mKbpvUS2UY62vaJikUwm8oqLsGU?cluster=devnet
```

The Explorer displays the same information in a visual format: the error, the program logs, the accounts involved, and the balance changes. Compare this view with the CLI output. Notice how the Explorer highlights the failing instruction in red and shows exactly which program returned the error.

## 7. Stream logs in real time

Open a second terminal and start streaming all transaction logs for your wallet:

```
solana logs --url devnet
```

Now go back to your first terminal and trigger another failed transfer. Watch the logs appear in real time in your second terminal. This is similar to tailing server logs while hitting an API endpoint: you see each program invocation, each log line, and the final error as it happens.

