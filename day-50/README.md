# Create a fee-bearing token with Token-2022

Create the fee-bearing mint. The long string after --program-id is the on chain address of the Token-2022 program:

```javascript
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 1000000 \
  --decimals 6
```

```
Result: YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
```

Save the mint address that gets printed. Then create a token account for it and mint yourself a starting supply of 1,000 tokens:

```javascript
spl-token create-account $YOUR_MINT_ADDRESS
```

```
Result: 
SPL TOKEN ACCOUNT CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb
2F7Tqnh7CQU28KeZCm1PApCeeeKjvFemHqN6nGfLAeyTPdrrjRXC9Fe9ePVbuE2HYB24heNBnMeccxcx7SP8Lpqc
```

```javascript
spl-token mint $YOUR_MINT_ADDRESS 1000
```

```
Minting 1000 tokens
  Token: YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
  Recipient: CMSDrjHZedwEfhwGTgAqhPZCUrE79pnKRBaZBF8ZY7Jb

Signature: 2a5XYhQpSry73QUuuTT4iqkhntgnH3jvjhGEHYC1RAgHuGA9jawWCGzxC6unbjDKqGMxQT4ZQT3xKfxk8Wjc7T6W
```

Now ask the chain to describe your mint:

```javascript
spl-token display $YOUR_MINT_ADDRESS
```

```
Result:

SPL Token Mint
  Address: YwkdCKSVccVGBzVFJWAf1USvYsc6LtbHz1VVUgKtAwY
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000
  Decimals: 6
  Mint authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  Freeze authority: (not set)
Extensions
  Transfer fees:
    Current fee: 100bps
    Current maximum: 1000000000000
    Config authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Withdrawal authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Withheld fees: 0
```


