angular
  .module('munchkins')
  .controller('Topmenu', function(Storage) {
    this.save = Storage.save;
  });
