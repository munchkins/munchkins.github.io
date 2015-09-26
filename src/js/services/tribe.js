angular
  .module('munchkins')
  .service('Tribe', function() {
    const types = {
      cook: {
        name: 'Cook',
        description: 'Processes flowers to make food for the tribe',
        requires: {
          buildings: {
            fire: { value: 1 }
          },
          resources: {
            flowers: { value: 0, rate: 0.04 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            seeds: { value: 0, rate: 0.01 },
            stems: { value: 0, rate: 0.04 },
            petals: { value: 0, rate: 0.4 }
          }
        }
      },
      farmer: {
        name: 'Farmer',
        description: 'A farmer works the gardens for additional production of resources',
        requires: {
          buildings: {
            garden: { value: 1 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01 },
            rocks: { value: 0, rate: 0.001 }
          }
        }
      },
      tooler: {
        name: 'Tool Maker',
        description: 'The tribe member creates rock tools for use in hunting, cooking and farming',
        requires: {
          buildings: {
            quarry: { value: 1 }
          },
          resources: {
            rocks: { value: 0, rate: 0.025 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            tools: { value: 0, rate: 0.0125 }
          }
        }
      },
      priest: {
        name: 'Priest',
        description: 'A core member of any religious ceremony, providing direct access to another world',
        requires: {
          buildings: {
            monolith: { value: 1 }
          },
          resources: {
            tools: { value: 0, rate: 0.001 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            faith: { value: 0, rate: 0.0025 }
          }
        }
      }
    };

    const tribe = {
      free: 0,
      types: types
    };

    _.forEach(types, function(item) {
      item.increase = item.increase || 1.0;
      item.locked = _.isUndefined(item.locked) ? true : item.locked;
      item.value = item.value || { current: 0, max: 0, level: 0 };

      item.requires = item.requires || {};
      item.requires.resources = item.requires.resources || {};
      item.requires.resources.seeds = { value: 0, rate: 0.0025 };
      item.hasRequires = !!Object.keys(item.requires.resources).length;

      item.provides = item.provides || {};
      item.provides.resources = item.provides.resources || {};
      item.hasProvides = !!Object.keys(item.provides.resources).length;
    });

    this.all = function() {
      return _.filter(types, {});
    };

    this.keys = function() {
      return Object.keys(types);
    };

    this.get = function(type) {
      return types[type];
    };

    this.add = function(number) {
      tribe.free += number;
    };

    this.free = function() {
      return tribe.free;
    };

    this.total = function() {
      let count = 0;
      _.forEach(types, function(type) {
        count += type.value.current;
      });
      return tribe.free + count;
    };

    this.save = function(to) {
      to.free = tribe.free;
      to.types = {};
      _.forEach(types, function(type, key) {
        to.types[key] = {
          locked: type.locked,
          value: type.value
        };
      });
    };

    this.load = function(from) {
      tribe.free = from.free || tribe.free;
      _.forEach(from.types, function(t, k) {
        const type = types[k];
        if (type) {
          type.locked = t.locked;
          type.value = t.value;
        }
      });
    };
  });
