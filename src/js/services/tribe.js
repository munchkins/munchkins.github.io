angular
  .module('munchkins')
  .service('Tribe', function() {
    const tribe = {
      free: 0
    };

    this.total = function() {
      return tribe.free;
    };

    this.save = function(to) {
      to.free = tribe.free;
    };

    this.load = function(from) {
      tribe.free = from.free || tribe.free;
    };
  });
