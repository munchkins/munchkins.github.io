angular
  .module('munchkins')
  .controller('Subbar', function($location, Buildings, Tribe) {
    this.totalBuildings = Buildings.activeTotal;
    this.totalTribe = Tribe.total;

    this.allocTribe = function() {
      return Tribe.total() - Tribe.free();
    };

    this.isOn = function(path) {
      return $location.path() === path;
    };
  });
