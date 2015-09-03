angular
  .module('munchkins.controllers')
  .controller('Resources', function(Resources) {
    this.resources = Resources.all();
  });
