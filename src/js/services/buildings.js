angular
  .module('munchkins')
  .service('Buildings', function() {
    const buildings = {
      meadow: {
        name: 'Meadow',
        description: 'A naturally growing field of flowers which can be harvested',
        locked: true,
        increase: 1.11,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            flowers: { value: 100, rate: 0 }
          }
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01 },
            rocks: { value: 0, rate: 0.001 }
          }
        }
      },
      shelter: {
        name: 'Shelter',
        description: 'A basic shelter made from flower stems with space for one Munchkin',
        locked: true,
        increase: 1.11,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            stems: { value: 100, rate: 0 }
          }
        },
        provides: {
          tribe: 1
        }
      },
      quarry: {
        name: 'Rock Quarry',
        description: 'An area where rocks can be harvested for use in buildings and tools',
        locked: true,
        increase: 1.11,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            rocks: { value: 50, rate: 0 }
          }
        },
        provides: {
          resources: {
            rocks: { value: 0, rate: 0.01 }
          }
        }
      },
      hut: {
        name: 'Hut',
        description: 'A rock and stem shelter that has space for two additional Munchkins',
        locked: true,
        increase: 1.125,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            rocks: { value: 50, rate: 0 },
            stems: { value: 150, rate: 0 }
          }
        },
        provides: {
          tribe: 2
        }
      },
      monolith: {
        name: 'Monolith',
        description: 'A large religious structure that is made of rock, used in ceremonies accross Munchkinland',
        locked: true,
        increase: 1.125,
        value: { current: 0, max: 0, level: 0 },
        requires: {
          resources: {
            rocks: { value: 1000, rate: 0 },
            tools: { value: 500, rate: 0 }
          }
        },
        provides: {}
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

    this.keys = function() {
      return Object.keys(buildings);
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
