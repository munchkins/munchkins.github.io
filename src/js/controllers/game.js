angular
  .module('munchkins')
  .controller('Game', function($interval, Defaults, Buildings, Game, Resources, Storage) {
    $interval(Storage.save, Defaults.SAVE_RATE);

    $interval(function() {

    }, Defaults.TICK_RATE);
  });
