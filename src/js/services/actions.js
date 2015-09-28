angular
  .module('munchkins')
  .service('Actions', function(Buildings, Crafting, Resources, Tribe) {
    this.unlock = function(item) {
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

    this.unlockAll = function() {
      _.forEach(Buildings.all(), this.unlock);
      _.forEach(Crafting.all(), this.unlock);
      _.forEach(Tribe.all(), this.unlock);
    };

    this.priceMultiplier = function(item) {
      return Math.pow(item.increase, item.value.current);
    };

    this.isBuyable = function(item) {
      const incr = this.priceMultiplier(item);
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

      const incr = this.priceMultiplier(item);
      item.value.current++;

      _.forEach(item.requires.resources, function(r, k) {
        const resource = Resources.get(k);
        resource.value.current -= (r.value || 0) * incr;
        resource.rate -= (r.rate || 0);
      });

      _.forEach(item.provides.resources, function(p, k) {
        const resource = Resources.get(k);
        resource.value.current += (p.value || 0);
        resource.rate += (p.rate || 0);
      });

      Tribe.add((-1 * (item.requires.tribe || 0)) + (item.provides.tribe || 0));

      this.unlockAll();

      return true;
    };

    this.provides = function(item) {
      _.forEach(item.provides.resources, function(r, k) {
        r.name = Resources.get(k).name;
      });

      return _.filter(item.provides.resources, {});
    };

    this.requires = function(item) {
      const incr = this.priceMultiplier(item);

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
        resource.rate += item.value.current * (p.rate || 0);
      });

      _.forEach(item.requires.resources, function(r, k) {
        const resource = Resources.get(k);
        resource.rate -= item.value.current * (r.rate || 0);
      });
    };

    this.initResources = function() {
      _.forEach(Buildings.all(), this.initResource);
      _.forEach(Tribe.all(), this.initResource);
    };
  });
