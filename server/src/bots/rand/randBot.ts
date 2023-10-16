import { MachinePokerGame } from "../../_vendor/machine-poker/machine-poker.intefaces";
import { Bot, IBot } from "../bot";

export class RandBot extends Bot implements IBot  {

  update(game: MachinePokerGame) {
    if (game.state !== "complete") {
      var heads = Math.random() > 0.5;
      if (heads) {
        return game.betting.raise;
      } else {return game.betting.call}
    }
  }
}

export default function() {
  return new RandBot()
}