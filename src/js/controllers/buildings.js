angular
  .module('munchkins')
  .controller('Buildings', function(Buildings, Resources) {
    this.buildings = Buildings;
    this.resources = Resources;
  });
