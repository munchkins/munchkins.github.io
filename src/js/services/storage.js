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

        save.game.ticks = Game.ticks;

        angular.forEach(Resources, function(res, key) {
          save.resources[key] = {
            value: res.value
          };
        });

        angular.forEach(Buildings, function(bld, key) {
          save.buildings[key] = {
            value: bld.value,
            locked: bld.locked
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

        Game.ticks = load.game.ticks || Game.ticks;

        angular.forEach(load.resources, function(res, key) {
          Resources[key].value = res.value;
        });

        angular.forEach(load.buildings, function(bld, key) {
          Buildings[key].value = bld.value;
          Buildings[key].locked = bld.locked;
        });
      } catch (err) {
        console.error(err);
      }
    };
  });
