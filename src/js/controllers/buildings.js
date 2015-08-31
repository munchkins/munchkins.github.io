angular
  .module('munchkins')
  .controller('Buildings', function(Buildings, Resources) {
    this.buildings = Buildings;

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
    };
  });
