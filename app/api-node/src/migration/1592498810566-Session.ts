import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class Session1592498810566 implements MigrationInterface {

   
    public async up(queryRunner: QueryRunner): Promise<any> {
        const increment: 'increment' | 'uuid' | 'rowid' = "increment";

        await queryRunner.createTable(new Table({
            name: "session",
            columns: [
                {
                    type: "int",
                    isGenerated: true,
                    generationStrategy: increment,
                    name: "id",
                    isPrimary: true
                },
                {
                    name: "game_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "player_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "stream_id",
                    type: "int",
                    isNullable: false
                },
                {
                    name: "bot_energy",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "bot_heat",
                    type: "int",
                    isNullable: true
                }
            ]
        }))

        await queryRunner.createForeignKey("session", new TableForeignKey({
            name: "fk_session_game_id",
            columnNames: ["game_id"],
            referencedTableName: "games",
            referencedColumnNames: ["id"]
        }));

        await queryRunner.createForeignKey("session", new TableForeignKey({
            name: "fk_session_player_id",
            columnNames: ["player_id"],
            referencedTableName: "player",
            referencedColumnNames: ["id"]
        }));

        await queryRunner.createForeignKey("session", new TableForeignKey({
            name: "fk_session_stream_id",
            columnNames: ["stream_id"],
            referencedTableName: "streams",
            referencedColumnNames: ["id"]
        }));

        await queryRunner.createForeignKey("session", new TableForeignKey({
            name: "fk_session_bot_id",
            columnNames: ["robots_id"],
            referencedTableName: "robots",
            referencedColumnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey("player", "fk_session_player_id");
        await queryRunner.dropForeignKey("robots", "fk_session_robots_id");
        await queryRunner.dropForeignKey("streams", "fk_session_stream_id");
        await queryRunner.dropForeignKey("game", "fk_session_game_id");
        await queryRunner.dropTable("session");
    }

}
