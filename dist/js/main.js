var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute']);
// using angular material without any default theme
app.constant("$MD_THEME_CSS","");
// route for diffrenet templates
app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
      .when('/', {
          title: 'Home',
          templateUrl: 'templates/home.html',
          controller: 'myCtrl'
      })
      .otherwise({
          redirectTo: '/'
      });
  }])

app.controller('myCtrl', function($scope,$location) {

});
