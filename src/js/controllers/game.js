angular
  .module('munchkins.controllers')
  .controller('Game', function($interval, Const, Buildings, Game, Resources, Storage) {
    $interval(Storage.save, Const.SAVE_RATE);

    $interval(function() {

    }, Const.TICK_RATE);
  });
