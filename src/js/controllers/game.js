angular
  .module('munchkins')
  .controller('Game', function($interval, Defaults, Game, Buildings, Resources, Storage) {
    const tickloop = function() {
      Game.ticks++;

      angular.forEach(Resources, function(res) {
        res.value.current += res.rate;
        if (res.value.limit) {
          res.value.current = Math.min(res.value.current, res.value.limit);
        }
      });
    };

    Storage.load();

    $interval(Storage.save, Defaults.SAVE_RATE);
    $interval(tickloop, Defaults.TICK_RATE);
  });
