var MachinePoker = require('machine-poker')
  , LocalSeat = MachinePoker.seats.JsLocal
  , CallBot = require('./bots/callBot')
  , CallBot2 = require('./bots/callBot2')
  , CallBot3 = require('./bots/callBot3')
  , RandBot = require('./bots/randBot')
  , FoldBot = require('./bots/foldBot')
  , app = require('../server')
  , CustomBot = require('./bots/custom.bot')
  , narrator = MachinePoker.observers.narrator
  , fileLogger = MachinePoker.observers.fileLogger('./results.json');

module.exports.create = function () {
  console.log('2323233')
  var table = MachinePoker.create({
    maxRounds: 1000
  });

  var players = [
    LocalSeat.create(CallBot)
    , LocalSeat.create(CustomBot)
    , LocalSeat.create(FoldBot)
    , LocalSeat.create(RandBot)
    , LocalSeat.create(CallBot2)
    , LocalSeat.create(CallBot3)
  ];
  table.addPlayers(players);
  table.start();
  // Add some observers
  // table.addObserver(narrator);
  // table.addObserver(fileLogger);
  table.addObserver({
    // tournamentComplete: console.log,
    // onObserverComplete: console.log,
    complete: data => {
      app.io.emit('game-update', {type: 'complete', data})
    },
    tournamentComplete: data => {
      app.io.emit('game-update', {type: 'tournamentComplete', data})
    },
    betAction: data => {
      app.io.emit('game-update', {type: 'betAction', data})
    },
    roundStart: data => {

      app.io.emit('game-update', {type: 'roundStart', data})
    },
    stateChange: data => {
      let pot = 0
      for (_l = 0, _len3 = data.players.length; _l < _len3; _l++) {
        const player = data.players[_l];
        if (player.wagered != null) {
          pot += player.wagered;
        }
      }

      data.pot = pot
      app.io.emit('game-update', {type: 'stateChange', data})
    }
  });
} ;