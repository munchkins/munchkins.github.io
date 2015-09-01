angular
  .module('munchkins')
  .controller('Submenu', function($location, Buildings, Tribe) {
    this.totalTribe = Tribe.total;
    this.totalBuildings = Buildings.activeTotal;

    this.isOn = function(path) {
      return $location.path() === path;
    };
  });
