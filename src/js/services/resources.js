angular
  .module('munchkins')
  .service('Resources', function() {
    const resources = {
      flowers: {
        name: 'Flowers',
        description: 'Flowers are the staple of the Munchkin economy, diet and production',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      stems: {
        name: 'Stems',
        description: 'Flower stems act as a basic building block for light structures',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      petals: {
        name: 'Petals',
        description: 'Flower petals are a decoration with various uses in and around the house and community',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      paper: {
        name: 'Paper',
        description: 'Petal paper are a fine resource',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      rocks: {
        name: 'Rocks',
        description: 'Rocks are a by-product of farming and produced by mining',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      tools: {
        name: 'Tools',
        description: 'Tools makes hard tasks easier',
        value: { current: 0, limit: 0 },
        rate: 0
      },
      food: {
        name: 'Food',
        description: 'Food is always needed, this planet or another',
        value: { current: 0, limit: 0 },
        rate: 0
      }
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
