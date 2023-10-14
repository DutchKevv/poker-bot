import { Component, OnInit, Input } from '@angular/core';
import { ICard } from '../room/room.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input({required: true})
  card: ICard

  constructor() { }

  ngOnInit() {
  }

}
