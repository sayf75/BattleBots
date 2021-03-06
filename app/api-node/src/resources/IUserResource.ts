import IGameProfileResource from "./IGameProfileResource";

export default interface IUserResource {
    id?: number;
    firstname?: string;
    lastname?: string;
    pseudo: string;
    email: string;
    roles: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
    password?: string;
    gameProfile?: Array<IGameProfileResource>
};