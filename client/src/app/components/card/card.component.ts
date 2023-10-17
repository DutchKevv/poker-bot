import { Component, Input } from '@angular/core'
import { ICard } from '../../services/game/game.interface'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true })
  card: ICard
}
