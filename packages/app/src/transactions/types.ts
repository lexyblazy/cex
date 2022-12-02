interface CreateTransaction {
  action: "createTransaction";
  payload?: {};
}

interface SignTransaction {
  action: "signTransaction";
  payload?: {};
}

interface BroadcastTransaction {
  action: "broadcastTransaction";
  payload?: {};
}

export type TransactionsJobPipeline = CreateTransaction | SignTransaction | BroadcastTransaction;
