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
          buildings: {}
        };

        const saveBuildings = function(buildings) {
          _.forEach(buildings, function(b, k) {
            save.buildings[k] = {
              value: b.value,
              locked: b.locked
            };
          });
        };

        const saveGame = function(game) {
          save.game.ticks = game.ticks;
        };

        const resources = Resources.all();
        _.forEach(resources, function(r, k) {
          save.resources[k] = {
            value: r.value
          };
        });

        saveGame(Game.all());
        saveResources(Resources.all());
        saveBuildings(Buildings.all());
        saveBuildings(Crafting.all());

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

        const loadGame = function(game) {
          game.ticks = load.game.ticks || game.ticks;
        };

        const loadResources = function() {
          _.forEach(load.resources, function(r, k) {
            const resource = Resources.get(k);
            resource.value = r.value;
          });
        };

        const loadBuildings = function() {
          _.forEach(load.buildings, function(b, k) {
            const building = Buildings.get(k) || Crafting.get(k);
            building.value = b.value;
            building.locked = b.locked;
          });
        };

        loadGame(Game.all());
        loadResources();
        loadBuildings();
      } catch (err) {
        console.error(err);
      }
    };
  });
