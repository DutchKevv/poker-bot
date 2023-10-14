import { Injectable } from '@angular/core';
// import { WebSocketService } from '../utils/web-socket.service';
import { StompService } from '../utils/stomp.service';
import { SocketService } from '../../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class WsRoomService {


  constructor(private socketService: SocketService) {

  }

  public connect(server, port) {
    // this.setBasicConfig(server, port, '/');
    // this.startConnection();
  }

}
