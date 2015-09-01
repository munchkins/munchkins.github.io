angular
  .module('munchkins')
  .service('Craftables', function() {
    const craftables = {
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
      }
    };

    this.all = function() {
      return craftables;
    };

    this.get = function(key) {
      return craftables[key];
    };
  });
