import { Injectable } from '@angular/core'
import { Game } from './game'
import { HttpClient } from '@angular/common/http'
import { Observable, map, tap } from 'rxjs'
import { SocketService } from '../socket/socket.service'
import { IGameUpdate } from './game.interface'

@Injectable({
  providedIn: 'root',
})
export class GameService {
  games: Game[] = []

  constructor(private httpClient: HttpClient, private socketService: SocketService) {
    this.init()
  }

  init() {
    this.getRunningGames().subscribe()
    this.socketService.socket.on('game-update', (data: IGameUpdate) => {
      this.onGameUpdate(data)
    })
  }

  create(): Observable<Game> {
    return this.httpClient.post('api/game/create', {}).pipe(
      map((data: any) => {
        const game = new Game(data.id, data)
        this.games.push(game)

        return game
      })
    )
  }

  start(id: number): Observable<any> {
    this.getById(id)?.start()
    return this.httpClient.post('api/game/start', { id })
  }

  getById(id: number) {
    return this.games.find((game) => game.id === id)
  }

  removeAll() {
    return this.httpClient.delete('api/game', {}).pipe(
      tap(() => {
        this.games = []
      })
    )
  }

  private onGameUpdate(data: IGameUpdate) {
    this.getById(data.id)?.events.push(data)
  }

  private getRunningGames() {
    return this.httpClient.get('api/game', {}).pipe(
      tap((games: any) => {
        games.forEach(gameData => {
          const game = new Game(gameData.id, gameData)
          this.games.push(game)
        })

      })
    )
  }
}