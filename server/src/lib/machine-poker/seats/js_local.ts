import fs from 'fs';
import request from 'request';
import crypto from 'crypto';
import { Seat } from '../seat';

const tmpDir = __dirname + '/../../tmp';

export class JsLocal extends Seat {
  debug: boolean;
  loaded: boolean;
  private player: any;
  private playerInfo: any;
  private name: string;

  constructor(opts: any) {
    super(opts);
    super.opts = opts || {};
    this.debug = !!this.opts.debug;
    this.loaded = false;
  }

  setup(module: any) {
    this.player = module;
    this.playerInfo = module.info || {};
    this.name = this.playerInfo.name || 'Unnamed';
    this.setupFinished();
  }

  setupFinished(err?: any) {
    this.loaded = true;
    this.emit('ready');
  }

  update(game: any, callback: (error: any, result: any) => void) {
    let result: any;
    let startTime = 0
    if (this.debug) {
      startTime = Date.now();
    }
    result = this.player.update(game);
    if (this.debug) {
      console.log(`Execution of "${this.name}" took ${Date.now() - startTime} ms.`);
    }
    setImmediate(() => callback(null, result));
  }
}

export function create(id: any, opts: any, callback: (error: any, bot: JsLocal) => void) {
  if (arguments.length === 2) {
    callback = arguments[arguments.length - 1];
    opts = {};
  }
  const bot = new JsLocal(opts);
  if (typeof id === 'function') {
    bot.setup(new id());
  } else {
    if (bot.debug) {
      console.log(`Creating bot for - ${id}`);
    }
    retrieveBot(id, (err, mod) => {
      if (err) {
        throw err;
      }
      bot.setup(new mod());
      callback(null, bot);
    });
  }
  return bot;
}

function retrieveBot(id: string, callback: (error: any, mod: any) => void) {
  let mod: any = null;
  let err: any = null;
  if (id.match(/^https?/)) {
    const shasum = crypto.createHash('sha1');
    let name: string | null = null;
    return request(id, (err, response, body) => {
      const fileName = shasum.update(body).digest('hex');
      const filePath = `${tmpDir}/${fileName}`;
      if (err) {
        return callback(err, mod);
      } else {
        return fs.writeFile(filePath, body, (err) => {
          try {
            mod = require(filePath);
          } catch (e) {
            err = e as any;
          }
          callback(err, mod);
        });
      }
    });
  } else {
    try {
      mod = require(`${process.cwd()}/${id}`);
    } catch (e) {
      err = e;
    }
    callback(err, mod);
  }
}