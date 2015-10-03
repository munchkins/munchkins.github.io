angular
  .module('munchkins')
  .controller('Crafting', function(Actions, Crafting) {
    this.crafting = Crafting.all();
    this.actions = Actions;
  });
