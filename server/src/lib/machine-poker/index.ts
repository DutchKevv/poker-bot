import { EventEmitter } from 'events';
const { Player: BinionsPlayer, Game: BinionsGame, betting: binionsBetting } = require('binions')

export const seats = {
  JsLocal: require('./seats/js_local'),
  Remote: require('./seats/remote'),
};

export const betting = binionsBetting;

export const observers = {
  fileLogger: require('./observers/file_logger'),
  logger: require('./observers/logger'),
  narrator: require('./observers/narrator'),
};

export function create(betting: any) {
  return new MachinePoker(betting);
}

export class MachinePoker extends EventEmitter {
  private opts: any;
  private chips: number;
  private maxRounds: number;
  private betting: any;
  private observers: any[];
  private players: any[];
  private currentRound: number;

  constructor(opts: any) {
    super();
    this.opts = opts || {};
    this.chips = this.opts.chips || 1000;
    this.maxRounds = this.opts.maxRounds || 100;
    this.betting = this.opts.betting || binionsBetting.noLimit(10, 20);
    this.observers = [];
    this.players = [];
    this.currentRound = 1;
  }

  addObserver(obs: { [key: string]: any }) {
    this.observers.push(obs);
    const events = ['roundStart', 'stateChange', 'complete', 'tournamentComplete', 'betAction'];
    events.forEach((event) => {
      if (obs[event]) {
        this.on(event, obs[event]);
      }
    });
  }

  addPlayers(bots: any[]) {
    const names: string[] = [];
    bots.forEach((bot) => {
      const name = botNameCollision(names, bot.name);
      names.push(name);
      this.addPlayer(new BinionsPlayer(bot, this.chips, name));
    });
  }

  addPlayer(player: any) {
    player.on('betAction', (action: any, amount: any, err: any) => {
      this.emit('betAction', player, action, amount, err);
    });
    this.players.push(player);
  }

  run() {
    const game = new BinionsGame(this.players, this.betting, this.currentRound);
    game.on('roundStart', () => {
      this.emit('roundStart', game.status(BinionsGame.STATUS.PRIVILEGED));
    });
    game.on('stateChange', (state: any) => {
      this.emit('stateChange', game.status(BinionsGame.STATUS.PRIVILEGED));
    });
    game.once('complete', (status: any) => {
      this.emit('complete', game.status(BinionsGame.STATUS.PRIVILEGED));
      this.currentRound++;
      const numPlayers = this.players.filter((p) => p.chips > 0).length;
      if (this.currentRound > this.maxRounds || numPlayers < 2) {
        this.emit('tournamentComplete', this.players);
        this.close();
      } else {
        this.players = [...this.players.slice(1), this.players[0]];
        setImmediate(() => this.run());
      }
    });
    game.run();
  }

  start() {
    this.players.sort(() => Math.random() > 0.5 as any);
    this.run();
  }

  private close(callback?: () => any) {
    let waitingOn = 0;
    this.observers.forEach((obs: { [key: string]: any }) => {
      if (obs['onObserverComplete']) {
        waitingOn++;
        obs.onObserverComplete(() => {
          waitingOn--;
          if (waitingOn <= 0) {
            callback && callback();
          }
        });
      }
    });
    if (waitingOn <= 0) {
      this.emit('tournamentClosed');
      callback && callback();
    }
  }
}

function botNameCollision(existing: string[], name: string, idx: number = 1) {
  let altName = name;
  if (idx > 1) {
    altName = `${name} #${idx}`;
  }
  if (existing.indexOf(altName) >= 0) {
    return botNameCollision(existing, name, idx + 1);
  }
  return altName;
}
