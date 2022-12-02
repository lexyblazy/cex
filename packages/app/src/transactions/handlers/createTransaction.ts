import * as express from "express";
import { getWorker, constants } from "#/workers";

import { TransactionsJobPipeline } from "../types";

export const createTransaction: express.RequestHandler = async (req, res) => {
  const transactionWorker = getWorker<TransactionsJobPipeline>(constants.TRANSACTIONS_JOB_PIPELINE);
  // code to create transaction and save to the db, goes here

  await transactionWorker.add({
    action: "signTransaction",
    payload: req.body,
  });

  res.send("Creating transaction");
};
