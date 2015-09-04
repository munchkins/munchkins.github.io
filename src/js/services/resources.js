angular
  .module('munchkins')
  .service('Resources', function() {
    const resources = {
      flowers: {
        name: 'Flowers',
        description: 'Flowers are the staple of the Munchkin diet',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      stems: {
        name: 'Stems',
        description: 'Flower stems act as a basic building block',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      petals: {
        name: 'Petals',
        description: 'Flower petals are a decoration with various uses',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      paper: {
        name: 'Paper',
        description: 'Petal paper',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      rocks: {
        name: 'Rocks',
        description: 'Rocks are a by-product of farming',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      test: {}
    };

    this.all = function() {
      return _.filter(resources, {});
    };

    this.keys = function() {
      return Object.keys(resources);
    };

    this.get = function(key) {
      return resources[key];
    };

    this.save = function(to) {
      _.forEach(resources, function(r, k) {
        to[k] = {
          value: r.value
        };
      });
    };

    this.load = function(from) {
      _.forEach(from, function(r, k) {
        resources[k].value = r.value;
      });
    };
  });
