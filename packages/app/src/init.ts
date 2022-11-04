import * as typeorm from "typeorm";

export const loadServices = async () => {
  try {
    await initTypeorm();
  } catch (error) {
    console.error("Failed to init core requirements", error);
    process.exit(1);
  }
};

export const initTypeorm = async () => {
  const defaultConnectionOptions = await typeorm.getConnectionOptions();

  Object.assign(defaultConnectionOptions, {
    url: process.env.DATABASE_URL,
  });

  await typeorm.createConnection(defaultConnectionOptions);
};
