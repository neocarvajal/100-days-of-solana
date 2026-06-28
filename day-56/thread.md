I spent the last few days exploring Solana's Token-2022 extensions... #100DaysOfSolana

I built three different tokens:

💸 One charges transfer fees
📈 One earns interest
🔒 One can't be transferred at all
The best part? 

No custom program required.

🧵👇

---

1/ 💸 Transfer Fee Extension

A token that automatically collects a fee on every transfer.

spl-token create-token \
  --transfer-fee-basis-points 100
The fee is enforced by the Token-2022 program itself—not by your frontend or backend.

Perfect for DAO treasuries, royalties...

---

2/ 📈 Interest-Bearing Extension

This was the most surprising one.

spl-token create-token \
  --interest-rate 5000

It doesn't mint new tokens.

Instead, the mint stores an interest configuration and wallets calculate the displayed balance over time.

---

3/ 🔒 Non-Transferable Extension

Sometimes a token shouldn't behave like money.

spl-token create-token \
  --enable-non-transferable
When I tried transferring it...

❌ "Transfer is disabled for this mint"

Perfect for credentials, memberships and identity.

---

4/ My biggest takeaway:

Before this challenge I assumed features like fees or transfer restrictions required custom smart contracts.

Token-2022 already provides many of them as composable mint extensions.

It feels like middleware built directly into the protocol.


---

5/ I documented the complete walkthrough with:

✅ CLI commands
✅ Explorer screenshots
✅ On-chain behavior
✅ Real use cases
✅ What I learned building each mint

📖 Read the full article:
👉 https://dev.to/neocarvajal/three-token-2022-mints-in-one-week-fees-yield-and-soul-bound-tokens-j4j

---

Have you experimented with Memo Transfer or Confidential Transfers yet?