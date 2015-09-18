var app = angular.module('app', ['ngRoute', 'ngGrid', 'restangular']);

app.config([
  '$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/keywords/partials/editor.html',
      controller: 'KeywordsController'
    });
  }
]);
