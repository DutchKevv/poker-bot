import CallBot from './bots/call/callBot'
import RandBot from './bots/rand/randBot'
import FoldBot from './bots/fold/foldBot'
import AIBot from './bots/ai/ai.bot'
import { System } from '../server'
import { seats, create } from '../lib/machine-poker/index'

const LocalSeat = seats.JsLocal

export interface IGameObserverData {
    type: string
    players: {
        wagered?: number
    }[]
    pot?: number
}

export interface IPlayer {
    bot: any
    chips: number
    wagered: number
    payout: number
    ante: number
    blind: number
    name: string
    state: string
    hand: any
    cards: any[]
    reset(): void
}

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
