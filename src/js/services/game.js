angular
  .module('munchkins')
  .service('Game', function() {
    const values = {
      ticks: 0
    };

    this.get = function() {
      return values;
    };
  });
