import * as express from "express";
import { login, signup } from "./handlers";

export const create = () => {
  const router = express.Router();

  router.post("/signup", signup);

  router.post("/login", login);

  return router;
};
