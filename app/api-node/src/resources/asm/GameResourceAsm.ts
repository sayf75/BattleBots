import { IGameResource } from "../IGameResource";
import { GameEntity } from "../../database/entities/GameEntity";
import { Singleton, Container } from "typescript-ioc";
import { BotResourceAsm } from "./BotResourceAsm";
import { StreamsResourceAsm } from "./StreamsResourceAsm";
import { ArenaResourceAsm } from "./ArenaResourceAsm";
//import { ArenaResourceAsm } from "./ArenaResourceAsm";
//import { BotResourceAsm } from "./BotResourceAsm";
//import { RobotGameEntity } from "../../database/entities/RobotGameEntity";
//import { StreamsResourceAsm } from "./StreamsResourceAsm";

@Singleton
export class GameResourceAsm {

    /*
    private arenaResourceAsm: ArenaResourceAsm;
    private botResourceAsm: BotResourceAsm;
    private streamResourceAsm: StreamsResourceAsm;
    */

    constructor(){
        /*
        this.arenaResourceAsm = Container.get(ArenaResourceAsm);
        this.botResourceAsm = Container.get(BotResourceAsm);
        this.streamResourceAsm = Container.get(StreamsResourceAsm);
        */
    }

    public async toEntity(game: IGameResource){
        const entity = new GameEntity();

        entity.id = game.id;
        entity.game_name = game.name;
        entity.game_status = game.status;
        /*
        let gameRobots = [];
        if (game.arena){
            entity.arena = await this.arenaResourceAsm.toEntity(game.arena);
        }
        if (game.bots){
            for (let bot of game.bots){
                let gameRobot : RobotGameEntity = {};


                gameRobot.bot = await this.botResourceAsm.toEntity(bot);
                gameRobot.game = entity;
                gameRobots.push(gameRobot);
            }
            entity.robots = Promise.resolve(gameRobots);
        }
        if (game.streams){
            let streams = [];

            for (let stream of game.streams){
                const streamResource = this.streamResourceAsm.toEntity(stream);

                streams.push(streamResource);
            }
            entity.streams = Promise.resolve(streams);
        }
        */
        return (entity);
    }

    public toGameResource(entity: GameEntity) : IGameResource{
        const resource : IGameResource = {
            id: entity.id,
            name: entity.game_name,
            status: entity.game_status,
            bots: []
        };

        return (resource);
    }

    public async AddArenaResource(entity: GameEntity, resource: IGameResource): Promise<IGameResource> {
        const arenaResourceAsm = Container.get(ArenaResourceAsm);

        if (entity.arena){
            resource.arena = await arenaResourceAsm.toResource(entity.arena);
        }
        return (resource);
    }

    public async AddBotsResource(entity: GameEntity, resource: IGameResource): Promise<IGameResource> {
        const botResourceAsm = Container.get(BotResourceAsm);
        const entitiesBots = await entity.robots;

        if (entitiesBots){
            const bots = [];

            for (let bot of entitiesBots){
                bots.push(await botResourceAsm.toResource(bot.bot));
            }
            resource.bots = bots;
        }
        return (resource);
    }

    public async AddStreamResouce(entity: GameEntity, resource: IGameResource): Promise<IGameResource> {
        const streamResourceAsm = Container.get(StreamsResourceAsm);
        const entitiesStreams = await entity.streams;

        if (entitiesStreams){
            const streams = [];

            for (let stream of entitiesStreams){
                streams.push(await streamResourceAsm.toResource(stream));
            }
            resource.streams = streams;
        }
        return (resource);
    } 

    public async toResource(entity: GameEntity){
        const resource : IGameResource = this.toGameResource(entity);

        return (resource);
    }

    public async toResources(games: Array<GameEntity>){
        const resources = [];

        for (let game of games){
            resources.push(await this.toResource(game));
        }
        return (resources);
    }
}  