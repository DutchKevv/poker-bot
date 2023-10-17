import { Component, Input, OnInit } from '@angular/core'
import { Game } from '../../../services/game/game'

@Component({
    selector: 'app-room-controls',
    templateUrl: './room-controls.component.html',
    styleUrls: ['./room-controls.component.scss'],
})
export class RoomControlsComponent {
    @Input({ required: true }) game: Game

    onChangeSpeed(event: any) {
        this.game.eventSpeed = Math.abs(event.target.value * 10 - 999)
        this.game.start()
    }

    togglePauseWin(state: boolean) {
        this.game.pauseWin = state
    }
}
