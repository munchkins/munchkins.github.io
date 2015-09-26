angular
  .module('munchkins')
  .controller('Topbar', function(Game) {
    this.save = Game.save;
    this.wipe = Game.wipe;
    this.calendar = Game.calendar;
    this.bonus = Game.bonus;
  });
