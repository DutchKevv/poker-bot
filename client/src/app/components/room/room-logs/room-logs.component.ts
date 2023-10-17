import { Component, Input, OnInit } from '@angular/core';
import { Game } from '../../../services/game/game';

@Component({
  selector: 'app-room-logs',
  templateUrl: './room-logs.component.html',
  styleUrls: ['./room-logs.component.scss']
})
export class RoomLogsComponent implements OnInit {

  @Input({ required: true }) game: Game

  ngOnInit() {
  }

}
