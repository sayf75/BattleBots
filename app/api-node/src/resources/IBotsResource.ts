import IGameProfileResource from "./IGameProfileResource";
import { IStreamResource } from "./IStreamResource";
import { IGameResource } from "./IGameResource";

export interface IBotsResource {
    id: number;
    botIp: string;
    running: number;
    taken: number;
    name: string;
    speed: number;
    damage: number;
    fireRate: number;
    armor: number;
    streams? : Array<IStreamResource>;
    games?: Array<IGameResource>;
    gameProfile?: IGameProfileResource;
}
