import * as express from "express";

import { checkAuth } from "#/sessions";
import { login, logout, signup } from "./handlers";

export const create = () => {
  const router = express.Router();

  router.post("/signup", signup);

  router.post("/login", login);

  router.post("/logout", checkAuth, logout);

  return router;
};
