angular
  .module('munchkins')
  .controller('Resources', function(Resources) {
    this.resources = Resources.all();
  });
