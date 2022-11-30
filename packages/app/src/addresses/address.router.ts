import * as express from "express";

import { checkAuth } from "#/sessions";

import { getDepositAddress } from "./handlers";

export const create = () => {
  const router = express.Router();

  router.get("/deposit/:assetIdOrSymbol", checkAuth, getDepositAddress);

  return router;
};
