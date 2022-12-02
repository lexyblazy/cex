import * as express from "express";
import { getWorker, constants } from "#/workers";

import { TransactionsJobPipeline } from "../types";

export const createTransaction: express.RequestHandler = async (req, res) => {
  const transactionWorker = getWorker<TransactionsJobPipeline>(constants.TRANSACTIONS_JOB_PIPELINE);

  await transactionWorker.add({
    action: "createTransaction",
    payload: req.body,
  });

  res.send("Creating transaction");
};
