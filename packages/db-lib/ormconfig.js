module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL_HOST,
  entities: ["dist/schemas/*.js"],
  migrations: ["dist/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations",
  },
  maxQueryExecutionTime: 2000,
};
