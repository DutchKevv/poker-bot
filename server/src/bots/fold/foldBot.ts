import { MachinePokerGame } from "../../_vendor/machine-poker/machine-poker.intefaces";
import { Bot } from "../bot";

export class FoldBot extends Bot  {

  update(game: MachinePokerGame) {
    if (game.state !== "complete") {
      return 0
    }
  }
}

export default function() {
  return new FoldBot()
}