angular
  .module('munchkins')
  .service('Tribe', function() {
    const tribe = {
      free: 0,
      types: {
        farmer: {
          name: 'Farmer',
          description: 'A farmer works the meadows for additional production of producable resources',
          locked: true,
          value: { current: 0 },
          requires: {
            buildings: {
              meadow: { value: 1 }
            },
            tribe: 1
          },
          provides: {
            resources: {
              flowers: { value: 0, rate: 0.01, hyper: true },
              rocks: { value: 0, rate: 0.001, hyper: true },
              food: { value: 0, rate: -0.001 }
            }
          }
        },
        tooler: {
          name: 'Tool Maker',
          description: 'The tribe member creates rock tools for use in hunting, cooking and farming',
          locked: true,
          value: { current: 0 },
          requires: {
            buildings: {
              quarry: { value: 1 }
            },
            tribe: 1
          },
          provides: {
            resources: {
              tools: { value: 0, rate: 0.0125, hyper: true },
              rocks: { value: 0, rate: -0.025 },
              food: { value: 0, rate: -0.001 }
            }
          }
        }
      }
    };

    this.all = function() {
      return _.filter(tribe.types, {});
    };

    this.add = function(number) {
      tribe.free += number;
    };

    this.free = function() {
      return tribe.free;
    };

    this.total = function() {
      let count = 0;
      _.forEach(tribe.types, function(type) {
        count += type.value.current;
      });
      return tribe.free + count;
    };

    this.save = function(to) {
      to.free = tribe.free;
      to.types = {};
      _.forEach(tribe.types, function(type, key) {
        to.types[key] = {
          locked: type.locked,
          value: type.value
        };
      });
    };

    this.load = function(from) {
      tribe.free = from.free || tribe.free;
      _.forEach(from.types, function(t, k) {
        const type = tribe.types[k];
        type.locked = t.locked;
        type.value = t.value;
      });
    };
  });
