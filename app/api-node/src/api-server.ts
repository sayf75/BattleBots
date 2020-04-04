import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportAuthenticator, Server } from 'typescript-rest';
import { PlayerRepository } from './database/repositories/PlayerRepository';
import { UserRepository } from './database/repositories/UserRepository';
import { GameRepository } from './database/repositories/GameRepository';
import { FakeRepository } from './database/repositories/FakeRepository';
import { Container } from 'typescript-ioc';
import { UserService } from './service/UserService';
import { UserServiceImpl } from './service/impl/UserServiceImpl';
import { BattleService } from './service/BattleService';
import { BattleServiceImpl } from './service/impl/BattleServiceImpl';
import IServiceFactory from './service/IServiceFactory';
import ServiceFactory from './service/impl/ServiceFactory';
import IConfig from './service/IConfig';
import Config from './service/impl/Config';
import { GameService } from './service/GameService';
import { GameServiceImpl } from './service/impl/GameServiceImpl';
import { ArenaService } from './service/ArenaService';
import { ArenaServiceImpl } from './service/impl/ArenaServiceImpl';
import { AuthenticationService } from './service/AuthenticationService';
import { AuthenticationServiceImpl } from './service/impl/AuthenticationServiceImpl';
import { PlayerService } from './service/PlayerService';
import { PlayerServiceImpl } from './service/impl/PlayerServiceImpl';
import { ArenaRepository } from './database/repositories/ArenaRepository';
import { BotsRepository } from './database/repositories/BotsRepository';
import { BotsService } from './service/BotsService';
import { BotsServiceImpl } from './service/impl/BotsServiceImpl';
import { LogRepository } from './database/repositories/LogRepository';
import { StreamsRepository } from './database/repositories/StreamsRepository';
import { LogService } from './service/LogService';
import { LogServiceImpl } from './service/impl/LogServiceImpl';
import { StreamsService } from './service/StreamsService';
import { StreamsServiceImpl } from './service/impl/StreamsServiceImpl';
import UserEntity from './database/entities/UserEntity';
import { BotArenaRepository } from './database/repositories/BotArenaRepository';
import { BotArenaService } from './service/BotArenaService';
import { BotArenaServiceImpl } from './service/impl/BotArenaServiceImpl';

export class ApiServer {
    public PORT: number = 8080; // +process.env.PORT || 8080;

    private readonly app: express.Application;
    private server: http.Server = null;
    private serviceConfig: IConfig;

    constructor() {
        this.app = express();
        this.config();

        Server.useIoC();
        const bodyParser = require('body-parser');
        this.app.use(bodyParser.json({ verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        this.app.use(bodyParser.raw({ type: "*/*", verify: function(req, res, buf, encoding){
            req.rawBody = buf.toString();
        }}));
        Server.loadServices(this.app, 'controller/**/*.ts', __dirname);
        // Note : This disable auto-nexting
        // If we need it in a controller, we will use :
        // Context.next()
        //   Server.ignoreNextMiddlewares(true);

        Server.swagger(this.app, { 
            swaggerUiOptions: {
                customSiteTitle: 'BattleBots'
            },
            filePath: 'swagger.yaml',
            endpoint: "api-docs",
            host: "localhost:8080",
            schemes: ["http"]
         });
        this.app.use("*", function (req, res, next) {
            if (!res.headersSent) { res.render("App/index.html"); }
            next();
        });
    }

    public getApp(): Express.Application {
        return (this.app);
    }

    /**
     * Start the server
     */
    public async start() {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }

                // TODO: replace with Morgan call
                // tslint:disable-next-line:no-console
                console.log(`Listening to http://127.0.0.1:${this.PORT}`);
                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    private initIoc(){
        Container.bind(UserService).to(UserServiceImpl);
        Container.bind(BattleService).to(BattleServiceImpl);
        Container.bind(GameService).to(GameServiceImpl);
        Container.bind(ArenaService).to(ArenaServiceImpl);
        Container.bind(AuthenticationService).to(AuthenticationServiceImpl);
        Container.bind(PlayerService).to(PlayerServiceImpl);
        Container.bind(BotsService).to(BotsServiceImpl);
        Container.bind(StreamsService).to(StreamsServiceImpl);
        Container.bind(LogService).to(LogServiceImpl);
        Container.bind(BotArenaService).to(BotArenaServiceImpl);
    
        Container.bind(IServiceFactory).to(ServiceFactory);
        Container.bind(IConfig).to(Config);
        if (process.env.NODE_ENV !== "test"){
            Container.bind(PlayerRepository).to(PlayerRepository);
            Container.bind(UserRepository).to(UserRepository);
            Container.bind(GameRepository).to(GameRepository);
            Container.bind(ArenaRepository).to(ArenaRepository);
            Container.bind(BotsRepository).to(BotsRepository);
            Container.bind(StreamsRepository).to(StreamsRepository);
            Container.bind(LogRepository).to(LogRepository);
            Container.bind(BotArenaRepository).to(BotArenaRepository);
        }
        else {
            Container.bind(PlayerRepository).to(FakeRepository);
            Container.bind(UserRepository).to(FakeRepository);
            Container.bind(GameRepository).to(FakeRepository);
            Container.bind(ArenaRepository).to(FakeRepository);
            Container.bind(BotsRepository).to(FakeRepository);
            Container.bind(StreamsRepository).to(FakeRepository);
            Container.bind(LogRepository).to(FakeRepository);
            Container.bind(BotArenaRepository).to(FakeRepository);
        }
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", req.get("Origin"));
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, Referer, UserAgent, charset, X-Requested-With, Content-Type, Accept");
            res.status(200);
            next();
        });
        this.app.use("/public", express.static(__dirname + '/public'));
        this.app.engine('html', require('ejs').renderFile);
        this.app.set('views', __dirname + '/public');
        this.app.use(cors());
        if (process.env.NODE_ENV !== "test") {
            this.app.use(morgan('combined'));
        }
        this.initIoc();
        this.configureAuthenticator();
    }

    private configureAuthenticator() {
        this.serviceConfig = Container.get(IConfig);
        const userService = Container.get(UserService);
        const JWT_SECRET: string = this.serviceConfig.getSecret();
        const jwtConfig: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(JWT_SECRET)
        };
        const strategy = new Strategy(jwtConfig, async (payload: any, done: (err: any, user: any) => void) => {
            try {
                const user : UserEntity = await userService.findOne(payload.sub);

                if (!user){
                    done("User not exist", null);
                }
                else {
                    const o = {
                        sub: user.id,
                        roles: user.roles
                    };

                    done(null, o);
                }

            }
            catch (e){
                done(e.message, null);
            }
        });
        const authenticator = new PassportAuthenticator(strategy, {
            authOptions: {
                session: false,
            }
        });

        Server.registerAuthenticator(authenticator, "Bearer");
    }
}