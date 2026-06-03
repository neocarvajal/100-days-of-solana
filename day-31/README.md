# Explore advanced token incentive design

```
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --transfer-fee-basis-points 100 --transfer-fee-maximum-fee 5000
```

## My token

```
Address:  B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV
Decimals:  9
```

```
Signature: P6JHVrqraEATSrBqLjLcmGjiCHJCwNFpQXREf7SRUNGBZTUpgqPxi6AhMxtXLbD3qR8GFgdMKHAdYiqXy2hZjTN
```

## Create ATA

```
spl-token create-account B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV
Creating account AhQwmQdUzeJWEXFbJvb698kD3oZLrgHVqLadsojer9X4
```

Result: 

```
Account AhQwmQdUzeJWEXFbJvb698kD3oZLrgHVqLadsojer9X4

Signature: 2tUSeR7ZbkrM9iDxVJWH1VL4psh3Kx66uNZyxiKQnidqCuxmf8dpRGZaPfD8MYRcffb5byCcEzd2nUKBc79sXMdy
```

Mint 1000: 

```
spl-token mint B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV 1000
```

Result:

```
Minting 1000 tokens
  Token: B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV
  Recipient: AhQwmQdUzeJWEXFbJvb698kD3oZLrgHVqLadsojer9X4
```

```
Signature: 3rQoQqYYmXdbj7nzEjF7x8kAiteMn12zPpvRHnMnPDxxP5bpMQakfCGuE2yhmCTapAjCQtCSFrRX1wQcZqBgjALq
```

## Create ATA in second wallet
```
spl-token create-account B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV --owner $(solana-keygen pubkey ~/.config/solana/id_back.json) --fee-payer ~/.config/solana/id.json
```
Result:

```
Creating account 4P6RNrte2sHqGumrQQheoBSjDWE6YdCx7sg6oMwshLcj

Signature: 5CbDiZprkR186zCfKHRccmY3np242jLzmWM7qYjG4BYFpU2zqCaMfVaJBzNGpvcPiTvGjbY4ctEyz8pnd3egAsxR
```

## Transfer 100 tokens to Recipient 2 address pubkey

spl-token transfer B5MrCQxcBhqcL6mR8gverDLbJDhLoWAgTn5QYoxnBSpV 100 $(solana-keygen pubkey ~/.config/solana/id_back.json) --expected-fee 1

Result:

```
Transfer 100 tokens
  Sender: AhQwmQdUzeJWEXFbJvb698kD3oZLrgHVqLadsojer9X4
  Recipient: 8PGCeFVR79qBzqEc2vTDTJx3TaJ9jhYe7AhrtJkwdVrv
  Recipient associated token account: 4P6RNrte2sHqGumrQQheoBSjDWE6YdCx7sg6oMwshLcj

Signature: KUQWiwftw9gNdpktktptLXA3uDCv4Qh9nFVWUiZ6vHXnZnXGvRWYNSe2n9vcDg3TtmkfNrLsR3F2FgHHfPjRjRP
```
## Withdraw the withheld fees

```
spl-token withdraw-withheld-tokens AhQwmQdUzeJWEXFbJvb698kD3oZLrgHVqLadsojer9X4 4P6RNrte2sHqGumrQQheoBSjDWE6YdCx7sg6oMwshLcj
```

Result:

```
Signature: 4e1EiTei7pwZaQf2fuhNzyRbn72i7ajP9ijoFdmcEYGtkR6VyAb9DbwnUZauKdJAA7yvQFHuWLdjF1QPMfmRTvqZ
```

## 

![Balance Token Account](final-balance.png)





