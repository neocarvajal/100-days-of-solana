# Send your fee-bearing token and harvest the withheld fees

Export the mint address from yesterday into a shell variable so the next commands stay readable. Replace the placeholder with your actual mint address:

```javascript
MINT=YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
```

Mint a fresh batch of supply to your own wallet so you have something to send. The number is a UI amount, so this mints one million whole tokens:

```javascript
spl-token mint $MINT 1000000
```

```
Result:

Minting 1000000 tokens
  Token: YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
  Recipient: CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb

Signature: cV3oaLK1p4kJTboXRxvstNLLehiXutCgpWXWMtuikm2ubKiwzbiyXNJKewXoNf2yLmYv8LbkTW21tjweyPss6vX
```
Generate a brand new keypair to act as your recipient. This wallet is throwaway and lives only on your machine:

```javascript
RECIPIENT=$(solana address -k recipient.json)
```

Create the recipient’s associated token account for this mint up front. The recipient’s throwaway wallet has no SOL, so you pay the rent yourself with --fee-payer. Creating the account explicitly means you can see exactly which address holds the tokens before any transfer happens:

```javascript
spl-token create-account $MINT \
  --owner $RECIPIENT \
  --fee-payer ~/.config/solana/id.json
```

```
Result:

Creating account HdCJd1di5fpW6yrN5p35MNEEmNgquLRMzNVzP8g64wNL

Signature: oMmRwZexpwVrPqzSTYthe2gLTUDbvw9P7yAb4rz71YaytquCdHAGuVuZG97qQktmWy1hZDwt8YL6hvAuPjgsaFw
```

Transfer 1000 tokens to the recipient. The --expected-fee flag tells the runtime exactly how much fee you expect to be withheld and aborts the transfer if the math does not match. Yesterday’s mint charges 100 basis points (1 percent), so the fee on 1000 tokens is 10 tokens. Set the expected fee accordingly. If you used different basis points yesterday, recalculate the fee as amount * basisPoints / 10000. There is no --fund-recipient flag here on purpose: the CLI cannot create an account on the fly for a mint that charges a transfer fee, which is exactly why you created the recipient’s account explicitly in the previous step. The recipient wallet holds no SOL, so --allow-unfunded-recipient lets the transfer proceed to the account you already created:

```javascript
spl-token transfer \
  --expected-fee 10 \
  $MINT 1000 $RECIPIENT \
  --allow-unfunded-recipient
```

```
Result:

Transfer 1000 tokens
  Sender: CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb
  Recipient: 8PGCeFVR79qBzqEc2vTDTJx3TaJ9jhYe7AhrtJkwdVrv
  Recipient associated token account: HdCJd1di5fpW6yrN5p35MNEEmNgquLRMzNVzP8g64wNL

Signature: 2AyncDvPniyBQNwoujxnQvutWLSNFc6JRoqpvyDqCYbbdY8x7vJHdFkq4cVikEzFLSHojUhHs3ufiUfhnUJczy1u
```

Find the recipient’s token account address so you can inspect it:

```javascript
spl-token accounts --owner $RECIPIENT --verbose
```

Copy the token account address from the output and save it:

```javascript
RECIPIENT_TA=HdCJd1di5fpW6yrN5p35MNEEmNgquLRMzNVzP8g64wNL
```

Read the recipient’s token account directly on chain. Look for the TransferFeeAmount extension and the withheld_amount field. That is the slice the protocol kept for you, sitting on the recipient’s account, untouchable by the recipient:

```javascript
spl-token display $RECIPIENT_TA
```

```
Result:

SPL Token Account
  Address: HdCJd1di5fpW6yrN5p35MNEEmNgquLRMzNVzP8g64wNL
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Balance: 990
  Decimals: 6
  Mint: YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
  Owner: 8PGCeFVR79qBzqEc2vTDTJx3TaJ9jhYe7AhrtJkwdVrv
  State: Initialized
  Delegation: (not set)
  Close authority: (not set)
Extensions:
  Immutable owner
  Transfer fees withheld: 10000000
```

Find your own associated token account for this mint so you have somewhere to withdraw the fees back into. Scoping to $MINT keeps the output to just this token instead of every account your default wallet owns:

```javascript
spl-token accounts $MINT --verbose
```

```
Result:

Program                                       Account                                       Delegated  Close Authority  Balance
-------------------------------------------------------------------------------------------------------------------------------
TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb   CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb                              1000000
```

Save your token account address for this mint:

```javascript
MY_TA=CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb
```

Withdraw the withheld fees from the recipient’s account into your own token account. This call uses the withdraw authority you set yesterday, which by default is your wallet:

```javascript
spl-token withdraw-withheld-tokens $MY_TA $RECIPIENT_TA
```

```
Result Signature: NNRDgstokty32bycBxtqGtiqYVVuw4SrTSU5kKSpVGYucwN9sQmgKypR3LzCw1uT8wTyCmbyiDzgwnSruvswx5n
```


