import * as express from "express";
import { signup } from "./handlers";

export const create = () => {
  const router = express.Router();

  router.post("/signup", signup);

  return router;
};
