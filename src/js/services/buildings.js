angular
  .module('munchkins')
  .service('Buildings', function() {
    const buildings = {
      meadow: {
        name: 'Flower Meadow',
        description: 'A naturally growing field of flowers',
        craft: false,
        locked: true,
        increase: 1.1,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            flowers: { value: 100 }
          }
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01 }
          }
        }
      }
    };

    this.all = function() {
      return _.filter(buildings, {});
    };

    this.get = function(key) {
      return buildings[key];
    };
  });
