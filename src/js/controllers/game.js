angular
  .module('munchkins')
  .controller('Game', function($interval, Defaults, Game, Buildings, Resources, Storage) {
    const tickloop = function() {
      Game.ticks++;

      const resources = Resources.all();
      _.forEach(resources, function(resource) {
        resource.value.current += resource.rate;
        if (resource.value.limit) {
          resource.value.current = Math.min(resource.value.current, resource.value.limit);
        }
      });
    };

    Storage.load();
    Buildings.initResources();

    $interval(Storage.save, Defaults.SAVE_RATE);
    $interval(tickloop, Defaults.TICK_RATE);
  });
