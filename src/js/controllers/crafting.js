angular
  .module('munchkins')
  .controller('Crafting', function(Actions, Crafting) {
    this.crafting = Crafting.all();

    this.buy = Actions.buy;

    this.isBuyable = Actions.isBuyable;
    this.hasRequires = Actions.hasRequires;
    this.hasProvides = Actions.hasProvides;

    this.requires = Actions.requires;
    this.provides = Actions.provides;
  });
