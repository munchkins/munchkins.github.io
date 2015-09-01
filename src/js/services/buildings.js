/*
  Buildings are defined with the following structure

  <key>: {
    name: <string name>
    description: <string description>
    unlocked: <true|false>
    increase: <base price increase>
    value: {
      current: <current value>
      limit: <max value, 0 if no limit>
      level: <upgrade level>
    }
    requires: {
      resources: {
        <resource key>: {
          value: <number>
        }
      }
    }
    provides: {
      resources: {
        <resource key>: {
          value: <number>
          rate: <number>
        }
      }
    }
  }
*/
angular
  .module('munchkins')
  .service('Buildings', function(Craftables, Resources) {
    const buildings = {
      collect: {
        name: 'Collect Flowers',
        description: 'Flowers are the staple of the Munchkin diet, collect them',
        locked: false,
        increase: 1.0,
        value: { current: 0, max: 0, level: 0 },
        requires: {},
        provides: {
          resources: {
            flowers: { value: 1, rate: 0 }
          }
        }
      },
      meadow: {
        name: 'Flower Meadow',
        description: 'A naturally growing field of flowers',
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
      },
      processing: {
        name: 'Flower processing',
        description: 'Processes flowers into petals and stems',
        locked: true,
        increase: 1.0,
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
          craftables: {
            stems: { value: 9, rate: 0 },
            petals: { value: 75, rate: 0 }
          }
        }
      }
    };

    const unlock = function() {
      angular.forEach(buildings, function(building) {
        if (building.locked) {
          building.locked = false;

          angular.forEach(building.requires.buildings, function(b, k) {
            if (!building.locked) {
              building.locked = !(buildings[k].value.current >= b.value);
            }
          });

          angular.forEach(building.requires.resources, function(r, k) {
            if (!building.locked) {
              const resource = Resources.get(k);
              building.locked = !(resource.value.current >= r.value);
            }
          });

          angular.forEach(building.requires.craftables, function(c, k) {
            if (!building.locked) {
              const craftable = Craftables.get(k);
              building.locked = !(craftable.value.current >= r.value);
            }
          });
        }
      });
    };

    this.isBuyable = function(key) {
      const building = buildings[key];
      const incr = Math.pow(building.increase, building.value.current);
      let buyable = true;

      angular.forEach(building.requires.resources, function(r, k) {
        if (buyable) {
          const resource = Resources.get(k);
          buyable = resource.value.current >= r.value * incr;
        }
      });

      angular.forEach(building.requires.craftables, function(c, k) {
        if (buyable) {
          const craftable = Craftables.get(k);
          buyable = craftable.value.current >= c.value * incr;
        }
      });

      return buyable;
    };

    this.buy = function(key) {
      if (!this.isBuyable(key)) {
        return;
      }

      const building = buildings[key];
      const incr = Math.pow(building.increase, building.value.current);

      building.value.current++;

      angular.forEach(building.requires.resources, function(r, k) {
        const resource = Resources.get(k);
        resource.value.current -= r.value * incr;
      });

      angular.forEach(building.requires.craftables, function(c, k) {
        const craftable = Craftables.get(k);
        craftable.value.current -= c.value * incr;
      });

      angular.forEach(building.provides.resources, function(p, k) {
        const resource = Resources.get(k);
        resource.value.current += p.value;
        resource.rate += p.rate;
      });

      angular.forEach(building.provides.craftables, function(p, k) {
        const craftables = Craftables.get(k);
        craftables.value.current += p.value;
        craftables.rate += p.rate;
      });

      unlock();
    };

    this.prices = function(key) {
      const building = buildings[key];
      const incr = Math.pow(building.increase, building.value.current);

      angular.forEach(building.requires.resources, function(r, k) {
        const price = r.value * incr;
        const resource = Resources.get(k);

        r.buynow = price;
        r.affordable = resource.value.current >= price;
        r.name = resource.name;
      });

      return building.requires.resources;
    };

    this.initResources = function() {
      angular.forEach(buildings, function(building) {
        angular.forEach(building.provides.resources, function(p, k) {
          const resource = Resources.get(k);
          resource.rate += building.value.current * p.rate;
        });
      });
    };

    this.all = function() {
      return buildings;
    };

    this.get = function(key) {
      return buildings[key];
    };
  });
