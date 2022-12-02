const dbLibEntryPointPath = require.resolve("@cex/db-lib");
const path = require("path");

const nodes = dbLibEntryPointPath.split("/");

const baseDbLibPath = nodes.slice(0, nodes.length - 1).join("/");

const schemasPath = "schemas/*.js";
const migrationsPaths = "migrations/*.js";

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL_HOST,
  entities: [path.join(baseDbLibPath, schemasPath)],
  migrations: [path.join(baseDbLibPath, migrationsPaths)],

  maxQueryExecutionTime: 2000,
};
