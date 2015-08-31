"use strict";angular.module("munchkins",["ngRoute"]).constant("Defaults",{TICK_RATE:250,SAVE_RATE:6e4,SAVE_LOCATION:"munchkinsSave"}).config(["$routeProvider",function(e){e.when("/buildings",{templateUrl:"views/buildings.html"}).otherwise({redirectTo:"/buildings"})}]);
"use strict";angular.module("munchkins").service("Storage",["$interval","Defaults","Game","Resources","Buildings",function(e,o,c,s,a){this.save=function(){console.log("Saving game");try{!function(){var e={version:1,game:0,resources:{},buildings:{}};e.game.ticks=c.ticks,_.forEach(s,function(o,c){e.resources[c]={value:o.value}}),_.forEach(a,function(o,c){e.buildings[c]={value:o.value,unlocked:o.unlocked}}),localStorage.setItem(o.SAVE_LOCATION,JSON.stringify(e))}()}catch(e){console.error(e)}},this.load=function(){console.log("Loading game");try{var e=JSON.parse(localStorage.getItem(o.SAVE_LOCATION));e.game=e.game||{},e.resources=e.resources||{},e.buildings=e.buildings||{},c.ticks=e.game.ticks||c.ticks,_.forEach(e.resources,function(e,o){s[o].value=e.value}),_.forEach(e.buildings,function(e,o){a[o].value=e.value,a[o].unlocked=e.unlocked})}catch(n){console.error(n)}}}]);
"use strict";angular.module("munchkins").controller("Buildings",["Buildings","Resources",function(r,u){this.buildings=r,this.buy=function(e){var n=r[e];n.value.current++,_.forEach(n.requires.resources,function(r,e){var n=u[e];n.value.current-=r.value}),_.forEach(n.provides.resources,function(r,e){var n=u[e];n.value.current++,n.rate+=r.rate})}}]);
"use strict";angular.module("munchkins").controller("Game",["$interval","Defaults","Game","Buildings","Resources","Storage",function(e,a,n,r,t,u){var c=function(){n.ticks++,_.forEach(t,function(e,a){a.value.current+=a.rate})};u.load(),e(u.save,a.SAVE_RATE),e(c,a.TICK_RATE)}]);
"use strict";angular.module("munchkins").controller("Resources",["Resources",function(s){this.resources=s}]);
"use strict";angular.module("munchkins").value("Buildings",{collectFlowers:{name:"Collect Flowers",description:"Flowers are the staple of the Munchkin diet, collect them",unlocked:!0,increase:0,value:{current:0,max:0,level:0},requires:{},provides:{resources:{flowers:{value:1,rate:0}}}}});
"use strict";angular.module("munchkins").value("Game",{ticks:0});
"use strict";angular.module("munchkins").value("Resources",{flowers:{name:"Flowers",description:"Flowers are the staple of the Munchkin diet",value:{current:0,limit:0},rate:0}});
//# sourceMappingURL=.munchkins.js.map