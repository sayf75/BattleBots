import { Column, JoinColumn, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import UserEntity from "./UserEntity";

@Entity({
    name: "geoip"
})
export class GeoIpEntity extends AbstractEntity {

    @JoinColumn({
        name: "user_id",
        referencedColumnName: "id"
    })
    @ManyToOne(type => UserEntity, user => user.geoips)
    public user: UserEntity;

    @Column()
    public longitude: number;

    @Column()
    public latitude: number;

    @Column()
    public ip: string;

    @Column()
    public country: string;

    @Column()
    public city: string;

    @Column()
    public timezone: string;
}