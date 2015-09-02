angular
  .module('munchkins')
  .controller('Tribe', function(Actions, Tribe) {
    this.total = Tribe.total;
    this.free = Tribe.free;
    this.types = Tribe.all();

    this.buy = Actions.buy;
    this.isBuyable = Actions.isBuyable;
    this.prices = Actions.prices;
  });
