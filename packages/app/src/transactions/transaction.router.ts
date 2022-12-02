import * as express from "express";

import { checkAuth } from "#/sessions";
import { createTransaction } from "./handlers";

export const create = () => {
  const router = express.Router();

  router.post("/", checkAuth, createTransaction);

  return router;
};
