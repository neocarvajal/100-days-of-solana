import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";

import {
	address,
	createKeyPairSignerFromBytes,
	createSolanaRpc,
	devnet,
	pipe,
	createTransactionMessage,
	setTransactionMessageFeePayerSigner,
	setTransactionMessageLifetimeUsingBlockhash,
	appendTransactionMessageInstruction,
	signTransactionMessageWithSigners,
	getSignatureFromTransaction,
	getBase64EncodedWireTransaction,
	lamports,
} from "@solana/kit";

import { getTransferSolInstruction } from "@solana-program/system";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const RPC_URL = devnet("https://api.devnet.solana.com");

const LAMPORTS_PER_SOL = 1_000_000_000n;

const COMMITMENT_LEVELS = [
	"processed",
	"confirmed",
	"finalized",
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function loadKeypair() {
	const keypairPath = resolve(
		homedir(),
		".config",
		"solana",
		"id.json"
	);

	const secretKeyJson = await readFile(keypairPath,"utf-8");

	const secretKeyBytes = new Uint8Array(JSON.parse(secretKeyJson));

	return createKeyPairSignerFromBytes(secretKeyBytes);
}

function sleep(ms) {
	return new Promise((resolve) =>
		setTimeout(resolve, ms)
	);
}

async function waitForCommitment(rpc, signature, targetCommitment) {
	const targetIndex =
		COMMITMENT_LEVELS.indexOf(
			targetCommitment
		);

	while (true) {
		const { value } = await rpc
			.getSignatureStatuses(
				[signature],
				{
					searchTransactionHistory: true,
				}
			)
			.send();

		const status = value[0];

		if (status?.err) {
			throw new Error(
				`Transaction failed: ${JSON.stringify(
					status.err
				)}`
			);
		}

		if (status) {
			const currentIndex =
				COMMITMENT_LEVELS.indexOf(
					status.confirmationStatus
				);

			if (currentIndex >= targetIndex) {
				return status;
			}
		}

		await sleep(500);
	}
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.error("Usage: node anatomy-of-a-transaction.mjs <RECIPIENT> <AMOUNT_IN_SOL>");
		process.exit(1);
	}

	const recipientAddress = address(args[0]);

	const amountInSol = parseFloat(args[1]);

	if (
		isNaN(amountInSol) ||
		amountInSol <= 0
	) {
		console.error(
			"Amount must be greater than zero."
		);
		process.exit(1);
	}

	const transferAmount = lamports(
		BigInt(
			Math.round(
				amountInSol *
					Number(
						LAMPORTS_PER_SOL
					)
			)
		)
	);

	console.log("\n==================================================");
	console.log(" ANATOMY OF A SOLANA TRANSACTION");
	console.log("==================================================\n");

	// -------------------------------------------------------------------------
	// Connect
	// -------------------------------------------------------------------------

	const rpc = createSolanaRpc(RPC_URL);

	console.log("1. Connected to Devnet");

	// -------------------------------------------------------------------------
	// Load Wallet
	// -------------------------------------------------------------------------

	const signer = await loadKeypair();

	console.log("\n2. Signer Loaded");
	console.log("----------------------------------------");
	console.log("Wallet:", signer.address);

	const { value: balance, } = await rpc
		.getBalance(signer.address)
		.send();

	console.log("Balance:", Number(balance) / 1_000_000_000, "SOL");

	if (
		balance <
		transferAmount
	) {
		console.error("\nInsufficient balance.");
		process.exit(1);
	}

	// -------------------------------------------------------------------------
	// Get Blockhash
	// -------------------------------------------------------------------------

	const { value: latestBlockhash } = await rpc
		.getLatestBlockhash()
		.send();

	console.log("\n3. Recent Blockhash");
	console.log("----------------------------------------");
	console.log("Blockhash:", latestBlockhash.blockhash);
	console.log("Last Valid Block Height:", latestBlockhash.lastValidBlockHeight);

	// -------------------------------------------------------------------------
	// Create Instruction
	// -------------------------------------------------------------------------

	const transferInstruction =
		getTransferSolInstruction({
			source: signer,
			destination:
				recipientAddress,
			amount:
				transferAmount,
		});

	console.log("\n4. Instruction");
	console.log("----------------------------------------");
	console.log("Type: System Program Transfer");
	console.log("From:", signer.address);
	console.log("To:", recipientAddress);
	console.log("Amount:", amountInSol,"SOL");

	// -------------------------------------------------------------------------
	// Build Transaction
	// -------------------------------------------------------------------------

	const transactionMessage =
		pipe(
			createTransactionMessage({version: 0,}),
			(tx) =>
				setTransactionMessageFeePayerSigner(
					signer,
					tx
				),
			(tx) =>
				setTransactionMessageLifetimeUsingBlockhash(
					latestBlockhash,
					tx
				),
			(tx) =>
				appendTransactionMessageInstruction(
					transferInstruction,
					tx
				)
		);

	console.log("\n5. Transaction Anatomy");
	console.log("----------------------------------------");
	console.log("Fee Payer:", signer.address);
	console.log("Instruction Count: 1");
	console.log("Version: 0");

	// -------------------------------------------------------------------------
	// Sign
	// -------------------------------------------------------------------------

	const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

	const signature = getSignatureFromTransaction(signedTransaction);

	console.log("\n6. Signature");
	console.log("----------------------------------------");
	console.log(signature);

	// -------------------------------------------------------------------------
	// Serialize
	// -------------------------------------------------------------------------

	const wireTransaction = getBase64EncodedWireTransaction(signedTransaction);

	console.log("\n7. Serialized Transaction");
	console.log("----------------------------------------");
	console.log("Encoding: Base64");
	console.log("Size:", wireTransaction.length, "bytes (encoded)");

	// -------------------------------------------------------------------------
	// Send
	// -------------------------------------------------------------------------

	console.log("\n8. Broadcasting Transaction");
	console.log("----------------------------------------");

	await rpc
		.sendTransaction(
			wireTransaction,
			{
				encoding:
					"base64",
			}
		)
		.send();

	console.log("✓ Sent to validator");

	// -------------------------------------------------------------------------
	// Commitments
	// -------------------------------------------------------------------------

	console.log("\n9. Tracking Commitment Levels");
	console.log("----------------------------------------");

	await waitForCommitment(rpc, signature, "processed");

	console.log("✓ Processed");

	await waitForCommitment(rpc, signature, "confirmed");

	console.log("✓ Confirmed");

	await waitForCommitment(rpc, signature, "finalized");

	console.log("✓ Finalized");

	// -------------------------------------------------------------------------
	// Explorer
	// -------------------------------------------------------------------------

	console.log("\n10. Explorer");
	console.log("----------------------------------------");

	console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

	console.log("\n==================================================");
	console.log(" TRANSACTION COMPLETED");
	console.log("==================================================\n");
}

main().catch((error) => {
	console.error("\nTransaction failed:");
	console.error(error);
	process.exit(1);
});