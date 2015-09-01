angular
  .module('munchkins')
  .controller('Crafting', function(Buildings) {
    this.crafting = Buildings.allCrafting();

    this.buy = Buildings.buy;
    this.isBuyable = Buildings.isBuyable;
    this.prices = Buildings.prices;
  });
