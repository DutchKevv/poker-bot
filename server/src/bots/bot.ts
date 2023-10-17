import { MachinePokerGame } from "../_vendor/machine-poker/machine-poker.intefaces"
import { IBotOptions } from "./bot.interface"

export abstract class Bot {
    info: {name?: string} = {}

    constructor(public options?: IBotOptions) {
        this.info.name = options?.name || this.constructor.name
    }

    abstract update(game: MachinePokerGame): void
}
