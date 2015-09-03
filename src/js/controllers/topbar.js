angular
  .module('munchkins.controllers')
  .controller('Topbar', function(Game) {
    this.save = Game.save;
    this.calendar = Game.calendar;
  });
