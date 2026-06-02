## Send your first SOL transfer

### Check Config
solana config set -ud 

### Create new wallet
solana-keygen new --outfile recipient-keypair.json --no-bip39-passphrase

### New wallet created
6VdyT4S189GEN2Fzwb4akiDUSLLVwk6f9QF44dgkmYUM

### Send native tokens to new wallet
solana transfer 6VdyT4S189GEN2Fzwb4akiDUSLLVwk6f9QF44dgkmYUM 0.5 --allow-unfunded-recipient

### Transaction
Signature: 3XCto7DDmkRqktEku7Lqdg7PjQrYEk6MogATQQ3tejVZZ1o13tSddXrHBf9LUvXm4JjAEXbQzNixPp4mPLzNpjTt

### Check balance
solana balance

![explorer](explorer-solana-transaction.png)