import * as typeorm from "typeorm";

export const runInTransaction = <T>(
  callback: (transactionalEntityManager: typeorm.EntityManager) => Promise<T>,
  existingTransactionalEntityManager?: typeorm.EntityManager
) => {
  const typeormConnection = typeorm.getConnection();

  const transactionRunner = (transactionalEntityManager: typeorm.EntityManager) =>
    callback(transactionalEntityManager);

  return existingTransactionalEntityManager
    ? transactionRunner(existingTransactionalEntityManager)
    : typeormConnection.manager.transaction(transactionRunner);
};
