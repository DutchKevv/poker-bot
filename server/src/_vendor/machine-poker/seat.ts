import { EventEmitter } from 'events';

class Seat extends EventEmitter {
  opts: any;
  debug: boolean;

  constructor(opts: any) {
    super();
    this.opts = opts || {};
    this.debug = this.opts.debug || false;
  }

  // Override this method and call the callback with an integer
  update(game: any, callback: (value: number) => void) {
    setImmediate(() => callback(-1)); // Default implementation
  }
}

export { Seat };

export function create(id: any, opts: any = {}, callback: (error: any, seat: Seat) => void) {
  const bot = new Seat(opts);
  if (bot.debug) {
    console.log(`Creating seat for - ${id}`);
  }
  callback(null, bot);
}
