"use strict";angular.module("munchkins.controllers",[]),angular.module("munchkins.services",[]),angular.module("munchkins.values",[]),angular.module("munchkins",["ngRoute","munchkins.controllers","munchkins.services","munchkins.values"]).config(["$routeProvider",function(n){n.when("/buildings",{templateUrl:"views/buildings.html"}).otherwise({redirectTo:"/buildings"})}]);
"use strict";angular.module("munchkins.controllers").controller("Buildings",["Buildings",function(i){this.buildings=i}]);
"use strict";angular.module("munchkins.controllers").controller("Game",["$interval","Const","Buildings","Game","Resources","Storage",function(n,e,o,r,s,t){n(t.save,e.SAVE_RATE),n(function(){},e.TICK_RATE)}]);
"use strict";angular.module("munchkins.services").service("Storage",["$interval","Const","Resources","Buildings",function(e,o,n,c){this.save=function(){console.log("Saving game");try{!function(){var e={version:1,resources:{},buildings:{}};_.forEach(n,function(o,n){e.resources[n]={value:o.value}}),_.forEach(c,function(o,n){e.buildings[n]={value:o.value,unlocked:o.unlocked}}),localStorage.setItem(o.SAVE_LOCATION,JSON.stringify(e))}()}catch(e){console.error(e)}},this.load=function(){console.log("Loading game");try{var e=JSON.parse(localStorage.getItem(o.SAVE_LOCATION));_.forEach(e.resources,function(e,o){n[o].value=e.value}),_.forEach(e.buildings,function(e,o){c[o].value=e.value,c[o].unlocked=e.unlocked})}catch(r){console.error(r)}}}]);
"use strict";angular.module("munchkins.values").value("Buildings",{collectFlowers:{name:"Collect Flowers",description:"Flowers are the staple of the Munchkin diet, collect them",unlocked:!0,increase:0,value:{current:0,max:0,level:0},requires:{},provides:{resources:{flowers:{value:1,rate:0}}}}});
"use strict";angular.module("munchkins.values").constant("Const",{TICK_RATE:250,SAVE_RATE:6e4,SAVE_LOCATION:"munchkinsSave"});
"use strict";angular.module("munchkins.values").value("Game",{});
"use strict";angular.module("munchkins.values").value("Resources",{flowers:{name:"Flowers",description:"Flowers are the staple of the Munchkin diet",value:{current:0,limit:0},rate:0}});
//# sourceMappingURL=.munchkins.js.map