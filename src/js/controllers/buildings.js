angular
  .module('munchkins')
  .controller('Buildings', function(Actions, Buildings) {
    this.buildings = Buildings.all();
    this.actions = Actions;
  });
