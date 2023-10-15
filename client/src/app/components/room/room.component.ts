import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Fireworks } from 'fireworks-js';

export interface IPlayer {
  name: string;
  chips: number;
  blind: number;
  cards: ICard[];
  winning: boolean;
  action: string;
  state: string;
}

export interface IGameUpdate {
  type: string;
  data: IGameUpdateState;
}

export interface IGameUpdateState {
  players: IPlayer[];
  community: string[];
  chips: number;
  pot: number;
  winners: any[];
  bot?: {
    name: string;
  };
  state: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
  _actions: {
    'pre-flop': any[];
    flop: any[];
  };
  wagered: number;
}

export interface ICard {
  rank: string;
  suit: string;
  color: string;
}

const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const suits = {
  h: '♥︎',
  s: '♠︎',
  d: '♣︎',
  c: '♦︎',
};

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent {
  players: IPlayer[] = [];
  cards: ICard[] = [];
  chips: number = 0;
  eventSpeed = 550;
  logs: any[] = [];
  currentState: string;
  isRunning = false;
  pauseWin = false;

  playerIndex = []

  private events: IGameUpdate[] = [];
  private eventInterval: any;
  private winnerDelay = 3000;
  private winnerDelayTimeout;
  private fireworks = [];

  constructor(
    private socketService: SocketService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.socketService.socket.on('game-update', (data: IGameUpdate) => {
      this.events.push(data);
    });

    this.startGame()
  }

  startGame() {
    this.httpClient.post('api/game/start', {}).subscribe((data: any) => {
      this.start()
    });
  }

  communityMapper(community: string) {
    return {
      rank: community[0],
      suit: suits[community[1]],
      color: ['♥︎', '♦︎'].includes(suits[community[1]]) ? 'red' : 'black',
    };
  }

  onChangeSpeed(event: any) {
    this.eventSpeed = Math.abs(event.target.value * 10 - 999);
    this.start();
  }

  stop() {
    this.isRunning = false;
    clearTimeout(this.winnerDelayTimeout);
    clearInterval(this.eventInterval);
  }

  start() {
    this.stop();
    this.isRunning = true;

    this.eventInterval = setInterval(() => this.onEventTick(), this.eventSpeed);
    this.onEventTick();
  }

  togglePauseWin(state: boolean) {
    this.pauseWin = state;
  }

  getSorted(players) {
    return players;
    // return [...players].sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
  }

  private onEventTick() {
    const data = this.events.shift();

    if (!data) {
      return;
    }
    switch (data.type) {
      case 'roundStart':
        this.stopFireworks();
        // this.players = data.data.players;
        // this.players = [...data.data.players].sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
        // .sort((a, b) =>
        //   a.name.localeCompare(b.name)
        // );
        this.cards = data.data.community.map((community) =>
          this.communityMapper(community)
        );
        this.players.forEach((player) => {
          // player.active = true
        });
        this.logs.unshift({ text: 'Round started' });
        break;
      case 'stateChange':
        this.currentState = data.data.state;

        // put player in correct position
        if (!this.players.length) {
          this.players = data.data.players;
        } else {
          this.players[0] = data.data.players.find(player => player.name === this.players[0]?.name)
          this.players[1] = data.data.players.find(player => player.name === this.players[1]?.name)
          this.players[2] = data.data.players.find(player => player.name === this.players[2]?.name)
          this.players[3] = data.data.players.find(player => player.name === this.players[3]?.name)
          this.players[4] = data.data.players.find(player => player.name === this.players[4]?.name)
          this.players[5] = data.data.players.find(player => player.name === this.players[5]?.name)

          this.players = this.players.filter(Boolean)
        }

        // this.players = data.data.players.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
        this.players.forEach((player) => {
          player.cards = player.cards.map((card: any) =>
            this.communityMapper(card)
          );
        });

        this.cards = data.data.community.map((community) =>
          this.communityMapper(community)
        );
        this.chips = data.data.pot;
        break;
      case 'betAction':
        this.players.forEach((player) => (player.action = null));
        const player = this.getPlayerByName(data.data.bot.name);
        const action =
          data.data?._actions[this.currentState]?.[
            data.data._actions[this.currentState]?.length - 1
          ];

        player.chips = data.data?.chips;
        player.action = action.type;

        if (player.action === 'raise' || player.action === 'call') {
          this.chips += action.bet;
          if (player.action === 'raise') {
            player.action += ' (' + action.bet + ')';
          }
        }

        this.logs.unshift({
          player,
          text: `${
            action.type + (action.type === 'raise' ? `(${action.bet})` : '')
          }`,
        });
        break;
      case 'complete':
        data.data.winners.forEach((winner) => {
          const player = this.getPlayerByName(
            data.data.players[winner.position].name
          );
          player.winning = true;
          this.logs.unshift({
            text: `Winner: ${
              data.data.players[winner.position].name
            }. Amount: ${winner.amount}`,
          });
          this.startFireworks(player);
        });

        this.stop();

        this.logs.unshift({ text: `-------------------------------` });

        if (!this.pauseWin) {
          this.winnerDelayTimeout = setTimeout(
            () => this.start(),
            (this.winnerDelay * this.eventSpeed) / 1000
          );
        }

        break;
      case 'tournamentComplete':
        console.info('tournamentComplete')
        break;
    }
    ;
  }

  private getPlayerByName(name: string) {
    return this.players.find((player) => player.name === name);
  }

  private stopFireworks() {
    this.fireworks.forEach((firework) => firework.stop());
  }

  private startFireworks(player: any) {
    // this.fireworks?.stop()

    const container = document.querySelector(
      '#player-' + player.name + ' .fireworks'
    );
    const fireworks = new Fireworks(container, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360,
      },
      delay: {
        min: 30,
        max: 60,
      },
      rocketsPoint: {
        min: 50,
        max: 50,
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3,
        },
        trace: {
          min: 1,
          max: 2,
        },
      },
      brightness: {
        min: 50,
        max: 80,
      },
      decay: {
        min: 0.015,
        max: 0.03,
      },
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    });

    fireworks.start();

    this.fireworks.push(fireworks);
  }
}
