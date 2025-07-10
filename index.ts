import {
  Address,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  BASE_FEE,
  StrKey,
  rpc,
} from "@stellar/stellar-sdk";

const server = new rpc.Server("https://rpc-futurenet.stellar.org");
const networkPassphrase = Networks.FUTURENET;

// ⚠️ NEVER hardcode secrets in real code — use .env!
const userKeypair = Keypair.fromSecret(
  "<Secret-Key>"
);
const userAddress = new Address(userKeypair.publicKey());

const GATEWAY_CONTRACT_ID =
  "<GateWay-Contract>";
const TOKEN_CONTRACT_ID =
  "<Token-Contract>";

const gateway = new Contract(GATEWAY_CONTRACT_ID);
const token = new Contract(TOKEN_CONTRACT_ID);

async function loadAccount() {
  return await server.getAccount(userKeypair.publicKey());
}

async function sendContractCall(
  contractCall: ReturnType<typeof Contract.prototype.call>
) {
  const account = await loadAccount();

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contractCall)
    .setTimeout(30)
    .build();

  tx.sign(userKeypair);

  const res = await server.sendTransaction(tx);
  console.log(`TX hash: ${res.hash}`);
  return res;
}


// methods from contract deployed.

export async function initGateway() {
  console.log("⏳ Init Gateway...");
  const tokenContractId = StrKey.decodeContract(TOKEN_CONTRACT_ID);
  const tokenAddress = Address.contract(tokenContractId);
  return sendContractCall(
    gateway.call("init", userAddress.toScVal(), tokenAddress.toScVal())
  );
}

export async function approveToken(spender: string, amount: bigint) {
  console.log("⏳ Approve Token...");
  return sendContractCall(
    token.call(
      "approve",
      userAddress.toScVal(),
      new Address(spender).toScVal(),
      nativeToScVal(amount.toString(), { type: "i256" }),
      nativeToScVal(0, { type: "u32" })
    )
  );
}

export async function addMerchant(merchantPubKey: string) {
  console.log("⏳ Add Merchant...");
  return sendContractCall(
    gateway.call(
      "add_merchant",
      userAddress.toScVal(),
      new Address(merchantPubKey).toScVal()
    )
  );
}

export async function removeMerchant(merchantPubKey: string) {
  console.log("⏳ Remove Merchant...");
  return sendContractCall(
    gateway.call(
      "remove_merchant",
      userAddress.toScVal(),
      new Address(merchantPubKey).toScVal()
    )
  );
}

export async function createPaymentLink(amount: bigint, description: string) {
  console.log("⏳ Create Payment Link...");
  return sendContractCall(
    gateway.call(
      "create_payment_link",
      userAddress.toScVal(),
      nativeToScVal(amount.toString(), { type: "i256" }),
      nativeToScVal(description, { type: "symbol" })
    )
  );
}

export async function processPayment(linkId: number) {
  console.log("⏳ Process Payment...");
  return sendContractCall(
    gateway.call(
      "process_payment",
      userAddress.toScVal(),
      nativeToScVal(linkId, { type: "u32" })
    )
  );
}

export async function createSubscriptionPlan(
  amount: bigint,
  interval: number,
  name: string
) {
  console.log("⏳ Create Subscription Plan...");
  return sendContractCall(
    gateway.call(
      "create_subscription_plan",
      userAddress.toScVal(),
      nativeToScVal(amount.toString(), { type: "i256" }),
      nativeToScVal(interval, { type: "u32" }),
      nativeToScVal(name, { type: "symbol" })
    )
  );
}

export async function subscribe(planId: number) {
  console.log("⏳ Subscribe...");
  return sendContractCall(
    gateway.call(
      "subscribe",
      userAddress.toScVal(),
      nativeToScVal(planId, { type: "u32" })
    )
  );
}

export async function processSubscriptionPayment(
  subscriberPubKey: string,
  subscriptionId: number
) {
  console.log("⏳ Process Subscription Payment...");
  return sendContractCall(
    gateway.call(
      "process_subscription_payment",
      userAddress.toScVal(),
      new Address(subscriberPubKey).toScVal(),
      nativeToScVal(subscriptionId, { type: "u32" })
    )
  );
}

export async function cancelSubscription(subscriptionId: number) {
  console.log("⏳ Cancel Subscription...");
  return sendContractCall(
    gateway.call(
      "cancel_subscription",
      userAddress.toScVal(),
      nativeToScVal(subscriptionId, { type: "u32" })
    )
  );
}

export async function deactivatePaymentLink(linkId: number) {
  console.log("⏳ Deactivate Payment Link...");
  return sendContractCall(
    gateway.call(
      "deactivate_payment_link",
      userAddress.toScVal(),
      nativeToScVal(linkId, { type: "u32" })
    )
  );
}

export async function deactivateSubscriptionPlan(planId: number) {
  console.log("⏳ Deactivate Subscription Plan...");
  return sendContractCall(
    gateway.call(
      "deactivate_subscription_plan",
      userAddress.toScVal(),
      nativeToScVal(planId, { type: "u32" })
    )
  );
}


(async () => {

  const tokenAmount = BigInt(10 * 10 ** 7);
  const merchantPubKey = "<merchant-pub-key>"; // Replace!
  const subscriberPubKey = "<subscriber-pub-key>"; // Replace!

  try {
    // these are in seequence we should run this in sequence 
    // for the frontend interaction


    // await initGateway();
    // await approveToken(GATEWAY_CONTRACT_ID, tokenAmount);
    // await addMerchant(merchantPubKey);
    // await createPaymentLink(tokenAmount, 'Demo Link');
    // await processPayment(1);
    // await createSubscriptionPlan(tokenAmount, 2592000, 'Monthly Plan');
    // await subscribe(1);
    // await processSubscriptionPayment(subscriberPubKey, 1);
    // await cancelSubscription(1);
    // await deactivatePaymentLink(1);
    // await deactivateSubscriptionPlan(1);
    // await removeMerchant(merchantPubKey);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
