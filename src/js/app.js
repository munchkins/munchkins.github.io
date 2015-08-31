'use strict';

angular.module('munchkins.controllers', []);
angular.module('munchkins.services', []);
angular.module('munchkins.values', []);

angular
  .module('munchkins', [
    'ngRoute',
    'munchkins.controllers',
    'munchkins.services',
    'munchkins.values'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/buildings', { templateUrl: 'views/buildings.html' })
      .otherwise({ redirectTo: '/buildings' });
  });
