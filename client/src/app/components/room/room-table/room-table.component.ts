import { Component, Input } from '@angular/core';
import { Game } from '../../../services/game/game';
import { ICard } from '../../../services/game/game.interface';

@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  styleUrls: ['./room-table.component.scss']
})
export class RoomTableComponent {
  @Input({ required: true }) game: Game

  getSorted(players) {
    return players
  }
}
