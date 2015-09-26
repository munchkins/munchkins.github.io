angular
  .module('munchkins')
  .service('Buildings', function() {
    const buildings = {
      fire: {
        name: 'Fire',
        description: 'Fire is the center of the up-and-comming community, providing a place to cook and general happiness',
        increase: 1.11,
        requires: {
          resources: {
            stems: { value: 10, rate: 0.02 }
          }
        },
        provides: {
          resources: {
            happiness: { value: 0.95, rate: 0.001 },
            charcoal: { value: 0, rate: 0.0015 }
          }
        }
      },
      shelter: {
        name: 'Shelter',
        description: 'A basic shelter made from flower stems with space for one Munchkin',
        increase: 1.11,
        requires: {
          resources: {
            furs: { value: 5, rate: 0 },
            stems: { value: 100, rate: 0 }
          }
        },
        provides: {
          tribe: 1
        }
      },
      trap: {
        name: 'Trap',
        description: 'A small trap used to catch animals that wander across the path',
        increase: 1.11,
        requires: {
          resources: {
            stems: { value: 20, rate: 0 },
            seeds: { value: 5, rate: 0 }
          }
        },
        provides: {
          resources: {
            furs: { value: 0, rate: 0.001 }
          }
        }
      },
      garden: {
        name: 'Garden',
        description: 'A naturally growing field of flowers which can be harvested',
        increase: 1.11,
        requires: {
          resources: {
            seeds: { value: 75, rate: 0 }
          }
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01 },
            rocks: { value: 0, rate: 0.001 }
          }
        }
      },
      quarry: {
        name: 'Rock Quarry',
        description: 'An area where rocks can be harvested for use in buildings and tools',
        increase: 1.11,
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
        increase: 1.125,
        requires: {
          resources: {
            rocks: { value: 50, rate: 0 },
            furs: { value: 25, rate: 0 },
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
        increase: 1.125,
        requires: {
          resources: {
            rocks: { value: 1000, rate: 0 },
            tools: { value: 500, rate: 0 }
          }
        }
      }
    };

    _.forEach(buildings, function(item) {
      item.increase = item.increase || 1.0;
      item.locked = _.isUndefined(item.locked) ? true : item.locked;
      item.value = item.value || { current: 0, max: 0, level: 0 };

      item.requires = item.requires || {};
      item.requires.resources = item.requires.resources || {};
      item.hasRequires = !!Object.keys(item.requires.resources).length;

      item.provides = item.provides || {};
      item.provides.resources = item.provides.resources || {};
      item.hasProvides = !!Object.keys(item.provides.resources).length;
    });

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
        if (building) {
          building.value = b.value;
          building.locked = b.locked;
        }
      });
    };
  });
