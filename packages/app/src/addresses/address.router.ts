import * as express from "express";

export const create = () => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    res.send("address");
  });

  return router;
};
