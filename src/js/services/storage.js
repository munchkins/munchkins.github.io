angular
  .module('munchkins')
  .service('Storage', function($interval, Defaults, Resources, Buildings) {
    this.save = function() {
      console.log('Saving game');
      try {
        const save = {
          version: 1,
          resources: {},
          buildings: {}
        };

        _.forEach(Resources, function(res, key) {
          save.resources[key] = {
            value: res.value
          };
        });

        _.forEach(Buildings, function(bld, key) {
          save.buildings[key] = {
            value: bld.value,
            unlocked: bld.unlocked
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

        _.forEach(load.resources, function(res, key) {
          Resources[key].value = res.value;
        });

        _.forEach(load.buildings, function(bld, key) {
          Buildings[key].value = bld.value;
          Buildings[key].unlocked = bld.unlocked;
        });
      } catch (err) {
        console.error(err);
      }
    };
  });
