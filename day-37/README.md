# Build a Multi-Extension Token


## Create the multi-extension mint

spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  create-token \
  --decimals 2 \
  --transfer-fee-basis-points 100 \
  --transfer-fee-maximum-fee 500 \
  --interest-rate 5 \
  --enable-metadata

Result:

```
Address:  H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg
Decimals:  2
```

## Add metadata to the mint

spl-token initialize-metadata \
  H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg \
  "ArcCoin" \
  "ARC" \
  "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json"

Result:

```
Signature: 5QMUMquNo6QYVRfQS1VNKk9eWxgWaQYsD6hZNWZXM6rrPgjSZvcprRZcTaLTbNEkz2dnWCnU4vgqJFzwviZtfToP
```

## Inspect the mint

spl-token display H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg

Result: 

```
SPL Token Mint
  Address: H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 2
  Mint authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 5bps
    Average rate: 5bps
    Rate authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  Transfer fees:
    Current fee: 100bps
    Current maximum: 50000
    Config authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Withdrawal authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Withheld fees: 0
  Metadata Pointer:
    Authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Metadata address: H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg
  Metadata:
    Update Authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Mint: H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg
    Name: ArcCoin
    Symbol: ARC
    URI: https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```
## Create a token account and mint tokens

spl-token create-account H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg

Result:

```
Creating account HQFbsUTMXWs8xLWF7dn4s6u6wC4AirBiP8uAtMkEaJt6

Signature: 4n2gYPQNYa2SLEJDRaujcrXFm32eCF4koXvfvPtvsctFhJt6UsiTQ2jLuVbUgaUJkzuruuaY33WnM4nteCobUZQ2
```

spl-token mint H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg 1000

Result:

```
Minting 1000 tokens
  Token: H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg
  Recipient: HQFbsUTMXWs8xLWF7dn4s6u6wC4AirBiP8uAtMkEaJt6

Signature: 2Z6ymvsuB1wGLCExsoWF4Xxo6iCwEuKQXXLumwSXzEfTdrb77j73bWQ9kWsafQExX2xuMAG7VB2BGaU6qEMhtKw9
```

## Create token account and transfer tokens to second wallet

spl-token create-account H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg --owner ~/.config/solana/id_back.json --fee-payer ~/.config/solana/id.json

Result:

```
Creating account JA6cZ8ikzVhb89i4TMWDED1p4vmghTePJMSz8KAfEmjM

Signature: 4GUMQefQ1oSm95r5JCYPM7aHx7uNjZFTAhB2rJnsstVHtKEnEhpCzSKPPrQmUNrzeM6spiwZvwrYiuHXVSXujRNN
```

spl-token transfer H7cQs1iaiXnEwkWG1ie1UMhtPQuZN6aZM1V2FhLDdDLg 100 ~/.config/solana/id_back.json --expected-fee 1 --allow-unfunded-recipient

Result:

```
Transfer 100 tokens
  Sender: HQFbsUTMXWs8xLWF7dn4s6u6wC4AirBiP8uAtMkEaJt6
  Recipient: 8PGCeFVR79qBzqEc2vTDTJx3TaJ9jhYe7AhrtJkwdVrv
  Recipient associated token account: JA6cZ8ikzVhb89i4TMWDED1p4vmghTePJMSz8KAfEmjM

Signature: 265oiTL8Xqi4KH31y8bZLBgEnUPeD3v3LVqLpjHNC6rbxmCfp431S5uw59HcFDgSpCp3KRLFDsRsiUubwujSmWZ7
```

## Harvest the withheld fees

spl-token withdraw-withheld-tokens HQFbsUTMXWs8xLWF7dn4s6u6wC4AirBiP8uAtMkEaJt6 JA6cZ8ikzVhb89i4TMWDED1p4vmghTePJMSz8KAfEmjM

Result:

```
Signature: 4xLXfP2bVvcvpJM2XUDw4F1fZg8UrS8xvNk1frekKCGrRqwALbufHHfrVzKoGCJVeCwfUuvidw7rBZ82gHoRTK42
```