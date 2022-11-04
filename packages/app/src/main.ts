import "reflect-metadata";
import express from "express";
import * as typeorm from "typeorm";

import { loadServices } from "./init";

const { PORT } = process.env;

const main = async (app: express.Application) => {
  await loadServices();

  app.get("/status", async (_req, res) => {
    const connection = typeorm.getConnection();

    res.send({
      isDatabaseConnected: connection.isConnected,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} 🚀🚀`);
  });
};

main(express()).catch(console.error);
