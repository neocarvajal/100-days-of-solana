# Design a Revocable Credential Token with Non-Transferable and Permanent Delegate Extensions

## Create a non-transferable token with a permanent delegate and metadata

spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token \
  --decimals 0 \
  --enable-non-transferable \
  --enable-permanent-delegate \
  --enable-metadata

Result:

```
Address:  nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
Decimals:  0

Signature: 3pKwDHc4h34u7yr3Tkvw3TtvzT2GYY23ZYCAk5pX39wCNdmr7gkBAds1jtFcUahHmNAZxJxxDRex5PHcNsXy11bS
```

## Initialize the token metadata

spl-token initialize-metadata $MINT_ADDRESS \
  "Solana Dev Credential" \
  "CRED" \
  "https://gist.githubusercontent.com/neocarvajal/562ddc18d557f8e67efd1cc82fb8aa85/raw/8f673762f02f3dd460a558858b25d95917af2823/credtoken.json"

Result:

```
Signature: 2nWNMVospMqAaHykCyn9TXiRNutAetCxYd88eKfUGvKPHMxpT9F5sku6PseE5TdkEYpi8eKWUCiQopv6xbNmFQjt
```

## Create a token account for the recipient and mint one credential

spl-token create-account $MINT_ADDRESS --owner $RECIPIENT \
  --fee-payer ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result Second Wallet ATA:

```
Creating account HJr71fzMXSipPy38tB1vTXd3LycYbrAjysXdCoF6ccGA

Signature: 2Mrx2X1HjhS3V4BBYafq9b3rvZHLCSYuL3UMhxnq5UAwRDFvtvYiyGLrmia1ugq1VYqrSbwmX7QwgjpndAvtUDxQ
```


spl-token mint $MINT_ADDRESS 1 --recipient-owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result mint:

```
Minting 1 tokens
  Token: nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
  Recipient: HJr71fzMXSipPy38tB1vTXd3LycYbrAjysXdCoF6ccGA

Signature: 3chZs3Er2SwfKvQ7UdrdG2vCHh4SterCRrrJcd5Gj3UbNKAs3NV51W7Lfg6PWS7fpMhdqthz1oopZuv56GJ7BNnJ
```

## Verify the token cannot be transferred

solana-keygen new --outfile third-party.json --no-bip39-passphrase --force

THIRD_PARTY=$(solana-keygen pubkey third-party.json)

spl-token transfer $MINT_ADDRESS 1 $THIRD_PARTY \
  --owner ~/.config/solana/id_back.json \
  --fee-payer ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --fund-recipient --allow-unfunded-recipient

Result: ``` Transfer is disabled for this mint ```

## Revoke the credential using the permanent delegate

spl-token burn HJr71fzMXSipPy38tB1vTXd3LycYbrAjysXdCoF6ccGA 1 --owner ~/.config/solana/id.json \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result:

```
Burn 1 tokens
  Source: HJr71fzMXSipPy38tB1vTXd3LycYbrAjysXdCoF6ccGA

Signature: h9vyRE9WDtwBEGvfpYoPvDJvwajZvjRyJr9MEyhT8GfrSzP3bgQ3SanBkjF2uRz2FuFiuEFJYJ4cLERRTcxU9g4
```

spl-token balance $MINT_ADDRESS --owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result: ``` 0 ```

## Inspect the mint to confirm all extensions are present

spl-token display $MINT_ADDRESS \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result:

```
SPL Token Mint
  Address: nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 0
  Decimals: 0
  Mint authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  Freeze authority: (not set)
Extensions
  Permanent delegate: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  Non-transferable
  Metadata Pointer:
    Authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Metadata address: nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
  Metadata:
    Update Authority: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
    Mint: nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
    Name: Solana Dev Credential
    Symbol: CRED
    URI: https://gist.githubusercontent.com/neocarvajal/562ddc18d557f8e67efd1cc82fb8aa85/raw/8f673762f02f3dd460a558858b25d95917af2823/credtoken.json
```

## Bonus experiment

### Mint a second credential to the same recipient and then burn only one. Does the balance update correctly?
## Response is Yes

spl-token mint $MINT_ADDRESS 1 --recipient-owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result: 

```
Minting 1 tokens
  Token: nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
  Recipient: HJr71fzMXSipPy38tB1vTXd3LycYbrAjysXdCoF6ccGA
```

spl-token balance $MINT_ADDRESS --owner $RECIPIENT \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

Result: `` 1 ``

### Attempt to use spl-token authorize to change the permanent delegate. What happens? Can it be reassigned?
### Response is yes the new mint authority is RECIPIENT Account

spl-token authorize nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu mint $RECIPIENT

Result:

```
Updating nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu
  Current mint: G6xvDZBSHVW5ZvsAekotkFW7rbhTX8wi1t7CakV5cbYz
  New mint: 8PGCeFVR79qBzqEc2vTDTJx3TaJ9jhYe7AhrtJkwdVrv

Signature: 2wgyr7JFLqzwHMKu8p7KTjRmFPxsQM6iEDRzrxYJuMDGiu6yaWjom6y7b31y2E4JnfQTN5d1gKcY7d3rbonavMrm

```

## Add a custom metadata field using spl-token update-metadata to store an “issued_date” or “expiry_date” value on the mint

spl-token update-metadata nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu "issued_date" "2026-06-04"

Result:

```
Signature: 2DfPX5DhEUNpA3UnqFrL9YboCRvwQMPPA2ZqrmxuKCiRyLZVhZG9cCpgLMUuiJLndpm6nXwVhVo46agDzW3acziw
```

spl-token update-metadata nqd8t98e1XzTdyHXbgoP5mMLAar3WZvAjSmjkBDazAu "expiry_date" "2027-06-04"

Result:

```
Signature: pDb9DtfKZKrJprhwedKW7B8QminYYLgJZc8h69UoYwsRZwULVzb4yhbYZ9r34R3KJrKjEhmNWaYKRDTwVqLh3ZJ
```