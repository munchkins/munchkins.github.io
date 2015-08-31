angular
  .module('munchkins')
  .controller('Buildings', function(Buildings, Resources) {
    this.buildings = Buildings;

    const unlockBuildings = function() {
      angular.forEach(Buildings, function(bld) {
        if (bld.locked) {
          bld.locked = false;
          angular.forEach(bld.requires.resources, function(rres, rrkey) {
            if (!bld.locked) {
              angular.forEach(Resources, function(res, rkey) {
                if (rkey === rrkey) {
                  bld.locked = !(res.value.current >= rres.value);
                }
              });
            }
          });
        }
      });
    };

    this.getPrices = function(key) {
      const incr = Math.pow(Buildings[key].increase, Buildings[key].value.current);
      const prices = [];

      angular.forEach(Buildings[key].requires.resources, function(req, rkey) {
        const price = req.value * incr;
        prices.push({
          name: Resources[rkey].name,
          value: price,
          affordable: Resources[rkey].value.current >= price
        });
      });

      return prices;
    };

    this.isBuyable = function(key) {
      const incr = Math.pow(Buildings[key].increase, Buildings[key].value.current);
      let buyable = true;

      angular.forEach(Buildings[key].requires.resources, function(req, rkey) {
        buyable = buyable && (Resources[rkey].value.current >= req.value * incr);
      });

      return buyable;
    };

    this.buy = function(key) {
      if (!this.isBuyable(key)) {
        return;
      }

      const incr = Math.pow(Buildings[key].increase, Buildings[key].value.current);

      Buildings[key].value.current++;

      angular.forEach(Buildings[key].requires.resources, function(req, rkey) {
        Resources[rkey].value.current -= req.value * incr;
      });

      angular.forEach(Buildings[key].provides.resources, function(prov, pkey) {
        Resources[pkey].value.current++;
        Resources[pkey].rate += prov.rate;
      });

      unlockBuildings();
    };

    angular.forEach(Buildings, function(bld) {
      angular.forEach(bld.provides.resources, function(prov, pkey) {
        Resources[pkey].rate += prov.rate;
      });
    });
  });
