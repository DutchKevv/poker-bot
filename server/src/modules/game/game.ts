import CallBot from '../../bots/call/callBot'
import RandBot from '../../bots/rand/randBot'
import FoldBot from '../../bots/fold/foldBot'
import AIBot from '../../bots/ai/ai.bot'
import { seats, create, MachinePoker } from '../../_vendor/machine-poker/index'
import { IGameObserverData, IPlayer } from './game.inteface'
import { System } from '../system/system'

export enum GameState {
    complete = 'complete',
    tournamentComplete = 'tournamentComplete',
    betAction = 'betAction',
    roundStart = 'roundStart',
    stateChange = 'stateChange',
}

export class Game {

    static GAME_COUNTER = 0

    id = Game.GAME_COUNTER++

    table: MachinePoker
    players: IPlayer[]

    /**
     * machine-poker package uses this instance to emit game state events
     */
    complete = (data: IGameObserverData) => {
        this.emitEvent(GameState.complete, data)
    }

    tournamentComplete = (data: IGameObserverData) => {
        this.emitEvent(GameState.tournamentComplete, data)
    }

    betAction = (data: IGameObserverData) => {
        this.emitEvent(GameState.betAction, data)
    }

    roundStart = (data: IGameObserverData) => {
        this.emitEvent(GameState.roundStart, data)
    }

    stateChange = (data: IGameObserverData) => {
        data.pot = data.players.reduce((pot, player) => pot += player.wagered || 0, 0)
        this.emitEvent(GameState.stateChange, data)
    }

    constructor(private system: System) {}

    create() {
        this.table = create({
            maxRounds: 1000,
        })

        this.players = [
            seats.JsLocal.create(CallBot),
            seats.JsLocal.create(AIBot),
            seats.JsLocal.create(FoldBot),
            seats.JsLocal.create(RandBot),
        ]

        this.table.addPlayers(this.players)
        this.table.addObserver(this)
    }

    start() {
        console.log(33434)
        this.table.start()
    }

    private emitEvent(type: string, data: IGameObserverData) {
        this.system.api.io.emit('game-update', { id: this.id, type, data })
    }
}
