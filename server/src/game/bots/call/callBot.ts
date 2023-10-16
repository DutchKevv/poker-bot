import { MachinePokerGame } from '../../../lib/machine-poker/machine-poker.intefaces'
import { Bot } from '../bot'

export class CallBot extends Bot {

    update(game: MachinePokerGame) {
        if (game.state !== 'complete') {
            return game.betting.call
        }
    }
}

export default function() {
    return new CallBot()
}