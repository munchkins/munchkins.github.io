'use strict';

angular.module('munchkins', ['ngRoute']).constant('Defaults', {
  TICK_RATE: 250,
  SAVE_RATE: 60000,
  SAVE_LOCATION: 'munchkinsSave'
}).config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/buildings', { templateUrl: 'views/buildings.html' }).otherwise({ redirectTo: '/buildings' });
}]);
'use strict';

angular.module('munchkins').filter('numeric', function () {
  var units = ['', 'K', 'M', 'G', 'T', 'P'];

  return function (number, precision) {
    var n = number || 0;
    var u = Math.floor(Math.log(n) / Math.log(1000));

    var p = precision || (precision === 0 ? 0 : 2);
    if (p === 0 && p >= 1000) {
      p = 2;
    }

    return n < 1 ? n.toFixed(p) : (n / Math.pow(1000, Math.floor(u))).toFixed(p) + units[u];
  };
});
'use strict';

angular.module('munchkins').controller('Buildings', ["Buildings", "Resources", function (Buildings, Resources) {
  this.buildings = Buildings;
  this.resources = Resources;
}]);
'use strict';

angular.module('munchkins').controller('Game', ["$interval", "Defaults", "Game", "Buildings", "Resources", "Storage", function ($interval, Defaults, Game, Buildings, Resources, Storage) {
  var tickloop = function tickloop() {
    Game.ticks++;

    var resources = Resources.all();
    angular.forEach(resources, function (resource) {
      resource.value.current += resource.rate;
      if (resource.value.limit) {
        resource.value.current = Math.min(resource.value.current, resource.value.limit);
      }
    });
  };

  Storage.load();
  Buildings.initResources();

  $interval(Storage.save, Defaults.SAVE_RATE);
  $interval(tickloop, Defaults.TICK_RATE);
}]);
'use strict';

angular.module('munchkins').controller('Log', function () {});
'use strict';

angular.module('munchkins').controller('Resources', ["Craftables", "Resources", function (Craftables, Resources) {
  this.craftables = Craftables;
  this.resources = Resources;
}]);
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
'use strict';

angular.module('munchkins').service('Buildings', ["Craftables", "Resources", function (Craftables, Resources) {
  var buildings = {
    collect: {
      name: 'Collect Flowers',
      description: 'Flowers are the staple of the Munchkin diet, collect them',
      locked: false,
      increase: 1.0,
      value: { current: 0, max: 0, level: 0 },
      requires: {},
      provides: {
        resources: {
          flowers: { value: 1, rate: 0 }
        }
      }
    },
    meadow: {
      name: 'Flower Meadow',
      description: 'A naturally growing field of flowers',
      locked: true,
      increase: 1.1,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          flowers: { value: 100 }
        }
      },
      provides: {
        resources: {
          flowers: { value: 0, rate: 0.01 }
        }
      }
    },
    processing: {
      name: 'Flower processing',
      description: 'Processes flowers into petals and stems',
      locked: true,
      increase: 1.0,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        buildings: {
          meadow: { value: 1 }
        },
        resources: {
          flowers: { value: 10, rate: 0 }
        }
      },
      provides: {
        craftables: {
          stems: { value: 9, rate: 0 },
          petals: { value: 75, rate: 0 }
        }
      }
    }
  };

  var unlock = function unlock() {
    angular.forEach(buildings, function (building) {
      if (building.locked) {
        building.locked = false;

        angular.forEach(building.requires.buildings, function (b, k) {
          if (!building.locked) {
            building.locked = !(buildings[k].value.current >= b.value);
          }
        });

        angular.forEach(building.requires.resources, function (r, k) {
          if (!building.locked) {
            var resource = Resources.get(k);
            building.locked = !(resource.value.current >= r.value);
          }
        });

        angular.forEach(building.requires.craftables, function (c, k) {
          if (!building.locked) {
            var craftable = Craftables.get(k);
            building.locked = !(craftable.value.current >= r.value);
          }
        });
      }
    });
  };

  this.isBuyable = function (key) {
    var building = buildings[key];
    var incr = Math.pow(building.increase, building.value.current);
    var buyable = true;

    angular.forEach(building.requires.resources, function (r, k) {
      if (buyable) {
        var resource = Resources.get(k);
        buyable = resource.value.current >= r.value * incr;
      }
    });

    angular.forEach(building.requires.craftables, function (c, k) {
      if (buyable) {
        var craftable = Craftables.get(k);
        buyable = craftable.value.current >= c.value * incr;
      }
    });

    return buyable;
  };

  this.buy = function (key) {
    if (!this.isBuyable(key)) {
      return;
    }

    var building = buildings[key];
    var incr = Math.pow(building.increase, building.value.current);

    building.value.current++;

    angular.forEach(building.requires.resources, function (r, k) {
      var resource = Resources.get(k);
      resource.value.current -= r.value * incr;
    });

    angular.forEach(building.requires.craftables, function (c, k) {
      var craftable = Craftables.get(k);
      craftable.value.current -= c.value * incr;
    });

    angular.forEach(building.provides.resources, function (p, k) {
      var resource = Resources.get(k);
      resource.value.current += p.value;
      resource.rate += p.rate;
    });

    angular.forEach(building.provides.craftables, function (p, k) {
      var craftables = Craftables.get(k);
      craftables.value.current += p.value;
      craftables.rate += p.rate;
    });

    unlock();
  };

  this.prices = function (key) {
    var building = buildings[key];
    var incr = Math.pow(building.increase, building.value.current);

    angular.forEach(building.requires.resources, function (r, k) {
      var price = r.value * incr;
      var resource = Resources.get(k);

      r.buynow = price;
      r.affordable = resource.value.current >= price;
      r.name = resource.name;
    });

    return building.requires.resources;
  };

  this.initResources = function () {
    angular.forEach(buildings, function (building) {
      angular.forEach(building.provides.resources, function (p, k) {
        var resource = Resources.get(k);
        resource.rate += building.value.current * p.rate;
      });
    });
  };

  this.all = function () {
    return buildings;
  };

  this.get = function (key) {
    return buildings[key];
  };
}]);
'use strict';

angular.module('munchkins').service('Craftables', function () {
  var craftables = {
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

  this.all = function () {
    return craftables;
  };

  this.get = function (key) {
    return craftables[key];
  };
});
'use strict';

angular.module('munchkins').service('Game', function () {
  var game = {
    ticks: 0
  };

  this.get = function () {
    return game;
  };
});
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
'use strict';

angular.module('munchkins').service('Resources', function () {
  var resources = {
    flowers: {
      name: 'Flowers',
      description: 'Flowers are the staple of the Munchkin diet',
      value: { current: 0, limit: 0 },
      rate: 0
    }
  };

  this.all = function () {
    return resources;
  };

  this.get = function (key) {
    return resources[key];
  };
});
'use strict';

angular.module('munchkins').service('Storage', ["$interval", "Defaults", "Game", "Buildings", "Craftables", "Resources", function ($interval, Defaults, Game, Buildings, Craftables, Resources) {
  this.save = function () {
    console.log('Saving game');
    try {
      (function () {
        var save = {
          version: 1,
          game: {},
          resources: {},
          craftables: {},
          buildings: {}
        };

        var game = Game.get();
        save.game.ticks = game.ticks;

        var resources = Resources.all();
        angular.forEach(resources, function (r, k) {
          save.resources[k] = {
            value: r.value
          };
        });

        var craftables = Craftables.all();
        angular.forEach(craftables, function (r, k) {
          save.craftables[k] = {
            value: r.value
          };
        });

        var buildings = Buildings.all();
        angular.forEach(buildings, function (b, k) {
          save.buildings[k] = {
            value: b.value,
            locked: b.locked
          };
        });

        localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
      })();
    } catch (err) {
      console.error(err);
    }
  };

  this.load = function () {
    console.log('Loading game');
    try {
      var load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION));

      load.game = load.game || {};
      load.resources = load.resources || {};
      load.craftables = load.craftables || {};
      load.buildings = load.buildings || {};

      var game = Game.get();
      game.ticks = load.game.ticks || game.ticks;

      angular.forEach(load.resources, function (r, k) {
        var resource = Resources.get(k);
        resource.value = r.value;
      });

      angular.forEach(load.craftables, function (c, k) {
        var craftable = Craftables.get(k);
        craftable.value = c.value;
      });

      angular.forEach(load.buildings, function (b, k) {
        var building = Buildings.get(k);
        building.value = b.value;
        building.locked = b.locked;
      });
    } catch (err) {
      console.error(err);
    }
  };
}]);
//# sourceMappingURL=.munchkins.js.map