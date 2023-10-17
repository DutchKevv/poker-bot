import { Game } from './game'
import { Base } from '../base'

export enum GameState {
    complete = 'complete',
    tournamentComplete = 'tournamentComplete',
    betAction = 'betAction',
    roundStart = 'roundStart',
    stateChange = 'stateChange',
}

export class GameController extends Base {

    games: Game[] = []
    
    createGame(): Game {
        const game = new Game(this.system)
        this.games.push(game)
        game.create()
        return game
    }

    getGameById(id: number): Game | undefined {
        return this.games.find(game => game.id === id)
    }
}
