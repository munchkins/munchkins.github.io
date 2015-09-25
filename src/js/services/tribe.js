angular
  .module('munchkins')
  .service('Tribe', function() {
    const types = {
      farmer: {
        name: 'Farmer',
        description: 'A farmer works the meadows for additional production of producable resources',
        requires: {
          buildings: {
            meadow: { value: 1 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01, hyper: true },
            rocks: { value: 0, rate: 0.001, hyper: true }
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
            tools: { value: 0, rate: 0.0125, hyper: true }
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
            faith: { value: 0, rate: 0.0025, hyper: true }
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
      item.requires.resources.food = { value: 0, rate: 0.01 };
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
        type.locked = t.locked;
        type.value = t.value;
      });
    };
  });
