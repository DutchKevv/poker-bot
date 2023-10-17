import { Socket, Server } from "socket.io";
import express from "express";
import { json } from "body-parser";
import http from "http";
import gameRouter from "../game/game.routes";
import { Base } from "../base";

export class SystemApi extends Base {
    
    app: express.Application
    server: http.Server
    io: Server

    init() {
        const port = this.system.config.api.port
        const host = this.system.config.api.host
        const assets = this.system.config.api.public

        // create express app + websockets
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server)
    
        this.app.use(express.static(assets))
        this.app.use(json())

        // set routes
        gameRouter(this.system)
    
        this.io.on("connection", (socket: Socket) => {
          console.log("a user connected")
        });
    
        this.server.listen(port, host, () => {
          console.info(`listening on ${host}:${port}`)
        });
    }
}