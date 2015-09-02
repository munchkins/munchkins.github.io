angular
  .module('munchkins')
  .service('Buildings', function() {
    const buildings = {
      meadow: {
        name: 'Flower Meadow',
        description: 'A naturally growing field of flowers',
        locked: true,
        increase: 1.1,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            flowers: { value: 100, rate: 0 }
          }
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01 }
          }
        }
      },
      shelter: {
        name: 'Shelter',
        description: 'A basic shelter made from flower stems',
        locked: true,
        increase: 1.1,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            stems: { value: 100, rate: 0 }
          }
        },
        provides: {
          tribe: 1
        }
      }
    };

    this.activeTotal = function() {
      let total = 0;
      _.forEach(buildings, function(building) {
        total += building.locked ? 0 : 1;
      });
      return total;
    };

    this.all = function() {
      return _.filter(buildings, {});
    };

    this.get = function(key) {
      return buildings[key];
    };

    this.save = function(to) {
      _.forEach(buildings, function(b, k) {
        to[k] = {
          value: b.value,
          locked: b.locked
        };
      });
    };

    this.load = function(from) {
      _.forEach(from, function(b, k) {
        const building = buildings[k];
        building.value = b.value;
        building.locked = b.locked;
      });
    };
  });
