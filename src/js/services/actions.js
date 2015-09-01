angular
  .module('munchkins')
  .service('Actions', function(Buildings, Crafting, Resources, Tribe) {
    const unlockAll = function() {
      const unlock = function(buildings) {
        _.forEach(buildings, function(building) {
          if (building.locked) {
            let locked = false;

            _.forEach(building.requires.buildings, function(b, k) {
              if (!locked) {
                locked = !(Buildings.get(k).value.current >= b.value);
              }
            });

            _.forEach(building.requires.resources, function(r, k) {
              if (!locked) {
                building.locked = !(Resources.get(k).value.current >= r.value);
              }
            });

            if (!locked) {
              Buildings.activate(building);
            }
          }
        });
      };

      unlock(Buildings.all());
      unlock(Crafting.all());
    };

    this.isBuyable = function(building) {
      const incr = Math.pow(building.increase, building.value.current);
      let buyable = true;

      _.forEach(building.requires.resources, function(r, k) {
        if (buyable) {
          buyable = Resources.get(k).value.current >= r.value * incr;
        }
      });

      return buyable;
    };

    this.buy = function(building) {
      if (!this.isBuyable(building)) {
        return;
      }

      const incr = Math.pow(building.increase, building.value.current);

      building.value.current++;

      _.forEach(building.requires.resources, function(r, k) {
        Resources.get(k).value.current -= r.value * incr;
      });

      _.forEach(building.provides.resources, function(p, k) {
        const resource = Resources.get(k);
        resource.value.current += p.value;
        resource.rate += p.rate;
      });

      Tribe.add(building.provides.tribe || 0);

      unlockAll();
    };

    this.prices = function(building) {
      const incr = Math.pow(building.increase, building.value.current);

      _.forEach(building.requires.resources, function(r, k) {
        const price = r.value * incr;
        const resource = Resources.get(k);

        r.buynow = price;
        r.affordable = resource.value.current >= price;
        r.name = resource.name;
      });

      return _.filter(building.requires.resources, {});
    };

    this.initResources = function() {
      const init = function(buildings) {
        _.forEach(buildings, function(building) {
          _.forEach(building.provides.resources, function(p, k) {
            Resources.get(k).rate += building.value.current * p.rate;
          });
        });
      };

      init(Buildings.all());
      init(Crafting.all());
    };
  });
