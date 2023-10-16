import CallBot from '../../bots/call/callBot'
import RandBot from '../../bots/rand/randBot'
import FoldBot from '../../bots/fold/foldBot'
import AIBot from '../../bots/ai/ai.bot'
import { seats, create } from '../../_vendor/machine-poker/index'
import { IGameObserverData, IPlayer } from './game.inteface'
import { System } from '../system/system'

const LocalSeat = seats.JsLocal

export class Game {
    table: any
    players: IPlayer[]

    constructor(private system: System) {}

    start() {
        this.table.start()
    }

    stop() {
        this.table.stop()
    }

    create() {
        this.table = create({
            maxRounds: 1000,
        })

        this.players = [
            LocalSeat.create(CallBot),
            LocalSeat.create(AIBot),
            LocalSeat.create(FoldBot),
            LocalSeat.create(RandBot),
            // LocalSeat.create(CustomBot({ name: 'CustomBot' })),
            // LocalSeat.create(FoldBot({ name: 'FoldBot' })),
            // LocalSeat.create(RandBot({ name: 'RandBot' })),
            // LocalSeat.create(CallBot({ name: 'CallBot2' })),
            // LocalSeat.create(CallBot({ name: 'CallBot3' })),
        ]

        this.table.addPlayers(this.players)

        const observers = {
            complete: (data: IGameObserverData) => {
                this.system.io.emit('game-update', { type: 'complete', data })
            },
            tournamentComplete: (data: IGameObserverData) => {
                this.system.io.emit('game-update', { type: 'tournamentComplete', data })
            },
            betAction: (data: IGameObserverData) => {
                this.system.io.emit('game-update', { type: 'betAction', data })
            },
            roundStart: (data: IGameObserverData) => {
                this.system.io.emit('game-update', { type: 'roundStart', data })
            },
            stateChange: (data: IGameObserverData) => {
                let pot = 0
                for (let i = 0; i < data.players.length; i++) {
                    const player = data.players[i]
                    if (player.wagered != null) {
                        pot += player.wagered
                    }
                }

                data.pot = pot
                this.system.io.emit('game-update', { type: 'stateChange', data })
            },
        }

        this.table.addObserver(observers)
    }
}
