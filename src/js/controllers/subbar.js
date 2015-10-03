angular
  .module('munchkins')
  .controller('Subbar', function($location, Buildings, Tribe) {
    this.totalBuildings = () => Buildings.activeTotal();
    this.totalTribe = () => Tribe.total();
    this.allocTribe = () => Tribe.allocated();

    this.isOn = function(path) {
      return $location.path() === path;
    };
  });
