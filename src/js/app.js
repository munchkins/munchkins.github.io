'use strict';

angular
  .module('munchkins', ['ngRoute'])
  .constant('Defaults', {
    TICK_RATE: 250,
    SAVE_RATE: 60000,
    SAVE_LOCATION: 'munchkinsSave',
    DAY_TICKS: 200,
    SEASON_DAYS: 98,
    YEAR_DAYS: 4 * 98,
    YEAR_TICKS: 4 * 98 * 200
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/buildings', { templateUrl: 'views/buildings.html' })
      .when('/tribe', { templateUrl: 'views/tribe.html' })
      .otherwise({ redirectTo: '/buildings' });
  });
