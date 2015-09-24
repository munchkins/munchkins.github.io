angular
  .module('munchkins')
  .controller('Buildings', function(Actions, Buildings) {
    this.buildings = Buildings.all();

    this.buy = Actions.buy;

    this.isBuyable = Actions.isBuyable;
    this.hasRequires = Actions.hasRequires;
    this.hasProvides = Actions.hasProvides;

    this.requires = Actions.requires;
    this.provides = Actions.provides;
  });
