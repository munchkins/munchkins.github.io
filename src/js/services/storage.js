angular
  .module('munchkins')
  .service('Storage', function($interval, Defaults, Buildings, Crafting, Game, Resources, Tribe) {
    this.save = function() {
      console.log('Saving game');
      try {
        const save = {
          version: 1,
          buildings: {},
          crafting: {},
          game: {},
          resources: {},
          tribe: {}
        };

        Buildings.save(save.buildings);
        Crafting.save(save.crafting);
        Game.save(save.game);
        Resources.save(save.resources);
        Tribe.save(save.tribe);

        localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
      } catch(err) {
        console.error(err);
      }
    };

    this.load = function() {
      console.log('Loading game');
      try {
        const load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

        Buildings.load(load.buildings || {});
        Crafting.load(load.crafting || {});
        Game.load(load.game || {});
        Resources.load(load.resources || {});
        Tribe.load(load.tribe || {});
      } catch (err) {
        console.error(err);
      }
    };
  });
