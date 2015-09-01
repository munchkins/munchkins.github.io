angular
  .module('munchkins')
  .service('Game', function() {
    const game = {
      ticks: 0
    };

    this.all = function() {
      return game;
    };

    this.save = function(to) {
      to.ticks = game.ticks;
    };

    this.load = function(from) {
      game.ticks = from.ticks || game.ticks;
    };
  });
