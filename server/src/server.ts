import { Socket } from "socket.io";
import express from "express";
import { join } from "path";
import { Game } from "./game/game";
import { Server } from "socket.io";
import http from "http";

const PUBLIC_PATH = join(__dirname, "../public/app/");

export class System {

  app: express.Application
  server: http.Server
  io: Server

  games: Game[] = []

  constructor() {
    this.initExpress()
  }

  createGame() {
    const game = new Game(this)
    this.games.push(game)
    game.create()
    game.start()
  }

  initExpress() {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = new Server(this.server)

    this.app.use(express.static(PUBLIC_PATH));

    this.app.get("/", (req, res) => {
      res.sendFile(join(PUBLIC_PATH, "/index.html"));
    });

    this.app.post("/api/game/start", (req, res) => {
      this.createGame()
      res.sendStatus(204)
    });

    this.io.on("connection", (socket: Socket) => {
      console.log("a user connected");
    });

    this.server.listen(3000, () => {
      console.log("listening on *:3000");
    });
  }
}

export const system = new System
