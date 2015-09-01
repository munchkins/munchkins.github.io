angular
  .module('munchkins')
  .controller('Resources', function(Craftables, Resources) {
    this.craftables = Craftables;
    this.resources = Resources;
  });
