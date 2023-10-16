import { Game } from '../game/game'
import { AIScreenReader } from '../screen-reader/screen-reader'
import { SystemApi } from './system.api'
import { ISystemOptions } from './system.interface'

export class System {
    // current active games
    games: Game[] = []

    // read from screen
    screenReader: AIScreenReader

    // frontend API's
    api: SystemApi

    // THE system config...
    config: ISystemOptions

    constructor(options: ISystemOptions) {
        // TODO: convert options to config
        this.config = options
    }

    startApi() {
        this.api = new SystemApi(this)
        this.api.init()
    }

    startScreenReader() {
        this.screenReader = new AIScreenReader(this)
        this.screenReader.start()
    }

    createGame(): Game {
        const game = new Game(this)
        this.games.push(game)
        game.create()
        return game
    }
}
