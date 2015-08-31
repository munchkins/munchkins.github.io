angular
  .module('munchkins')
  .controller('Game', function($interval, Defaults, Game, Buildings, Resources, Storage) {
    const tickloop = function() {
      Game.ticks++;

      angular.forEach(Resources, function(key, res) {
        console.log(key, res);
        res.value.current += res.rate;
      });
    };

    Storage.load();
    $interval(Storage.save, Defaults.SAVE_RATE);
    $interval(tickloop, Defaults.TICK_RATE);
  });
