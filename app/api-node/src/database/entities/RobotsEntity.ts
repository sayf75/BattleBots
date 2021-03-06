import { AbstractEntity } from "./AbstractEntity";
import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { RobotGameEntity } from "./RobotGameEntity";
import { PlayerEntity } from "./PlayerEntity";
import { RobotsArenaEntity } from "./RobotsArenaEntity";
import { StreamsEntity } from "./StreamsEntity";

@Entity({
    name: "robots"
})
export class RobotsEntity extends AbstractEntity {

    @Column({name: "bot_ip"})
    public botIp: string;

    @Column({name: "running"})
    public running: number;

    @Column({name: "taken"})
    public taken: number;

    @Column({name: "name"})
    public name: string;

    @Column({name: "speed"})
    public speed: number;

    @Column({name: "damage"})
    public damage: number;

    @Column({name: "fire_rate"})
    public fireRate: number;

    @Column({name: "armor"})
    public armor: number;

    @JoinColumn({name: "player_id"})
    @ManyToOne(type => PlayerEntity, playerEntity => playerEntity.robots, {
        eager: true
    })
    public player?: PlayerEntity;

    @OneToMany(type => RobotGameEntity, robotGame => robotGame.bot, {
        lazy: true
    })
    public robotGame?: Array<RobotGameEntity>;

    @OneToMany(type => RobotsArenaEntity, robotArena => robotArena.robot, {
        lazy: true
    })
    public robotsArena?: Array<RobotsArenaEntity>;

    @OneToMany(type => StreamsEntity, streams => streams.robot, {
        lazy: true
    })
    public streams?: Array<StreamsEntity>;
}
