'use strict';

angular.module('munchkins', ['ngRoute']).constant('Defaults', {
  TICK_RATE: 250,
  SAVE_RATE: 60000,
  SAVE_LOCATION: 'munchkinsSave',
  DAY_TICKS: 200,
  SEASON_DAYS: 98,
  SEASON_TICKS: 98 * 200,
  YEAR_DAYS: 4 * 98,
  YEAR_TICKS: 4 * 98 * 200
}).config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/buildings', { templateUrl: 'views/buildings.html' }).when('/tribe', { templateUrl: 'views/tribe.html' }).otherwise({ redirectTo: '/buildings' });
}]);
'use strict';

angular.module('munchkins').controller('Buildings', ["Actions", "Buildings", function (Actions, Buildings) {
  this.buildings = Buildings.all();

  this.buy = Actions.buy;

  this.isBuyable = Actions.isBuyable;
  this.hasRequires = Actions.hasRequires;
  this.hasProvides = Actions.hasProvides;

  this.requires = Actions.requires;
  this.provides = Actions.provides;
}]);
'use strict';

angular.module('munchkins').controller('Crafting', ["Actions", "Crafting", function (Actions, Crafting) {
  this.crafting = Crafting.all();

  this.buy = Actions.buy;

  this.isBuyable = Actions.isBuyable;
  this.hasRequires = Actions.hasRequires;
  this.hasProvides = Actions.hasProvides;

  this.requires = Actions.requires;
  this.provides = Actions.provides;
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
  this.allocTribe = Tribe.allocated;

  this.isOn = function (path) {
    return $location.path() === path;
  };
}]);
'use strict';

angular.module('munchkins').controller('Topbar', ["Game", function (Game) {
  this.save = Game.save;
  this.wipe = Game.wipe;
  this.calendar = Game.calendar;
  this.bonus = Game.bonus;
}]);
'use strict';

angular.module('munchkins').controller('Tribe', ["Actions", "Tribe", function (Actions, Tribe) {
  this.total = Tribe.total;
  this.free = Tribe.free;
  this.types = Tribe.all();

  this.buy = Actions.buy;

  this.isBuyable = Actions.isBuyable;
  this.hasRequires = Actions.hasRequires;
  this.hasProvides = Actions.hasProvides;

  this.requires = Actions.requires;
  this.provides = Actions.provides;
}]);
'use strict';

angular.module('munchkins').directive('actionButton', function () {
  return {
    restrict: 'E',
    scope: {
      ctrl: '=',
      item: '='
    },
    templateUrl: 'views/templates/actionButton.html'
  };
});
'use strict';

angular.module('munchkins').filter('numeric', function () {
  var units = ['', 'K', 'M', 'G', 'T', 'P'];

  return function (number, precision) {
    var n = Math.abs(number) || 0;
    var u = Math.floor(Math.log(n) / Math.log(1000));

    var p = precision || (precision === 0 ? 0 : 3);
    if (p === 0 && n >= 1000) {
      p = 3;
    }

    return n < 1 ? n.toFixed(p) : (n / Math.pow(1000, Math.floor(u))).toFixed(p) + units[u];
  };
});
'use strict';

angular.module('munchkins').service('Actions', ["Buildings", "Crafting", "Resources", "Tribe", function (Buildings, Crafting, Resources, Tribe) {
  this.unlock = function (item) {
    if (item.locked) {
      (function () {
        var locked = false;

        _.forEach(item.requires.buildings, function (b, k) {
          if (!locked) {
            locked = !(Buildings.get(k).value.current >= b.value);
          }
        });

        _.forEach(item.requires.resources, function (r, k) {
          if (!locked) {
            locked = !(Resources.get(k).value.current >= r.value);
          }
        });

        item.locked = locked;
      })();
    }
  };

  this.unlockAll = function () {
    _.forEach(Buildings.all(), this.unlock);
    _.forEach(Crafting.all(), this.unlock);
    _.forEach(Tribe.all(), this.unlock);
  };

  this.priceMultiplier = function (item) {
    return Math.pow(item.increase, item.value.current);
  };

  this.isBuyable = function (item) {
    var incr = this.priceMultiplier(item);
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

    var incr = this.priceMultiplier(item);
    item.value.current++;

    _.forEach(item.requires.resources, function (r, k) {
      var resource = Resources.get(k);
      resource.value.current -= (r.value || 0) * incr;
      resource.rate -= r.rate || 0;
    });

    _.forEach(item.provides.resources, function (p, k) {
      var resource = Resources.get(k);
      resource.value.current += p.value || 0;
      resource.rate += p.rate || 0;
    });

    Tribe.add(-1 * (item.requires.tribe || 0) + (item.provides.tribe || 0));

    this.unlockAll();

    return true;
  };

  this.provides = function (item) {
    _.forEach(item.provides.resources, function (r, k) {
      r.name = Resources.get(k).name;
    });

    return _.filter(item.provides.resources, {});
  };

  this.requires = function (item) {
    var incr = this.priceMultiplier(item);

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
      resource.rate += item.value.current * (p.rate || 0);
    });

    _.forEach(item.requires.resources, function (r, k) {
      var resource = Resources.get(k);
      resource.rate -= item.value.current * (r.rate || 0);
    });
  };

  this.initResources = function () {
    _.forEach(Buildings.all(), this.initResource);
    _.forEach(Tribe.all(), this.initResource);
  };
}]);
'use strict';

angular.module('munchkins').service('Buildings', function () {
  var buildings = {
    fire: {
      name: 'Fire',
      description: 'Fire is the center of the up-and-comming community, providing a place to cook and general happiness',
      increase: 1.11,
      requires: {
        resources: {
          stems: { value: 10, rate: 0.02 }
        }
      },
      provides: {
        resources: {
          happiness: { value: 0.95, rate: 0.001 },
          charcoal: { value: 0, rate: 0.0015 }
        }
      }
    },
    trap: {
      name: 'Trap',
      description: 'A small trap used to catch animals that wander across the path',
      increase: 1.11,
      requires: {
        resources: {
          stems: { value: 20, rate: 0 },
          seeds: { value: 5, rate: 0 }
        }
      },
      provides: {
        resources: {
          furs: { value: 0, rate: 0.001 }
        }
      }
    },
    shelter: {
      name: 'Shelter',
      description: 'A basic shelter made from flower stems with space for one Munchkin',
      increase: 1.11,
      requires: {
        resources: {
          furs: { value: 5, rate: 0 },
          stems: { value: 100, rate: 0 }
        }
      },
      provides: {
        tribe: 1
      }
    },
    garden: {
      name: 'Garden',
      description: 'A naturally growing field of flowers which can be harvested',
      increase: 1.11,
      requires: {
        resources: {
          seeds: { value: 75, rate: 0 },
          water: { value: 0, rate: 0.001 }
        }
      },
      provides: {
        resources: {
          flowers: { value: 0, rate: 0.01 },
          rocks: { value: 0, rate: 0.001 },
          trees: { value: 2 }
        }
      }
    },
    hut: {
      name: 'Hut',
      description: 'A rock and stem shelter that has space for two additional Munchkins',
      increase: 1.125,
      requires: {
        resources: {
          rocks: { value: 50, rate: 0 },
          furs: { value: 25, rate: 0 },
          stems: { value: 150, rate: 0 }
        }
      },
      provides: {
        tribe: 2
      }
    },
    pond: {
      name: 'Pond',
      description: 'A water collection point that porvides a clean source of water',
      increase: 1.11,
      requires: {
        resources: {
          rocks: { value: 50, rate: 0 },
          tools: { value: 10, rate: 0 }
        }
      },
      provides: {
        resources: {
          water: { value: 0, rate: 0.025 }
        }
      }
    },
    quarry: {
      name: 'Quarry',
      description: 'An area where rocks can be harvested for use in buildings and tools',
      increase: 1.11,
      requires: {
        resources: {
          rocks: { value: 80, rate: 0 },
          tools: { value: 15, rate: 0.0025 }
        }
      },
      provides: {
        resources: {
          rocks: { value: 0, rate: 0.01 }
        }
      }
    },
    monolith: {
      name: 'Monolith',
      description: 'A large religious structure that is made of rock, used in ceremonies accross Munchkinland',
      increase: 1.125,
      requires: {
        resources: {
          rocks: { value: 1000, rate: 0 },
          tools: { value: 500, rate: 0 }
        }
      }
    }
  };

  _.forEach(buildings, function (item) {
    item.increase = item.increase || 1.0;
    item.locked = _.isUndefined(item.locked) ? true : item.locked;
    item.value = item.value || { current: 0, max: 0, level: 0 };

    item.requires = item.requires || {};
    item.requires.resources = item.requires.resources || {};
    item.hasRequires = !!Object.keys(item.requires.resources).length;

    item.provides = item.provides || {};
    item.provides.resources = item.provides.resources || {};
    item.hasProvides = !!Object.keys(item.provides.resources).length;
  });

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
      if (building) {
        building.value = b.value;
        building.locked = b.locked;
      }
    });
  };
});
'use strict';

angular.module('munchkins').service('Crafting', function () {
  var crafting = {
    collect: {
      name: 'Gather Flowers',
      description: 'Flowers are the staple of the Munchkin diet, collect them',
      locked: false,
      provides: {
        resources: {
          flowers: { value: 1, rate: 0 }
        }
      }
    },
    processing: {
      name: 'Process Flowers',
      description: 'Processes and deconstructs flowers into petals, stems & edible components',
      requires: {
        resources: {
          flowers: { value: 10, rate: 0 }
        }
      },
      provides: {
        resources: {
          seeds: { value: 2, rate: 0 },
          stems: { value: 9, rate: 0 },
          petals: { value: 75, rate: 0 }
        }
      }
    },
    press: {
      name: 'Press Petals',
      description: 'Process flower petals into petal paper',
      requires: {
        resources: {
          petals: { value: 1000, rate: 0 }
        }
      },
      provides: {
        resources: {
          paper: { value: 2, rate: 0 }
        }
      }
    },
    hunt: {
      name: 'Hunt & Gather',
      description: 'Search for food, resources and items outside of the community',
      requires: {
        resources: {
          tools: { value: 50, rate: 0 }
        }
      },
      provides: {
        resources: {
          rocks: { value: 5, rate: 0 },
          seeds: { value: 25, rate: 0 },
          furs: { value: 7, rate: 0 }
        }
      }
    }
  };

  _.forEach(crafting, function (item) {
    item.increase = item.increase || 1.0;
    item.locked = _.isUndefined(item.locked) ? true : item.locked;
    item.value = item.value || { current: 0, max: 0, level: 0 };

    item.requires = item.requires || {};
    item.requires.resources = item.requires.resources || {};
    item.hasRequires = !!Object.keys(item.requires.resources).length;

    item.provides = item.provides || {};
    item.provides.resources = item.provides.resources || {};
    item.hasProvides = !!Object.keys(item.provides.resources).length;
  });

  this.all = function () {
    return _.filter(crafting, {});
  };

  this.keys = function () {
    return Object.keys(crafting);
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
      if (craft) {
        craft.value = c.value;
        craft.locked = c.locked;
      }
    });
  };
});
'use strict';

angular.module('munchkins').service('Game', ["$interval", "Actions", "Buildings", "Crafting", "Defaults", "Resources", "Tribe", function ($interval, Actions, Buildings, Crafting, Defaults, Resources, Tribe) {
  var game = {
    bonus: 0,
    ticks: 0,
    calendar: {
      day: 0,
      season: 0,
      year: 0
    }
  };

  this.game = function () {
    return game;
  };

  this.calendar = function () {
    return game.calendar;
  };

  this.calcCalendar = function () {
    var days = Math.floor(game.ticks / Defaults.DAY_TICKS);

    game.calendar.year = Math.floor(days / Defaults.YEAR_DAYS);
    game.calendar.season = Math.floor(days % Defaults.YEAR_DAYS / Defaults.SEASON_DAYS);
    game.calendar.day = days % Defaults.YEAR_DAYS % Defaults.SEASON_DAYS;
  };

  this.bonus = function () {
    return game.bonus;
  };

  this.calcBonus = function () {
    game.bonus = 0.01 * (game.ticks / Defaults.YEAR_TICKS);
  };

  this.tick = function () {
    game.ticks++;

    this.calcBonus();
    this.calcCalendar();

    var resources = Resources.all();
    _.forEach(resources, function (resource) {
      resource.gamerate = resource.rate; // (resource.rate * (1.0 + game.bonus));
      resource.value.current = Math.max(0, resource.gamerate + resource.value.current);
      if (resource.value.limit) {
        resource.value.current = Math.min(resource.value.current, resource.value.limit);
      }
    });
  };

  this.wipe = function () {
    console.log('Wiping game');
    localStorage.setItem(Defaults.SAVE_LOCATION, JSON.stringify({}));
  };

  this.save = function () {
    console.log('Saving game');
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
  };

  this.load = function () {
    console.log('Loading game');
    var load = JSON.parse(localStorage.getItem(Defaults.SAVE_LOCATION)) || {};

    game.ticks = (load.game || {}).ticks || game.ticks;

    Buildings.load(load.buildings || {});
    Crafting.load(load.crafting || {});
    Resources.load(load.resources || {});
    Tribe.load(load.tribe || {});
  };

  this.load();
  Actions.initResources();

  $interval(this.save, Defaults.SAVE_RATE);
  $interval(this.tick, Defaults.TICK_RATE);
}]);
'use strict';

angular.module('munchkins').service('Resources', function () {
  var resources = {
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
      description: 'Petal paper is a fine resource used in trade and science'
    },
    trees: {
      name: 'Trees',
      description: 'A naturally growing wood resource'
    },
    wood: {
      name: 'Wood',
      description: 'A product of trees, useful in creating additional structures'
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
    seeds: {
      name: 'Seeds',
      description: 'Seeds are is always needed as an edible resource, on this planet or another'
    },
    water: {
      name: 'Water',
      description: 'Water is a core resource used for drinking, feeding crops and as a base for production'
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

  _.forEach(resources, function (item) {
    item.rate = item.rate || 0;
    item.gamerate = 0;
    item.value = item.value || { current: 0, limit: 0 };
  });

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
      var resource = resources[k];
      if (resource) {
        resource.value = r.value;
      }
    });
  };
});
'use strict';

angular.module('munchkins').service('Tribe', function () {
  var types = {
    cook: {
      name: 'Cook',
      description: 'Processes flowers to make food for the tribe',
      requires: {
        buildings: {
          fire: { value: 1 }
        },
        resources: {
          flowers: { value: 0, rate: 0.04 }
        },
        tribe: 1
      },
      provides: {
        resources: {
          seeds: { value: 0, rate: 0.01 },
          stems: { value: 0, rate: 0.04 },
          petals: { value: 0, rate: 0.4 }
        }
      }
    },
    farmer: {
      name: 'Farmer',
      description: 'A farmer works the gardens for additional production of resources',
      requires: {
        buildings: {
          garden: { value: 1 }
        },
        tribe: 1
      },
      provides: {
        resources: {
          flowers: { value: 0, rate: 0.01 },
          rocks: { value: 0, rate: 0.001 },
          trees: { value: 2, rate: 0 }
        }
      }
    },
    woodcutter: {
      name: 'Woodcutter',
      description: 'A woodcutter cuts down trees, creating a supply of wood',
      requires: {
        buildings: {
          garden: { value: 5 }
        },
        resources: {
          trees: { value: 1, rate: 0.001 },
          tools: { value: 0, rate: 0.001 }
        },
        tribe: 1
      },
      provides: {
        resources: {
          wood: { value: 0, rate: 0.0175 }
        }
      }
    },
    tooler: {
      name: 'Tool Maker',
      description: 'The tribe member creates rock tools for use in hunting, cooking and farming',
      requires: {
        buildings: {
          quarry: { value: 1 }
        },
        resources: {
          rocks: { value: 0, rate: 0.025 }
        },
        tribe: 1
      },
      provides: {
        resources: {
          tools: { value: 0, rate: 0.0125 }
        }
      }
    },
    priest: {
      name: 'Priest',
      description: 'A core member of any religious ceremony, providing direct access to another world',
      requires: {
        buildings: {
          monolith: { value: 1 }
        },
        resources: {
          tools: { value: 0, rate: 0.001 }
        },
        tribe: 1
      },
      provides: {
        resources: {
          faith: { value: 0, rate: 0.0025 }
        }
      }
    }
  };

  var tribe = {
    free: 0,
    types: types
  };

  _.forEach(types, function (item) {
    item.increase = item.increase || 1.0;
    item.locked = _.isUndefined(item.locked) ? true : item.locked;
    item.value = item.value || { current: 0, max: 0, level: 0 };

    item.requires = item.requires || {};
    item.requires.resources = item.requires.resources || {};
    item.requires.resources.seeds = { value: 0, rate: 0.0025 };
    item.requires.resources.water = { value: 0, rate: 0.0025 };
    item.hasRequires = !!Object.keys(item.requires.resources).length;

    item.provides = item.provides || {};
    item.provides.resources = item.provides.resources || {};
    item.hasProvides = !!Object.keys(item.provides.resources).length;
  });

  this.all = function () {
    return _.filter(types, {});
  };

  this.keys = function () {
    return Object.keys(types);
  };

  this.get = function (type) {
    return types[type];
  };

  this.add = function (number) {
    tribe.free += number;
  };

  this.free = function () {
    return tribe.free;
  };

  this.total = function () {
    var count = 0;
    _.forEach(types, function (type) {
      count += type.value.current;
    });
    return tribe.free + count;
  };

  this.allocated = function () {
    return this.total() - this.free();
  };

  this.save = function (to) {
    to.free = tribe.free;
    to.types = {};
    _.forEach(types, function (type, key) {
      to.types[key] = {
        locked: type.locked,
        value: type.value
      };
    });
  };

  this.load = function (from) {
    tribe.free = from.free || tribe.free;
    _.forEach(from.types, function (t, k) {
      var type = types[k];
      if (type) {
        type.locked = t.locked;
        type.value = t.value;
      }
    });
  };
});
//# sourceMappingURL=.munchkins.js.map