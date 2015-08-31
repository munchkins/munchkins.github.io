'use strict';

angular
  .module('munchkins.services')
  .service('storage', function($interval, resources, buildings) {
    const SAVE_LOCATION = 'munchkinsSave';

    this.save = function() {
      const save = {
        version: 1,
        resources: {},
        buildings: {}
      };

      _.forEach(resources, function(res, key) {
        save.resources[key] = {
          value: res.value
        };
      });

      _.forEach(buildings, function(bld, key) {
        save.buildings[key] = {
          value: bld.value,
          unlocked: bld.unlocked
        };
      });

      localStorage.setItem(SAVE_LOCATION, JSON.stringify(save));
    };

    this.load = function() {
      try {
        const load = JSON.parse(localStorage.getItem(SAVE_LOCATION));

        _.forEach(load.resources, function(res, key) {
          resources[key].value = res.value;
        });

        _.forEach(load.buildings, function(bld, key) {
          buildings[key].value = bld.value;
          buildings[key].unlocked = bld.unlocked;
        });
      } catch (err) {
        console.error(err);
      }
    };

    $interval(this.save, 60000);
  });
