'use strict';

angular.module('munchkins', ['ngRoute']).constant('Defaults', {
  TICK_RATE: 250,
  SAVE_RATE: 60000,
  SAVE_LOCATION: 'munchkinsSave'
}).config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/buildings', { templateUrl: 'views/buildings.html' }).when('/tribe', { templateUrl: 'views/tribe.html' }).otherwise({ redirectTo: '/buildings' });
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

angular.module('munchkins').controller('Submenu', ["$location", "Buildings", "Tribe", function ($location, Buildings, Tribe) {
  this.totalTribe = Tribe.total;
  this.totalBuildings = Buildings.activeTotal;

  this.isOn = function (path) {
    return $location.path() === path;
  };
}]);
'use strict';

angular.module('munchkins').controller('Topmenu', ["Storage", function (Storage) {
  this.save = Storage.save;
}]);
'use strict';

angular.module('munchkins').controller('Tribe', ["Tribe", function (Tribe) {
  this.total = Tribe.total;
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

angular.module('munchkins').service('Actions', ["Buildings", "Crafting", "Resources", "Tribe", function (Buildings, Crafting, Resources, Tribe) {
  var unlockAll = function unlockAll() {
    var unlock = function unlock(buildings) {
      _.forEach(buildings, function (building) {
        if (building.locked) {
          (function () {
            var locked = false;

            _.forEach(building.requires.buildings, function (b, k) {
              if (!locked) {
                locked = !(Buildings.get(k).value.current >= b.value);
              }
            });

            _.forEach(building.requires.resources, function (r, k) {
              if (!locked) {
                building.locked = !(Resources.get(k).value.current >= r.value);
              }
            });

            if (!locked) {
              Buildings.activate(building);
            }
          })();
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

    Tribe.add(building.provides.tribe || 0);

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
    shelter: {
      name: 'Shelter',
      description: 'A basic shelter made from flower stems',
      locked: true,
      increase: 1.1,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          stems: { value: 100 }
        }
      },
      provides: {
        tribe: 1
      }
    }
  };

  var activeTotal = 0;
  this.activeTotal = function () {
    return activeTotal;
  };

  this.activate = function (building) {
    activeTotal++;
    building.locked = false;
  };

  this.all = function () {
    return _.filter(buildings, {});
  };

  this.get = function (key) {
    return buildings[key];
  };

  this.save = function (to) {
    _.forEach(buildings, function (b, k) {
      to[k] = {
        value: b.value,
        locked: b.locked
      };
    });
  };

  this.load = function (from) {
    _.forEach(from, function (b, k) {
      var building = buildings[k];

      building.value = b.value;
      building.locked = b.locked;
      if (!building.locked) {
        activeTotal++;
      }
    });
  };
});
'use strict';

angular.module('munchkins').service('Crafting', function () {
  var crafting = {
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
    processing: {
      name: 'Process Flowers',
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

  this.save = function (to) {
    _.forEach(crafting, function (c, k) {
      to[k] = {
        value: c.value,
        locked: c.locked
      };
    });
  };

  this.load = function (from) {
    _.forEach(from, function (c, k) {
      var craft = crafting[k];
      craft.value = c.value;
      craft.locked = c.locked;
    });
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

  this.save = function (to) {
    to.ticks = game.ticks;
  };

  this.load = function (from) {
    game.ticks = from.ticks || game.ticks;
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

  this.save = function (to) {
    _.forEach(resources, function (r, k) {
      to[k] = {
        value: r.value
      };
    });
  };

  this.load = function (from) {
    _.forEach(from, function (r, k) {
      resources[k].value = r.value;
    });
  };
});
'use strict';

angular.module('munchkins').service('Storage', ["$interval", "Defaults", "Buildings", "Crafting", "Game", "Resources", "Tribe", function ($interval, Defaults, Buildings, Crafting, Game, Resources, Tribe) {
  this.save = function () {
    console.log('Saving game');
    try {
      var save = {
        version: 1,
        buildings: {},
        crafting: {},
        game: {},
        resources: {},
        tribe: {}
      };

      Buildings.save(save.buildings);
      Crafting.save(save.crafting);
      Game.save(save.game);
      Resources.save(save.resources);
      Tribe.save(save.tribe);

      localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify(save));
    } catch (err) {
      console.error(err);
    }
  };

  this.load = function () {
    console.log('Loading game');
    try {
      var load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

      Buildings.load(load.buildings || {});
      Crafting.load(load.crafting || {});
      Game.load(load.game || {});
      Resources.load(load.resources || {});
      Tribe.load(load.tribe || {});
    } catch (err) {
      console.error(err);
    }
  };
}]);
'use strict';

angular.module('munchkins').service('Tribe', function () {
  var tribe = {
    free: 0
  };

  this.add = function (number) {
    tribe.free += number;
  };

  this.total = function () {
    return tribe.free;
  };

  this.save = function (to) {
    to.free = tribe.free;
  };

  this.load = function (from) {
    tribe.free = from.free || tribe.free;
  };
});
//# sourceMappingURL=.munchkins.js.map