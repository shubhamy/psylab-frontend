var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute']);
// using angular material without any default theme
app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('teal', {
     'default': '400', // by default use shade 400 from the pink palette for primary intentions
     'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
     'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
     'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('orange');
});

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

app.controller('myCtrl', function($scope,$location,$mdDialog,$mdToast) {
  $scope.signup = function(ev,event) {
    $mdDialog.show({
      controller: function ($mdDialog) {
                 var vm = this;
                 vm.event = {};
                 vm.event = event;  //your task object from the ng-repeat

                 $scope.hide = function () {
                     $mdDialog.hide();
                 };
                 $scope.cancel = function () {
                     $mdDialog.cancel();
                 };
             },
      controllerAs: 'infomodal',
      templateUrl: 'templates/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    }, function() {
    });
  };

});
