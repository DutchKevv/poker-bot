import { MachinePokerGame } from "../../lib/machine-poker/machine-poker.intefaces"

export interface IBotOptions {
    name?: string
}

export abstract class Bot {
    info: {name?: string} = {}

    constructor(public options?: IBotOptions) {
        this.info.name = options?.name || this.constructor.name
    }

    abstract update(game: MachinePokerGame): void
}
