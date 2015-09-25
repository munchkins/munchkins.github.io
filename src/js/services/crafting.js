angular
  .module('munchkins')
  .service('Crafting', function() {
    const crafting = {
      collect: {
        name: 'Collect Flowers',
        description: 'Flowers are the staple of the Munchkin diet, collect them',
        locked: false,
        provides: {
          resources: {
            flowers: { value: 1, rate: 0 }
          }
        }
      },
      processing: {
        name: 'Process Flowers',
        description: 'Processes and deconstructs flowers into petals and stems',
        requires: {
          buildings: {
            meadow: { value: 1 }
          },
          resources: {
            flowers: { value: 10, rate: 0 }
          }
        },
        provides: {
          resources: {
            stems: { value: 9, rate: 0 },
            petals: { value: 75, rate: 0 }
          }
        }
      },
      press: {
        name: 'Press Petals',
        description: 'Process flower petals into petal paper',
        requires: {
          resources: {
            petals: { value: 1000, rate: 0 }
          }
        },
        provides: {
          resources: {
            paper: { value: 1, rate: 0 }
          }
        }
      },
      hunt: {
        name: 'Hunt & Gather',
        description: 'Search for food, resources and items outside of the community',
        requires: {
          resources: {
            tools: { value: 50, rate: 0 }
          }
        },
        provides: {
          resources: {
            rocks: { value: 5, rate: 0 },
            food: { value: 25, rate: 0 }
          }
        }
      }
    };

    _.forEach(crafting, function(item) {
      item.increase = item.increase || 1.0;
      item.locked = _.isUndefined(item.locked) ? true : item.locked;
      item.value = item.value || { current: 0, max: 0, level: 0 };

      item.requires = item.requires || {};
      item.hasRequires = !!Object.keys(item.requires).length;

      item.provides = item.provides || {};
      item.hasProvides = !!Object.keys(item.provides).length;
    });

    this.all = function() {
      return _.filter(crafting, {});
    };

    this.keys = function() {
      return Object.keys(crafting);
    };

    this.get = function(key) {
      return crafting[key];
    };

    this.save = function(to) {
      _.forEach(crafting, function(c, k) {
        to[k] = {
          value: c.value,
          locked: c.locked
        };
      });
    };

    this.load = function(from) {
      _.forEach(from, function(c, k) {
        const craft = crafting[k];
        craft.value = c.value;
        craft.locked = c.locked;
      });
    };
  });
