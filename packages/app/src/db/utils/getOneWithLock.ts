import _ from "lodash";
import * as typeorm from "typeorm";

export const getOneWithLock = <T extends typeorm.ObjectLiteral>({
  where,
  relations,
  existingTransactionalEntityManager,
  repository,
  callback,
}: {
  repository: typeorm.Repository<T>;
  where: typeorm.FindConditions<T>;
  relations?: string[];
  existingTransactionalEntityManager?: typeorm.EntityManager;
  callback: (entity: T | undefined, transaction: typeorm.EntityManager) => Promise<T>;
}) => {
  const typeormConnection = typeorm.getConnection();

  const transactionRunner = async (transactionalEntityManager: typeorm.EntityManager) => {
    const transactionalRepository = transactionalEntityManager.getRepository<T>(
      repository.metadata.name
    );

    const entity = await transactionalRepository.findOne({
      where,
      lock: {
        mode: "pessimistic_write",
      },
      loadRelationIds: !!relations,
    });

    if (entity && relations) {
      for (const relationPath of relations) {
        const relation = repository.metadata.relations.find(
          (rel) => rel.propertyPath === relationPath
        );

        if (!relation) {
          throw new Error(`Unable to find relation for ${relationPath}`);
        }

        const relationRepositoryName = relation.inverseEntityMetadata.name;
        const transactionalRelationRepository =
          transactionalEntityManager.getRepository(relationRepositoryName);

        let relationEntity = null;

        if (relation.isOneToOne || relation.isManyToOne) {
          relationEntity = await transactionalRelationRepository.findOne({
            id: entity[relationPath],
          });
        } else if (relation.isOneToMany) {
          // TODO - further verify this behavior is consistent
          relationEntity = await transactionalRelationRepository.findByIds(
            _.castArray(entity[relationPath])
          );
        }

        if (relationEntity) {
          _.set(entity, relationPath, relationEntity);
        }
      }
    }

    return callback(entity, transactionalEntityManager);
  };

  return existingTransactionalEntityManager
    ? transactionRunner(existingTransactionalEntityManager)
    : typeormConnection.manager.transaction(transactionRunner);
};
