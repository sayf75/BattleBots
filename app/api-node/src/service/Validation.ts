import { Decoder, object, string, optional, number } from '@mojotech/json-type-validation';
import IUserResource from "../http-models/IUserResource";
import IBattleResource from "../http-models/IBattleResource"
import IBattleJoin from '../http-models/IBattleJoin';

export const userResourceDecoder: Decoder<IUserResource> = object({
    firstname: optional(string()),
    lastname: optional(string()),
    pseudo: string(),
    email: string(),
    address: optional(string()),
    id: optional(number()),
    updatedAt: optional(string()),
    createdAt: optional(string()),
    password: optional(string()),
    confirmation: optional(string())
});

export const battleResourceDecoder : Decoder<IBattleResource> = object({
    id: optional(number()),
    token: optional(string()),
    name: string()
});

export const battleJoinDecoder : Decoder<IBattleJoin> = object({
    battleId: number(),
    userId: number()
});
