import "reflect-metadata";
import express from "express";
import * as typeorm from "typeorm";
import morgan from "morgan";

import { initRouters, initServices } from "#/init";
import { isDev } from "#/utils";

const { PORT } = process.env;

const main = async (app: express.Application) => {
  await initServices();

  app.use(morgan(isDev() ? "dev" : "combined"));

  initRouters(app);

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
