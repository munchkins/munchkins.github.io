angular
  .module('munchkins')
  .controller('Submenu', function($location, Tribe) {
    this.tribeTotal = Tribe.total;

    this.isOn = function(path) {
      return $location.path() === path;
    };
  });
