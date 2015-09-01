/*
  Resources are defined with the following structure

  <key>: {
    name: <string name>
    description: <string description>
    value: {
      current: <current value>
      max: <max value>
    }
    rate: <rate of increase>
  }
*/
angular
  .module('munchkins')
  .service('Resources', function() {
    const resources = {
      flowers: {
        name: 'Flowers',
        description: 'Flowers are the staple of the Munchkin diet',
        value: {
          current: 0,
          limit: 0
        },
        rate: 0
      }
    };

    this.all = function() {
      return resources;
    };

    this.get = function(key) {
      return resources[key];
    };
  });
