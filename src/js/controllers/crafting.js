angular
  .module('munchkins')
  .controller('Crafting', function(Actions, Crafting) {
    this.crafting = Crafting.all();

    this.buy = Actions.buy;
    this.isBuyable = Actions.isBuyable;
    this.prices = Actions.prices;
  });
