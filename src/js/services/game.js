angular
  .module('munchkins')
  .service('Game', function() {
    const game = {
      ticks: 0
    };

    this.all = function() {
      return game;
    };
  });
