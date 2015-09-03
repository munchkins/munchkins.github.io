'use strict';

angular.module('munchkins.controllers', []);
angular.module('munchkins.filters', []);
angular.module('munchkins.services', []);

angular
  .module('munchkins', [
    'ngRoute',
    'munchkins.controllers',
    'munchkins.filters',
    'munchkins.services'
  ])
  .constant('Defaults', {
    TICK_RATE: 250,
    SAVE_RATE: 60000,
    SAVE_LOCATION: 'munchkinsSave'
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/buildings', { templateUrl: 'views/buildings.html' })
      .when('/tribe', { templateUrl: 'views/tribe.html' })
      .otherwise({ redirectTo: '/buildings' });
  });
