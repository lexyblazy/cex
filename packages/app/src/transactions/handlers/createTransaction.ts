import * as express from "express";

export const createTransaction: express.RequestHandler = (req, res) => {
  res.send("Creating transaction");
};
