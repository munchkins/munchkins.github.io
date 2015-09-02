angular
  .module('munchkins')
  .service('Actions', function(Buildings, Crafting, Resources, Tribe) {
    const unlockAll = function() {
      const unlockOne = function(item) {
        if (item.locked) {
          let locked = false;

          _.forEach(item.requires.buildings, function(b, k) {
            if (!locked) {
              locked = !(Buildings.get(k).value.current >= b.value);
            }
          });

          _.forEach(item.requires.resources, function(r, k) {
            if (!locked) {
              locked = !(Resources.get(k).value.current >= r.value);
            }
          });

          item.locked = locked;
        }
      };

      _.forEach(Buildings.all(), unlockOne);
      _.forEach(Crafting.all(), unlockOne);
      _.forEach(Tribe.all(), unlockOne);
    };

    const priceMultiplier = function(item) {
      return Math.pow(item.increase || 1, item.value.current);
    };

    this.isBuyable = function(item) {
      const incr = priceMultiplier(item);
      let buyable = !item.locked && (Tribe.free() >= (item.requires.tribe || 0));

      _.forEach(item.requires.resources, function(r, k) {
        if (buyable) {
          buyable = Resources.get(k).value.current >= r.value * incr;
        }
      });

      return buyable;
    };

    this.buy = function(item) {
      if (!this.isBuyable(item)) {
        return false;
      }

      const incr = priceMultiplier(item);
      item.value.current++;

      _.forEach(item.requires.resources, function(r, k) {
        Resources.get(k).value.current -= r.value * incr;
      });

      _.forEach(item.provides.resources, function(p, k) {
        const resource = Resources.get(k);
        resource.value.current += p.value;
        resource.rate += p.rate;
      });

      Tribe.add(-1 * (item.requires.tribe || 0));
      Tribe.add(item.provides.tribe || 0);

      unlockAll();

      return true;
    };

    this.prices = function(item) {
      const incr = priceMultiplier(item);

      _.forEach(item.requires.resources, function(r, k) {
        const price = r.value * incr;
        const resource = Resources.get(k);

        r.buynow = price;
        r.affordable = resource.value.current >= price;
        r.name = resource.name;
      });

      return _.filter(item.requires.resources, {});
    };

    this.initResource = function(item) {
      _.forEach(item.provides.resources, function(p, k) {
        Resources.get(k).rate += item.value.current * (p.rate || 0);
      });

      _.forEach(item.requires.resources, function(r, k) {
        Resources.get(k).rate -= item.value.current * (r.rate || 0);
      });
    };

    this.initResources = function() {
      _.forEach(Buildings.all(), this.initResource);
      _.forEach(Crafting.all(), this.initResource);
      _.forEach(Tribe.all(), this.initResource);
    };
  });
