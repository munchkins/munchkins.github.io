angular
  .module('munchkins')
  .filter('numeric', function() {
    const units = ['', 'K', 'M', 'G', 'T', 'P'];

    return function(number, precision) {
      const u = Math.floor(Math.log(number) / Math.log(1000));
      let p = precision || 2;

      if ((p === 0) && (p >= 1000)) {
        p = 2;
      }

      return (number / 1000 ** Math.floor(u)).toFixed(p) + '' + units[u];
    };
  });
