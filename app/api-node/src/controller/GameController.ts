import { GameService } from "../service/GameService";
import { Container } from "typescript-ioc";
import { Path, PreProcessor, PostProcessor, POST, PUT, PathParam, GET, DELETE  } from "typescript-rest";
import { preRequest } from "../service/interceptors/preRequest/preRequest";
import { postRequest } from "../service/interceptors/postRequest/postRequest";
import { IGameResource } from "../resources/IGameResource";
import { GameResourceAsm } from "../resources/asm/GameResourceAsm";
import HttpResponseModel from "../resources/HttpResponseModel";
import { SendResource } from "../../lib/ReturnExtended";
import { GameEntity } from "../database/entities/GameEntity";

@Path("/api/games")
@PreProcessor(preRequest)
@PostProcessor(postRequest)
export class GameController {
    private gameService: GameService;
    private gameResourceAsm: GameResourceAsm;

    constructor(){
        this.gameService = Container.get(GameService);
        this.gameResourceAsm = Container.get(GameResourceAsm);
    }

    @PUT
    @Path("/start/:id")
    public async start(@PathParam("id")id: number){
        const entity: GameEntity = await  this.gameService.start(id);

        if (!entity){
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 404,
                message: "game not found",
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
        }
        const resource = this.gameResourceAsm.toResource(entity);
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 200,
            message: "game started",
            data: resource
        };

        return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
    }

    @PUT
    @Path("/stop/:id")
    public async stop(@PathParam("id")id: number){
        const entity: GameEntity = await  this.gameService.stop(id);

        if (!entity){
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 404,
                message: "game not found",
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
        }
        const resource = this.gameResourceAsm.toResource(entity);
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 200,
            message: "game stopped",
            data: resource
        }; 
        
        return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
    }

    @POST
    @Path("/create")
    public async create(game: IGameResource){
        const entity = await this.gameResourceAsm.toEntity(game);
        const saved = await this.gameService.create(entity);
        const resource = this.gameResourceAsm.toResource(saved);
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 201,
            message: "game created",
            data: resource
        };

        return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
    }

    @PUT
    @Path("/end/:id")
    public async end(@PathParam("id")id: number){
        const entity: GameEntity = await this.gameService.end(id);

        if (!entity){
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 404,
                message: "game not found",
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
        }
        const resource = this.gameResourceAsm.toResource(entity);
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 200,
            message: "game ended",
            data: resource
        }; 
        
        return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
 
    }

    @GET
    @Path("/")
    public async list(){
        const list = await this.gameService.findAll();
        const resources = this.gameResourceAsm.toResources(list);
        const response : HttpResponseModel<Array<IGameResource>> = {
            httpCode: 200,
            message: "game list",
            data: resources
        };

        return Promise.resolve(new SendResource<HttpResponseModel<Array<IGameResource>>>("GameController", response.httpCode, response));        
    }

    @GET
    @Path("/:id")
    public async detail(@PathParam("id")id: number){
        const game = await this.gameService.findOne(id);

        if (!game){
            const response : HttpResponseModel<IGameResource> = {
                httpCode: 404,
                message: "game not found",
            };
    
            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
    
        }
        const response : HttpResponseModel<IGameResource> = {
            httpCode: 200,
            message: "game detail",
            data: this.gameResourceAsm.toResource(game)
        };

        return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));        
    }

    @DELETE
    @Path("/:id")
    public async delete(@PathParam("id")id: number){
        try {
            const flag = await this.gameService.deleteOne(id);

            if (flag){
                const response: HttpResponseModel<IGameResource> = {
                    message: "game deleted",
                    httpCode: 200
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
            else {
                const response: HttpResponseModel<IGameResource> = {
                    message: "game not found",
                    httpCode: 404
                };

                return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
            }
        }
        catch (e){
            const response: HttpResponseModel<IGameResource> = {
                message: "game error",
                httpCode: 400
            };

            return Promise.resolve(new SendResource<HttpResponseModel<IGameResource>>("GameController", response.httpCode, response));
        }
    }
}