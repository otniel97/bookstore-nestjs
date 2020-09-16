import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNamesUserdetails1600215199179 implements MigrationInterface {
    name = 'fixNamesUserdetails1600215199179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" RENAME COLUMN "username" TO "name"`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" RENAME COLUMN "name" TO "username"`);
    }

}
