angular
  .module('munchkins')
  .directive('actionButton', function() {
    return {
      restrict: 'E',
      scope: {
        ctrl: '=',
        item: '='
      },
      templateUrl: 'views/templates/actionButton.html'
    };
  });
