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

    this.buy = function(key) {
      const b = Buildings[key];
      const incr = Math.pow(b.increase, b.value.current);

      b.value.current++;

      angular.forEach(b.requires.resources, function(req, rkey) {
        const r = Resources[rkey];
        r.value.current -= req.value * incr;
      });

      angular.forEach(b.provides.resources, function(prov, pkey) {
        const r = Resources[pkey];
        r.value.current++;
        r.rate += prov.rate;
      });

      unlockBuildings();
    };
  });
