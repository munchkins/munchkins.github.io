angular
  .module('munchkins')
  .controller('Buildings', function(Buildings) {
    this.buildings = Buildings.allBuildings();

    this.buy = Buildings.buy;
    this.isBuyable = Buildings.isBuyable;
    this.prices = Buildings.prices;
  });
