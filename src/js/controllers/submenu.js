angular
  .module('munchkins')
  .controller('Submenu', function($location, Buildings, Tribe) {
    this.hasTribe = Tribe.total;
    this.totalTribe = Tribe.total;

    let prevNumBuildings = 0;
    this.hasBuildings = function() {
      if (!prevNumBuildings) {
        _.forEach(Buildings.all(), function(b) {
          prevNumBuildings += b.locked ? 0 : 1;
        });
      }
      return prevNumBuildings;
    };

    this.isOn = function(path) {
      return $location.path() === path;
    };
  });
