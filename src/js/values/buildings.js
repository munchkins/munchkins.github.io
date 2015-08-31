/*
  Buildings are defined with the following structure

  <key>: {
    name: <string name>
    description: <string description>
    unlocked: <true|false>
    increase: <base price increase>
    value: {
      current: <current value>
      limit: <max value, 0 if no limit>
      level: <upgrade level>
    }
    requires: {
      resources: {
        <resource key>: {
          value: <number>
        }
      }
    }
    provides: {
      resources: {
        <resource key>: {
          value: <number>
          rate: <number>
        }
      }
    }
  }
*/
angular
  .module('munchkins')
  .value('Buildings', {
    collect: {
      name: 'Collect Flowers',
      description: 'Flowers are the staple of the Munchkin diet, collect them',
      locked: false,
      increase: 0,
      value: {
        current: 0,
        max: 0,
        level: 0
      },
      requires: {
      },
      provides: {
        resources: {
          flowers: {
            value: 1,
            rate: 0
          }
        }
      }
    },
    meadow: {
      name: 'Flower Meadow',
      description: 'A naturally gorwing field of flowers',
      locked: true,
      increase: 1.1,
      value: {
        current: 0,
        max: 0,
        level: 0
      },
      requires: {
        resources: {
          flowers: {
            value: 100
          }
        }
      },
      provides: {
        resources: {
          flowers: {
            value: 0,
            rate: 0.01
          }
        }
      }
    }
  });
