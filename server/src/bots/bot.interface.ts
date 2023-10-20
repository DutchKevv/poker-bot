import { MachinePokerGame } from "../_vendor/machine-poker/machine-poker.intefaces"

export interface IBotOptions {
    name?: string
    epochs?: number
}

export interface IBot {
    update(game: MachinePokerGame): void
}
