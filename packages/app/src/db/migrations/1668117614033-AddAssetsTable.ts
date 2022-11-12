import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssetsTable1668117614033 implements MigrationInterface {
  name = "AddAssetsTable1668117614033";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "networkSymbol" character varying NOT NULL, "requiredConfirmations" smallint NOT NULL, "symbol" character varying NOT NULL, "tokenId" character varying, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "indexUqSymbolNetworkSymbol" ON "assets" ("symbol", "networkSymbol") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."indexUqSymbolNetworkSymbol"`);

    await queryRunner.query(`DROP TABLE "assets"`);
  }
}
