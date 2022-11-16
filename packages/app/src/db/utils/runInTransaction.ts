import * as typeorm from "typeorm";

export const runInTransaction = <T>(
  callback: (transaction: typeorm.EntityManager) => Promise<T>,
  existingTransactionalEntityManager: typeorm.EntityManager
) => {
  const typeormConnection = typeorm.getConnection();

  const transactionRunner = (transaction: typeorm.EntityManager) => callback(transaction);

  return existingTransactionalEntityManager
    ? transactionRunner(existingTransactionalEntityManager)
    : typeormConnection.manager.transaction(transactionRunner);
};
