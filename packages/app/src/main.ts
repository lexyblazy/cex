import "reflect-metadata";
import express from "express";
import * as typeorm from "typeorm";
import morgan from "morgan";

import { initRouters, initServices } from "#/init";
import { getCurrentCommitHash, isDev } from "#/utils";

const { PORT } = process.env;

const loadMiddleware = (app: express.Application) => {
  app.use(morgan(isDev() ? "dev" : "combined"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
};

const main = async (app: express.Application) => {
  await initServices();

  loadMiddleware(app);
  initRouters(app);

  app.get("/status", async (_req, res) => {
    const connection = typeorm.getConnection();

    res.send({
      isDatabaseConnected: connection.isConnected,
      runningCommit: await getCurrentCommitHash(),
    });
  });

  app.listen(PORT, async () => {
    console.log(`Server is up and running on ${PORT} 🚀🚀`);
  });
};

main(express()).catch(console.error);
