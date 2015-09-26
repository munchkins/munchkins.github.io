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
      return Math.pow(item.increase, item.value.current);
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
        const resource = Resources.get(k);
        resource.value.current -= r.value * incr;
        resource.rate -= r.rate;
      });

      _.forEach(item.provides.resources, function(p, k) {
        const resource = Resources.get(k);
        resource.value.current += p.value;
        resource.rate += Math.pow(p.rate, p.hyper ? item.value.current : 1);
      });

      Tribe.add(-1 * (item.requires.tribe || 0));
      Tribe.add(item.provides.tribe || 0);

      unlockAll();

      return true;
    };

    this.provides = function(item) {
      _.forEach(item.provides.resources, function(r, k) {
        r.name = Resources.get(k).name;
      });

      return _.filter(item.provides.resources, {});
    };

    this.requires = function(item) {
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
        const resource = Resources.get(k);
        if (p.hyper) {
          for (let i = 1; i <= item.value.current; i++) {
            resource.rate += Math.pow((p.rate || 0), i);
          }
        } else {
          resource.rate += item.value.current * (p.rate || 0);
        }
      });

      _.forEach(item.requires.resources, function(r, k) {
        const resource = Resources.get(k);
        resource.rate -= item.value.current * (r.rate || 0);
      });
    };

    this.initResources = function() {
      _.forEach(Buildings.all(), this.initResource);
      _.forEach(Crafting.all(), this.initResource);
      _.forEach(Tribe.all(), this.initResource);
    };
  });
