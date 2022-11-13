import "reflect-metadata";
import express from "express";
import * as typeorm from "typeorm";

import { initServices } from "./init";
import { getWorker } from "./workers";
import { ADDRESSES_JOB_PIPELINE } from "./workers/constants";

const { PORT } = process.env;

const main = async (app: express.Application) => {
  await initServices();

  app.get("/status", async (_req, res) => {
    const connection = typeorm.getConnection();

    res.send({
      isDatabaseConnected: connection.isConnected,
    });
  });

  app.listen(PORT, async () => {
    console.log(`Server is up and running on ${PORT} 🚀🚀`);
  });
};

main(express()).catch(console.error);
