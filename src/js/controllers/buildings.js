angular
  .module('munchkins')
  .controller('Buildings', function(Actions, Buildings) {
    this.buildings = Buildings.all();

    this.buy = Actions.buy;
    this.isBuyable = Actions.isBuyable;
    this.prices = Actions.prices;
  });
