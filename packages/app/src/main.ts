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

  app.get("/job", async (req, res) => {
    const queue = getWorker(ADDRESSES_JOB_PIPELINE);
    const job = await queue.add(
      {
        luckyNumberFromApi: Math.random(),
      },
      {}
    );

    res.send(job.id);
  });

  app.listen(PORT, async () => {
    console.log(`Server is up and running on ${PORT} 🚀🚀`);
  });
};

main(express()).catch(console.error);
