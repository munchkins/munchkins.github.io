angular
  .module('munchkins')
  .service('Tribe', function() {
    const tribe = {
      free: 0,
      types: {
        farmer: {
          unlocked: false,
          value: 0,
          requires: {
          }
        }
      }
    };

    this.add = function(number) {
      tribe.free += number;
    };

    this.total = function() {
      let count = 0;
      _.forEach(tribe.types, function(type) {
        count += type.value;
      });
      return tribe.free + count;
    };

    this.save = function(to) {
      to.free = tribe.free;
      to.types = {};
      _.forEach(tribe.types, function(type, key) {
        to.types[key] = {
          unlocked: type.unlocked,
          value: type.value
        };
      });
    };

    this.load = function(from) {
      tribe.free = from.free || tribe.free;
      _.forEach(from.types, function(type, key) {
        tribe[key].unlocked = type.unlocked;
        tribe[key].value = type.value;
      });
    };
  });
