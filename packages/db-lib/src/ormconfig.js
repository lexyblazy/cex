module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL_HOST,
  entities: ["dist/db/schemas/*.js"],
  migrations: ["dist/db/migrations/*.js"],
  cli: {
    migrationsDir: "src/db/migrations",
  },
  maxQueryExecutionTime: 2000,
};
