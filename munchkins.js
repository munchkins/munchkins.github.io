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

angular.module('munchkins').controller('Game', function () {});
'use strict';

angular.module('munchkins').controller('Log', function () {});
'use strict';

angular.module('munchkins').controller('Resources', ["Resources", function (Resources) {
  this.resources = Resources.all();
}]);
'use strict';

angular.module('munchkins').controller('Subbar', ["$location", "Buildings", "Tribe", function ($location, Buildings, Tribe) {
  this.totalBuildings = Buildings.activeTotal;
  this.totalTribe = Tribe.total;

  this.allocTribe = function () {
    return Tribe.total() - Tribe.free();
  };

  this.isOn = function (path) {
    return $location.path() === path;
  };
}]);
'use strict';

angular.module('munchkins').controller('Topbar', ["Game", function (Game) {
  this.save = Game.save;
  this.calendar = Game.calendar;
}]);
'use strict';

angular.module('munchkins').controller('Tribe', ["Actions", "Tribe", function (Actions, Tribe) {
  this.total = Tribe.total;
  this.free = Tribe.free;
  this.types = Tribe.all();

  this.buy = Actions.buy;
  this.isBuyable = Actions.isBuyable;
  this.prices = Actions.prices;
}]);
'use strict';

angular.module('munchkins').filter('numeric', function () {
  var units = ['', 'K', 'M', 'G', 'T', 'P'];

  return function (number, precision) {
    var n = number || 0;
    var u = Math.floor(Math.log(n) / Math.log(1000));

    var p = precision || (precision === 0 ? 0 : 2);
    if (p === 0 && n >= 1000) {
      p = 2;
    }

    return n < 1 ? n.toFixed(p) : (n / Math.pow(1000, Math.floor(u))).toFixed(p) + units[u];
  };
});
'use strict';

angular.module('munchkins').service('Actions', ["Buildings", "Crafting", "Resources", "Tribe", function (Buildings, Crafting, Resources, Tribe) {
  var unlockAll = function unlockAll() {
    var unlockOne = function unlockOne(item) {
      if (item.locked) {
        (function () {
          var locked = false;

          _.forEach(item.requires.buildings, function (b, k) {
            if (!locked) {
              locked = !(Buildings.get(k).value.current >= b.value);
            }
          });

          _.forEach(item.requires.resources, function (r, k) {
            console.log(item.name, r, k);
            if (!locked) {
              locked = !(Resources.get(k).value.current >= r.value);
            }
          });

          item.locked = locked;
        })();
      }
    };

    _.forEach(Buildings.all(), unlockOne);
    _.forEach(Crafting.all(), unlockOne);
    _.forEach(Tribe.all(), unlockOne);
  };

  var priceMultiplier = function priceMultiplier(item) {
    return Math.pow(item.increase || 1, item.value.current);
  };

  this.isBuyable = function (item) {
    var incr = priceMultiplier(item);
    var buyable = !item.locked && Tribe.free() >= (item.requires.tribe || 0);

    _.forEach(item.requires.resources, function (r, k) {
      if (buyable) {
        buyable = Resources.get(k).value.current >= r.value * incr;
      }
    });

    return buyable;
  };

  this.buy = function (item) {
    if (!this.isBuyable(item)) {
      return false;
    }

    var incr = priceMultiplier(item);
    item.value.current++;

    _.forEach(item.requires.resources, function (r, k) {
      Resources.get(k).value.current -= r.value * incr;
    });

    _.forEach(item.provides.resources, function (p, k) {
      var resource = Resources.get(k);
      resource.value.current += p.value;
      resource.rate += Math.pow(p.rate, p.hyper ? item.value.current : 1);
    });

    Tribe.add(-1 * (item.requires.tribe || 0));
    Tribe.add(item.provides.tribe || 0);

    unlockAll();

    return true;
  };

  this.prices = function (item) {
    var incr = priceMultiplier(item);

    _.forEach(item.requires.resources, function (r, k) {
      var price = r.value * incr;
      var resource = Resources.get(k);

      r.buynow = price;
      r.affordable = resource.value.current >= price;
      r.name = resource.name;
    });

    return _.filter(item.requires.resources, {});
  };

  this.initResource = function (item) {
    _.forEach(item.provides.resources, function (p, k) {
      var resource = Resources.get(k);
      if (p.hyper) {
        for (var i = 1; i <= item.value.current; i++) {
          resource.rate += Math.pow(p.rate || 0, i);
        }
      } else {
        resource.rate += item.value.current * (p.rate || 0);
      }
    });

    _.forEach(item.requires.resources, function (r, k) {
      Resources.get(k).rate -= item.value.current * (r.rate || 0);
    });
  };

  this.initResources = function () {
    _.forEach(Buildings.all(), this.initResource);
    _.forEach(Crafting.all(), this.initResource);
    _.forEach(Tribe.all(), this.initResource);
  };
}]);
'use strict';

angular.module('munchkins').service('Buildings', function () {
  var buildings = {
    meadow: {
      name: 'Meadow',
      description: 'A naturally growing field of flowers',
      locked: true,
      increase: 1.11,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          flowers: { value: 100, rate: 0 }
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
      increase: 1.11,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          stems: { value: 100, rate: 0 }
        }
      },
      provides: {
        tribe: 1
      }
    },
    quarry: {
      name: 'Rock Quarry',
      description: 'An area where rocks can be harvested',
      locked: true,
      increase: 1.11,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          rocks: { value: 50, rate: 0 }
        }
      },
      provides: {
        resources: {
          rocks: { value: 0, rate: 0.01 }
        }
      }
    }
  };

  this.activeTotal = function () {
    var total = 0;
    _.forEach(buildings, function (building) {
      total += building.locked ? 0 : 1;
    });
    return total;
  };

  this.all = function () {
    return _.filter(buildings, {});
  };

  this.keys = function () {
    return Object.keys(buildings);
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
    },
    press: {
      name: 'Press Petals',
      description: 'Process petals into paper',
      locked: true,
      value: { current: 0, max: 0, level: 0 },
      requires: {
        resources: {
          petals: { value: 1000, rate: 0 }
        }
      },
      provides: {
        resources: {
          paper: { value: 1, rate: 0 }
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

angular.module('munchkins').service('Game', ["$interval", "Actions", "Buildings", "Crafting", "Defaults", "Resources", "Tribe", function ($interval, Actions, Buildings, Crafting, Defaults, Resources, Tribe) {
  var game = {
    ticks: 0,
    calendar: {
      day: 0,
      season: 0,
      year: 0
    }
  };

  var DAY_TICKS = 200;
  var SEASON_DAYS = 98;
  var YEAR_DAYS = 4 * SEASON_DAYS;

  var tick = function tick() {
    game.ticks++;

    var days = Math.floor(game.ticks / DAY_TICKS);
    game.calendar.year = Math.floor(days / YEAR_DAYS);
    game.calendar.season = Math.floor(days % YEAR_DAYS / SEASON_DAYS);
    game.calendar.day = days % YEAR_DAYS % SEASON_DAYS;

    var resources = Resources.all();
    _.forEach(resources, function (resource) {
      resource.value.current += resource.rate;
      if (resource.value.limit) {
        resource.value.current = Math.min(resource.value.current, resource.value.limit);
      }
    });
  };

  this.calendar = function () {
    return game.calendar;
  };

  this.save = function () {
    console.log('Saving game');
    try {
      var save = {
        version: 1,
        game: {
          ticks: game.ticks
        },
        buildings: {},
        crafting: {},
        resources: {},
        tribe: {}
      };

      Buildings.save(save.buildings);
      Crafting.save(save.crafting);
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

      game.ticks = (load.game || {}).ticks || game.ticks;

      Buildings.load(load.buildings || {});
      Crafting.load(load.crafting || {});
      Resources.load(load.resources || {});
      Tribe.load(load.tribe || {});
    } catch (err) {
      console.error(err);
    }
  };

  this.load();
  Actions.initResources();

  $interval(this.save, Defaults.SAVE_RATE);
  $interval(tick, Defaults.TICK_RATE);
}]);
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
    }
  };

  this.all = function () {
    return _.filter(resources, {});
  };

  this.keys = function () {
    return Object.keys(resources);
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

angular.module('munchkins').service('Tribe', function () {
  var tribe = {
    free: 0,
    types: {
      farmer: {
        name: 'Farmer',
        description: 'A farmer that works the meadows for additional production',
        locked: true,
        value: { current: 0 },
        requires: {
          buildings: {
            meadow: { value: 1 }
          },
          tribe: 1
        },
        provides: {
          resources: {
            flowers: { value: 0, rate: 0.01, hyper: true },
            rocks: { value: 0, rate: 0.001, hyper: true }
          }
        }
      }
    }
  };

  this.all = function () {
    return _.filter(tribe.types, {});
  };

  this.add = function (number) {
    tribe.free += number;
  };

  this.free = function () {
    return tribe.free;
  };

  this.total = function () {
    var count = 0;
    _.forEach(tribe.types, function (type) {
      count += type.value.current;
    });
    return tribe.free + count;
  };

  this.save = function (to) {
    to.free = tribe.free;
    to.types = {};
    _.forEach(tribe.types, function (type, key) {
      to.types[key] = {
        locked: type.locked,
        value: type.value
      };
    });
  };

  this.load = function (from) {
    tribe.free = from.free || tribe.free;
    _.forEach(from.types, function (t, k) {
      var type = tribe.types[k];
      type.locked = t.locked;
      type.value = t.value;
    });
  };
});
//# sourceMappingURL=.munchkins.js.map