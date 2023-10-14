module.exports = function () {

  var info = {
    name: "CallBot2"
  };

  function update(game) {
    if (game.state !== "complete") {
      return game.betting.call
    }
  };

  return { update: update, info: info }

}
