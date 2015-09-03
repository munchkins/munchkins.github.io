angular
  .module('munchkins.controllers')
  .service('Crafting', function() {
    const crafting = {
      collect: {
        name: 'Collect Flowers',
        description: 'Flowers are the staple of the Munchkin diet, collect them',
        locked: false,
        value: { current: 0, max: 0, level: 0 },
        requires: {},
        provides: {
          resources: {
            flowers: { value: 1, rate: 0 }
          }
        }
      },
      processing: {
        name: 'Process Flowers',
        description: 'Processes flowers into petals and stems',
        locked: true,
        value: { current: 0, max: 0, level: 0 },
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
      }
    };

    this.all = function() {
      return _.filter(crafting, {});
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
