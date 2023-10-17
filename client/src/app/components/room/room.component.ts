import { Component, OnInit } from '@angular/core'
import { Game } from '../../services/game/game'
import { GameService } from '../../services/game/game.service'
import { SocketService } from '../../services/socket/socket.service'



@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

  game: Game

  constructor(private gameService: GameService, private socketService: SocketService) {}

  ngOnInit() {
    this.startGame()
  }

  startGame() {
    this.gameService.create().subscribe((game: Game) => {
      this.game = game

      this.gameService.start(game.id).subscribe((data: any) => {

      })
    })
  }
}
