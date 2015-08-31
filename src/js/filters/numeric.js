angular
  .module('munchkins')
  .filter('numeric', function() {
    const units = ['', 'K', 'M', 'G', 'T', 'P'];

    return function(number, precision) {
      const p = precision || 2;
      const u = Math.floor(Math.log(number) / Math.log(1000));

      return (number / 1000 ** Math.floor(u)).toFixed(p) + '' + units[u];
    };
  });
