angular
  .module('munchkins')
  .service('Game', function($interval, Actions, Buildings, Crafting, Defaults, Resources, Tribe) {
    const game = {
      bonus: 0,
      ticks: 0,
      calendar: {
        day: 0,
        season: 0,
        year: 0
      }
    };

    this.game = function() {
      return game;
    };

    this.calendar = function() {
      return game.calendar;
    };

    this.calcCalendar = function() {
      const days = Math.floor(game.ticks / Defaults.DAY_TICKS);

      game.calendar.year = Math.floor(days / Defaults.YEAR_DAYS);
      game.calendar.season = Math.floor((days % Defaults.YEAR_DAYS) / Defaults.SEASON_DAYS);
      game.calendar.day = (days % Defaults.YEAR_DAYS) % Defaults.SEASON_DAYS;
    };

    this.bonus = function() {
      return game.bonus;
    };

    this.calcBonus = function() {
      game.bonus = 0.01 * (game.ticks / Defaults.YEAR_TICKS);
    };

    this.tick = function() {
      game.ticks++;

      this.calcBonus();
      this.calcCalendar();

      const resources = Resources.all();
      _.forEach(resources, function(resource) {
        resource.gamerate = resource.rate; // (resource.rate * (1.0 + game.bonus));
        resource.value.current = Math.max(0, resource.gamerate + resource.value.current);
        if (resource.value.limit) {
          resource.value.current = Math.min(resource.value.current, resource.value.limit);
        }
      });
    };

    this.wipe = function() {
      console.log('Wiping game');
      localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify({}));
    };

    this.save = function() {
      console.log('Saving game');
      const save = {
        version: 1,
        game: {
          ticks: game.ticks
        },
        buildings: {},
        crafting: {},
        resources: {},
        tribe: {}
      };

      Buildings.save(save.buildings);
      Crafting.save(save.crafting);
      Resources.save(save.resources);
      Tribe.save(save.tribe);

      localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
    };

    this.load = function() {
      console.log('Loading game');
      const load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

      game.ticks = (load.game || {}).ticks || game.ticks;

      Buildings.load(load.buildings || {});
      Crafting.load(load.crafting || {});
      Resources.load(load.resources || {});
      Tribe.load(load.tribe || {});
    };

    this.load();
    Actions.initResources();

    $interval(() => this.save(), Defaults.SAVE_RATE);
    $interval(() => this.tick(), Defaults.TICK_RATE);
  });
