angular
  .module('munchkins')
  .service('Game', function($interval, Actions, Buildings, Crafting, Defaults, Resources, Tribe) {
    const game = {
      ticks: 0,
      calendar: {
        day: 0,
        season: 0,
        year: 0
      }
    };

    const DAY_TICKS = 200;
    const SEASON_DAYS = 98;
    const YEAR_DAYS = 4 * SEASON_DAYS;

    const tick = function() {
      game.ticks++;

      const days = Math.floor(game.ticks / DAY_TICKS);
      game.calendar.year = Math.floor(days / YEAR_DAYS);
      game.calendar.season = Math.floor((days % YEAR_DAYS) / SEASON_DAYS);
      game.calendar.day = (days % YEAR_DAYS) % SEASON_DAYS;

      const resources = Resources.all();
      _.forEach(resources, function(resource) {
        resource.value.current += resource.rate;
        if (resource.value.limit) {
          resource.value.current = Math.min(resource.value.current, resource.value.limit);
        }
      });
    };

    this.calendar = function() {
      return game.calendar;
    };

    this.save = function() {
      console.log('Saving game');
      try {
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
      } catch(err) {
        console.error(err);
      }
    };

    this.load = function() {
      console.log('Loading game');
      try {
        const load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

        game.ticks = (load.game || {}).ticks || game.ticks;

        Buildings.load(load.buildings || {});
        Crafting.load(load.crafting || {});
        Resources.load(load.resources || {});
        Tribe.load(load.tribe || {});
      } catch (err) {
        console.error(err);
      }
    };

    this.load();
    Actions.initResources();

    $interval(this.save, Defaults.SAVE_RATE);
    $interval(tick, Defaults.TICK_RATE);
  });
