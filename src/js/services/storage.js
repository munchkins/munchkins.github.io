angular
  .module('munchkins')
  .service('Storage', function($interval, Defaults, Game, Resources, Buildings) {
    this.save = function() {
      console.log('Saving game');
      try {
        const save = {
          version: 1,
          game: {},
          resources: {},
          buildings: {}
        };

        const game = Game.get();
        save.game.ticks = game.ticks;

        const resources = Resources.all();
        angular.forEach(resources, function(r, k) {
          save.resources[k] = {
            value: r.value
          };
        });

        const buildings = Buildings.all();
        angular.forEach(buildings, function(b, k) {
          save.buildings[k] = {
            value: b.value,
            locked: b.locked
          };
        });

        localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
      } catch(err) {
        console.error(err);
      }
    };

    this.load = function() {
      console.log('Loading game');
      try {
        const load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION));

        load.game = load.game || {};
        load.resources = load.resources || {};
        load.buildings = load.buildings || {};

        const game = Game.get();
        game.ticks = load.game.ticks || game.ticks;

        angular.forEach(load.resources, function(r, k) {
          const resource = Resources.get(k);
          resource.value = r.value;
        });

        angular.forEach(load.buildings, function(b, k) {
          const building = Buildings.get(k);
          building.value = b.value;
          building.locked = b.locked;
        });
      } catch (err) {
        console.error(err);
      }
    };
  });
