import { MachinePokerGame } from "../../_vendor/machine-poker/machine-poker.intefaces";
import { Bot } from "../bot";

export class AIBot extends Bot  {

    update(game: MachinePokerGame) {
        if (game.state !== 'complete') {
            return game.betting.call
        }
    }
}

export default function() {
    return new AIBot()
}