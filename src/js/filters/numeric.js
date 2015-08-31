angular
  .module('munchkins')
  .filter('numeric', function() {
    const units = ['', 'K', 'M', 'G', 'T', 'P'];

    return function(number, precision) {
      const n = number || 0;
      const u = Math.floor(Math.log(n) / Math.log(1000));

      let p = precision || ((precision === 0) ? 0 : 2);
      if ((p === 0) && (p >= 1000)) {
        p = 2;
      }

      return (n < 1) ? (n.toFixed(p)) : ((n / 1000 ** Math.floor(u)).toFixed(p) + units[u]);
    };
  });
