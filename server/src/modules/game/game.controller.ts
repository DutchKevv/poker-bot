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
    
    create(): Game {
        const game = new Game(this.system)
        this.games.push(game)
        game.create()
        return game
    }

    getById(id: number): Game | undefined {
        return this.games.find(game => game.id === id)
    }

    stopAll() {
        this.games.forEach(game => game.stop())
        this.games = []
    }
}
