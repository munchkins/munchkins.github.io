angular
  .module('munchkins')
  .service('Resources', function() {
    const resources = {
      flowers: {
        name: 'Flowers',
        description: 'Flowers are the staple of the Munchkin economy, diet and production'
      },
      stems: {
        name: 'Stems',
        description: 'Flower stems act as a basic building block for light structures'
      },
      petals: {
        name: 'Petals',
        description: 'Flower petals are a decoration with various uses in and around the house and community'
      },
      paper: {
        name: 'Paper',
        description: 'Petal paper are a fine resource'
      },
      furs: {
        name: 'Furs',
        description: 'An animal byproduct that has uses in and around the village'
      },
      charcoal: {
        name: 'Charcoal',
        description: 'A byproduct of burning stems, wood and other resources'
      },
      rocks: {
        name: 'Rocks',
        description: 'Rocks are a by-product of farming and produced by mining'
      },
      tools: {
        name: 'Tools',
        description: 'Tools makes hard tasks easier'
      },
      food: {
        name: 'Food',
        description: 'Food is always needed, this planet or another'
      },
      happiness: {
        name: 'Happiness',
        description: 'The overal state of mind and contentment of the actual tribe'
      },
      faith: {
        name: 'Faith',
        description: 'A core ingrediesnt in any religious ceremony, required for any festivals'
      }
    };

    _.forEach(resources, function(item) {
      item.rate = item.rate || 0;
      item.value = item.value || { current: 0, limit: 0 };
    });

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
