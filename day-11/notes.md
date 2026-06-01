# Compare accounts vs databases\

## Step 1: Inspect your own wallet account

## Every wallet on Solana is an account. Let’s look at yours. Run the following command to get your wallet’s public key:

```
solana address
```

## Now inspect that account:

```
solana account $(solana address)
```

## Inspect a program account

Now look at something executable. The Token Program manages all SPL tokens on Solana. Inspect it:

```
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
```

## Build your comparison table

https://dev.to/neocarvajal/comparing-databases-vs-solana-accounts-2le7

## Check the rent-exempt cost for a data account

In a database, storage costs are part of your hosting bill. On Solana, storage costs are explicit: you deposit lamports proportional to the size of the data you want to store. This deposit is fully refundable when you close the account.

Check how much it costs to store different amounts of data:

```
solana rent 0
solana rent 100
solana rent 1000
```

## View an account on the explorer

Open Solana Explorer in your browser and paste in your wallet address. You will see the same information the CLI showed you, but in a visual interface. Click around, look at the transaction history, and notice how every interaction is a transaction that modifies account state.

Now imagine doing the same with a traditional database. You would need admin access, a database client, and permission from whoever runs the server. On Solana, every account is publicly readable by anyone, anywhere, at any time. That is a fundamental difference in how data transparency works.

Run It

```
solana config set --url https://api.devnet.solana.com
solana airdrop 2
solana account $(solana address)
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
solana rent 0
solana rent 100
solana rent 1000
```