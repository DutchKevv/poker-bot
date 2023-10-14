import { Component } from '@angular/core';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pokerBot';

  constructor(private socketService: SocketService) {

  }

  ngOnInit() {
    this.socketService.init()

    this.socketService.socket.on('game-data', (data: any) => {
      console.log(data)
    })
  }
}
