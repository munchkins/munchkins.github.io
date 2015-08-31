"use strict";angular.module("munchkins",["ngRoute"]).constant("Defaults",{TICK_RATE:250,SAVE_RATE:6e4,SAVE_LOCATION:"munchkinsSave"}).config(["$routeProvider",function(e){e.when("/buildings",{templateUrl:"views/buildings.html"}).otherwise({redirectTo:"/buildings"})}]);
"use strict";angular.module("munchkins").controller("Buildings",["Buildings","Resources",function(r,e){var u=function(){angular.forEach(r,function(r){r.locked&&(r.locked=!1,angular.forEach(r.requires.resources,function(u,a){r.locked||angular.forEach(e,function(e,n){n===a&&(r.locked=!(e.value.current>=u.value))})}))})};this.getPrices=function(u){var a=Math.pow(r[u].increase,r[u].value.current);return angular.forEach(r[u].requires.resources,function(r,u){var n=r.value*a;r.buynow=n,r.affordable=e[u].value.current>=n,r.name=e[u].name}),r[u].requires.resources},this.isBuyable=function(u){var a=Math.pow(r[u].increase,r[u].value.current),n=!0;return angular.forEach(r[u].requires.resources,function(r,u){n=n&&e[u].value.current>=r.value*a}),n},this.getAll=function(){return r},this.buy=function(a){if(this.isBuyable(a)){var n=Math.pow(r[a].increase,r[a].value.current);r[a].value.current++,angular.forEach(r[a].requires.resources,function(r,u){e[u].value.current-=r.value*n}),angular.forEach(r[a].provides.resources,function(r,u){e[u].value.current++,e[u].rate+=r.rate}),u()}},angular.forEach(r,function(r){angular.forEach(r.provides.resources,function(r,u){e[u].rate+=r.rate})})}]);
"use strict";angular.module("munchkins").controller("Game",["$interval","Defaults","Game","Buildings","Resources","Storage",function(a,e,u,n,r,t){var l=function(){u.ticks++,angular.forEach(r,function(a){a.value.current+=a.rate,a.value.limit&&(a.value.current=Math.min(a.value.current,a.value.limit))})};t.load(),a(t.save,e.SAVE_RATE),a(l,e.TICK_RATE)}]);
"use strict";angular.module("munchkins").controller("Log",function(){});
"use strict";angular.module("munchkins").controller("Resources",["Resources",function(s){this.resources=s}]);
"use strict";angular.module("munchkins").service("Storage",["$interval","Defaults","Game","Resources","Buildings",function(e,a,o,c,r){this.save=function(){console.log("Saving game");try{!function(){var e={version:1,game:{},resources:{},buildings:{}};e.game.ticks=o.ticks,angular.forEach(c,function(a,o){e.resources[o]={value:a.value}}),angular.forEach(r,function(a,o){e.buildings[o]={value:a.value,locked:a.locked}}),localStorage.setItem(a.SAVE_LOCATION,JSON.stringify(e))}()}catch(e){console.error(e)}},this.load=function(){console.log("Loading game");try{var e=JSON.parse(localStorage.getItem(a.SAVE_LOCATION));e.game=e.game||{},e.resources=e.resources||{},e.buildings=e.buildings||{},o.ticks=e.game.ticks||o.ticks,angular.forEach(e.resources,function(e,a){c[a].value=e.value}),angular.forEach(e.buildings,function(e,a){r[a].value=e.value,r[a].locked=e.locked})}catch(s){console.error(s)}}}]);
"use strict";angular.module("munchkins").value("Buildings",{collect:{name:"Collect Flowers",description:"Flowers are the staple of the Munchkin diet, collect them",locked:!1,increase:0,value:{current:0,max:0,level:0},requires:{},provides:{resources:{flowers:{value:1,rate:0}}}},meadow:{name:"Flower Meadow",description:"A naturally gorwing field of flowers",locked:!0,increase:1.1,value:{current:0,max:0,level:0},requires:{resources:{flowers:{value:100}}},provides:{resources:{flowers:{value:0,rate:.01}}}}});
"use strict";angular.module("munchkins").value("Game",{ticks:0});
"use strict";angular.module("munchkins").value("Resources",{flowers:{name:"Flowers",description:"Flowers are the staple of the Munchkin diet",value:{current:0,limit:0},rate:0}});
//# sourceMappingURL=.munchkins.js.map