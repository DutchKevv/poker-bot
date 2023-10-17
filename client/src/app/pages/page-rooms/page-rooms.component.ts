import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { Game } from '../../services/game/game';

@Component({
  selector: 'app-page-rooms',
  templateUrl: './page-rooms.component.html',
  styleUrls: ['./page-rooms.component.scss']
})
export class PageRoomsComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit() {
  }

  add() {
    this.gameService.create().subscribe((game: Game) => {

      this.gameService.start(game.id).subscribe((data: any) => {

      })
    })
  }

  stopAll() {

  }
}
