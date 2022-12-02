interface CreateTransaction {
  action: "createTransaction";
  payload?: {};
}

export type TransactionsJobPipeline = CreateTransaction;
