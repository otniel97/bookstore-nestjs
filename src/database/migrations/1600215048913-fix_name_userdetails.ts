import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameUserdetails1600215048913 implements MigrationInterface {
    name = 'fixNameUserdetails1600215048913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" SET NOT NULL`);
    }

}
