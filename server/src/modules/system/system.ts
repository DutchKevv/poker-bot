import { GameController } from '../game/game.controller'
import { AIScreenReader } from '../screen-reader/screen-reader'
import { SystemApi } from './system.api'
import { ISystemOptions } from './system.interface'

export class System {

    // read from screen
    screenReader: AIScreenReader

    // frontend API's
    api: SystemApi

    // THE system config...
    config: ISystemOptions


    gameController = new GameController(this)

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
}
