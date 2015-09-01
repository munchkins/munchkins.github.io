angular
  .module('munchkins')
  .controller('Submenu', function(Tribe) {
    this.tribeTotal = Tribe.total;
  });
