"use strict";angular.module("munchkins",["ngRoute"]).constant("Defaults",{TICK_RATE:250,SAVE_RATE:6e4,SAVE_LOCATION:"munchkinsSave"}).config(["$routeProvider",function(e){e.when("/buildings",{templateUrl:"views/buildings.html"}).otherwise({redirectTo:"/buildings"})}]);
"use strict";angular.module("munchkins").controller("Buildings",["Buildings","Resources",function(r,u){this.buildings=r,this.buy=function(e){var n=r[e];n.value.current++,angular.forEach(n.requires.resources,function(r,e){var n=u[e];n.value.current-=r.value}),angular.forEach(n.provides.resources,function(r,e){var n=u[e];n.value.current++,n.rate+=r.rate})}}]);
"use strict";angular.module("munchkins").controller("Game",["$interval","Defaults","Game","Buildings","Resources","Storage",function(a,e,n,r,u,t){var c=function(){n.ticks++,angular.forEach(u,function(a,e){e.value.current+=e.rate})};t.load(),a(t.save,e.SAVE_RATE),a(c,e.TICK_RATE)}]);
"use strict";angular.module("munchkins").controller("Resources",["Resources",function(s){this.resources=s}]);
"use strict";angular.module("munchkins").service("Storage",["$interval","Defaults","Game","Resources","Buildings",function(e,a,o,n,u){this.save=function(){console.log("Saving game");try{!function(){var e={version:1,game:0,resources:{},buildings:{}};e.game.ticks=o.ticks,angular.forEach(n,function(a,o){e.resources[o]={value:a.value}}),angular.forEach(u,function(a,o){e.buildings[o]={value:a.value,unlocked:a.unlocked}}),localStorage.setItem(a.SAVE_LOCATION,JSON.stringify(e))}()}catch(e){console.error(e)}},this.load=function(){console.log("Loading game");try{var e=JSON.parse(localStorage.getItem(a.SAVE_LOCATION));e.game=e.game||{},e.resources=e.resources||{},e.buildings=e.buildings||{},o.ticks=e.game.ticks||o.ticks,angular.forEach(e.resources,function(e,a){n[a].value=e.value}),angular.forEach(e.buildings,function(e,a){u[a].value=e.value,u[a].unlocked=e.unlocked})}catch(c){console.error(c)}}}]);
"use strict";angular.module("munchkins").value("Buildings",{collectFlowers:{name:"Collect Flowers",description:"Flowers are the staple of the Munchkin diet, collect them",unlocked:!0,increase:0,value:{current:0,max:0,level:0},requires:{},provides:{resources:{flowers:{value:1,rate:0}}}}});
"use strict";angular.module("munchkins").value("Game",{ticks:0});
"use strict";angular.module("munchkins").value("Resources",{flowers:{name:"Flowers",description:"Flowers are the staple of the Munchkin diet",value:{current:0,limit:0},rate:0}});
//# sourceMappingURL=.munchkins.js.map