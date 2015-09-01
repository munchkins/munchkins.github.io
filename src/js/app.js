'use strict';

angular
  .module('munchkins', ['ngRoute'])
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
