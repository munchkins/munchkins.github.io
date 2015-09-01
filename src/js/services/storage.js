angular
  .module('munchkins')
  .service('Storage', function($interval, Defaults, Game, Buildings, Crafting, Resources) {
    this.save = function() {
      console.log('Saving game');
      try {
        const save = {
          version: 1,
          game: {},
          resources: {},
          buildings: {},
          crafting: {}
        };

        Game.save(save.game);
        Buildings.save(save.buildings);
        Crafting.save(save.crafting);
        Resources.save(save.resources);

        localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
      } catch(err) {
        console.error(err);
      }
    };

    this.load = function() {
      console.log('Loading game');
      try {
        const load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

        Game.load(load.game || {});
        Buildings.load(load.buildings || {});
        Crafting.load(load.crafting || {});
        Resources.load(load.resources || {});
      } catch (err) {
        console.error(err);
      }
    };
  });
