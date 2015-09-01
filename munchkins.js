'use strict';

angular.module('munchkins', ['ngRoute']).constant('Defaults', {
  TICK_RATE: 250,
  SAVE_RATE: 60000,
  SAVE_LOCATION: 'munchkinsSave'
}).config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/buildings', { templateUrl: 'views/buildings.html' }).otherwise({ redirectTo: '/buildings' });
}]);
'use strict';

angular.module('munchkins').controller('Buildings', ["Actions", "Buildings", function (Actions, Buildings) {
  this.buildings = Buildings.all();

  this.buy = Actions.buy;
  this.isBuyable = Actions.isBuyable;
  this.prices = Actions.prices;
}]);
'use strict';

angular.module('munchkins').controller('Crafting', ["Actions", "Crafting", function (Actions, Crafting) {
  this.crafting = Crafting.all();

  this.buy = Actions.buy;
  this.isBuyable = Actions.isBuyable;
  this.prices = Actions.prices;
}]);
'use strict';

angular.module('munchkins').controller('Game', ["$interval", "Defaults", "Game", "Actions", "Resources", "Storage", function ($interval, Defaults, Game, Actions, Resources, Storage) {
  var tickloop = function tickloop() {
    Game.all().ticks++;

    var resources = Resources.all();
    _.forEach(resources, function (resource) {
      resource.value.current += resource.rate;
      if (resource.value.limit) {
        resource.value.current = Math.min(resource.value.current, resource.value.limit);
      }
    });
  };

  Storage.load();
  Actions.initResources();

  $interval(Storage.save, Defaults.SAVE_RATE);
  $interval(tickloop, Defaults.TICK_RATE);
}]);
'use strict';

angular.module('munchkins').controller('Log', function () {});
'use strict';

angular.module('munchkins').controller('Resources', ["Resources", function (Resources) {
  this.resources = Resources.all();
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

angular.module('munchkins').service('Actions', ["Buildings", "Crafting", "Resources", function (Buildings, Crafting, Resources) {
  var unlockAll = function unlockAll() {
    var unlock = function unlock(buildings) {
      _.forEach(buildings, function (building) {
        if (building.locked) {
          building.locked = false;

          _.forEach(building.requires.buildings, function (b, k) {
            if (!building.locked) {
              building.locked = !(Buildings.get(k).value.current >= b.value);
            }
          });

          _.forEach(building.requires.resources, function (r, k) {
            if (!building.locked) {
              building.locked = !(Resources.get(k).value.current >= r.value);
            }
          });
        }
      });
    };

    unlock(Buildings.all());
    unlock(Crafting.all());
  };

  this.isBuyable = function (building) {
    var incr = Math.pow(building.increase, building.value.current);
    var buyable = true;

    _.forEach(building.requires.resources, function (r, k) {
      if (buyable) {
        buyable = Resources.get(k).value.current >= r.value * incr;
      }
    });

    return buyable;
  };

  this.buy = function (building) {
    if (!this.isBuyable(building)) {
      return;
    }

    var incr = Math.pow(building.increase, building.value.current);

    building.value.current++;

    _.forEach(building.requires.resources, function (r, k) {
      Resources.get(k).value.current -= r.value * incr;
    });

    _.forEach(building.provides.resources, function (p, k) {
      var resource = Resources.get(k);
      resource.value.current += p.value;
      resource.rate += p.rate;
    });

    unlockAll();
  };

  this.prices = function (building) {
    var incr = Math.pow(building.increase, building.value.current);

    _.forEach(building.requires.resources, function (r, k) {
      var price = r.value * incr;
      var resource = Resources.get(k);

      r.buynow = price;
      r.affordable = resource.value.current >= price;
      r.name = resource.name;
    });

    return _.filter(building.requires.resources, {});
  };

  this.initResources = function () {
    var init = function init(buildings) {
      _.forEach(buildings, function (building) {
        _.forEach(building.provides.resources, function (p, k) {
          Resources.get(k).rate += building.value.current * p.rate;
        });
      });
    };

    init(Buildings.all());
    init(Crafting.all());
  };
}]);
'use strict';

angular.module('munchkins').service('Buildings', function () {
  var buildings = {
    meadow: {
      name: 'Flower Meadow',
      description: 'A naturally growing field of flowers',
      craft: false,
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
    }
  };

  this.all = function () {
    return _.filter(buildings, {});
  };

  this.get = function (key) {
    return buildings[key];
  };
});
'use strict';

angular.module('munchkins').service('Crafting', function () {
  var crafting = {
    collect: {
      name: 'Collect Flowers',
      description: 'Flowers are the staple of the Munchkin diet, collect them',
      craft: true,
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
    processing: {
      name: 'Process Flowers',
      description: 'Processes flowers into petals and stems',
      craft: true,
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
        resources: {
          stems: { value: 9, rate: 0 },
          petals: { value: 75, rate: 0 }
        }
      }
    }
  };

  this.all = function () {
    return _.filter(crafting, {});
  };

  this.get = function (key) {
    return crafting[key];
  };
});
'use strict';

angular.module('munchkins').service('Game', function () {
  var game = {
    ticks: 0
  };

  this.all = function () {
    return game;
  };
});
'use strict';

angular.module('munchkins').service('Resources', function () {
  var resources = {
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
    }
  };

  this.all = function () {
    return _.filter(resources, {});
  };

  this.get = function (key) {
    return resources[key];
  };
});
'use strict';

angular.module('munchkins').service('Storage', ["$interval", "Defaults", "Game", "Buildings", "Crafting", "Resources", function ($interval, Defaults, Game, Buildings, Crafting, Resources) {
  this.save = function () {
    console.log('Saving game');
    try {
      (function () {
        var save = {
          version: 1,
          game: {},
          resources: {},
          buildings: {}
        };

        var saveBuildings = function saveBuildings(buildings) {
          _.forEach(buildings, function (b, k) {
            save.buildings[k] = {
              value: b.value,
              locked: b.locked
            };
          });
        };

        var saveGame = function saveGame(game) {
          save.game.ticks = game.ticks;
        };

        var resources = Resources.all();
        _.forEach(resources, function (r, k) {
          save.resources[k] = {
            value: r.value
          };
        });

        saveGame(Game.all());
        saveResources(Resources.all());
        saveBuildings(Buildings.all());
        saveBuildings(Crafting.all());

        localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
      })();
    } catch (err) {
      console.error(err);
    }
  };

  this.load = function () {
    console.log('Loading game');
    try {
      (function () {
        var load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION));

        load.game = load.game || {};
        load.resources = load.resources || {};
        load.buildings = load.buildings || {};

        var loadGame = function loadGame(game) {
          game.ticks = load.game.ticks || game.ticks;
        };

        var loadResources = function loadResources() {
          _.forEach(load.resources, function (r, k) {
            var resource = Resources.get(k);
            resource.value = r.value;
          });
        };

        var loadBuildings = function loadBuildings() {
          _.forEach(load.buildings, function (b, k) {
            var building = Buildings.get(k) || Crafting.get(k);
            building.value = b.value;
            building.locked = b.locked;
          });
        };

        loadGame(Game.all());
        loadResources();
        loadBuildings();
      })();
    } catch (err) {
      console.error(err);
    }
  };
}]);
//# sourceMappingURL=.munchkins.js.map