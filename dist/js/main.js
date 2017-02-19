var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute','chart.js']);
app.controller('myCtrl', function($scope,$location,$mdDialog,$mdToast,$rootScope, $routeParams,$http, $mdSidenav,$timeout) {
  $scope.signup = function(ev) {
    $mdDialog.show({
      controller:'myCtrl',
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

$scope.getOrders=function(){
  $scope.orders=[];
  $scope.graphdata=[];
  $http.post('php/orderQueries.php').then(function(data) {
      var ln=data.data.length;
      for (i= 0;i<ln; i++) {
        $scope.orders.push(data.data[i]);
        // if(ln-30<=i){
        //   $scope.graphdata.push({x:ln-i-1,y:data.data[i].price});
        // }
        $scope.graphdata.push({x:i+1,y:data.data[i].price});
        // console.log($scope.graphdata);
        // console.log(data.data[i]);
      };
    // console.log(data.data);
  }, function() {

  });
};
$scope.getOrders();
  $scope.series = ['Series A', 'Series B'];
  $scope.data=[]
  $scope.data.push($scope.graphdata);
  console.log($scope.data);
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ],
      xAxes: [{
               type: 'linear',
               position: 'bottom'
           }]
    },
    pan: {
            // Boolean to enable panning
            enabled: true,

            // Panning directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy'
        },

        // Container for zoom options
        zoom: {
            // Boolean to enable zooming
            enabled: true,

            // Zooming directions. Remove the appropriate direction to disable
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'xy',
        }
  };
  $scope.doLogin = function (adminuser) {
    console.log(adminuser);
    Data.post('login', {
          adminuser: adminuser
      }).then(function (results) {
        // console.log(results);
        $mdToast.show(
            $mdToast.simple()
              .textContent(results.message)
              .hideDelay(5000)
              .position('right bottom')
          );
          if (results.status == "success") {
            console.log(results);
              // $location.path('dashboard');
          }
      });
  };
});

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
app.config(['$routeProvider','$locationProvider',
  function ($routeProvider,$locationProvider) {
      $routeProvider
      .when('/', {
          title: 'Home',
          templateUrl: 'templates/home.html',
          controller: 'myCtrl'
      })
      .when('/data', {
          title: 'Home',
          templateUrl: 'templates/data.html',
          controller: 'myCtrl'
      })
      .otherwise({
          redirectTo: '/'
      });
      $locationProvider.html5Mode(false);
  }])
//   app.run(function ($rootScope, $location, Data) {
//     $rootScope.$on("$routeChangeStart", function (event, next, current) {
//         $rootScope.authenticated = false;
//         Data.get('session').then(function (results) {
//             if (results.uid) {
//                 $rootScope.authenticated = true;
//                 $rootScope.uid = results.uid;
//                 $rootScope.name = results.name;
//                 $rootScope.email = results.email;
//             } else {
//                 var nextUrl = next.$$route.originalPath;
//                 if (nextUrl == '/signup' || nextUrl == '/login') {
//
//                 } else {
//                     $location.path("/login");
//                 }
//             }
//         });
//     });
// });
// app.factory("Data", ['$http',
//     function ($http) {
//
//         var serviceBase = 'api/v1/index.php/';
//
//         var obj = {};
//         obj.toast = function (data) {
//             toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
//         }
//         obj.get = function (q) {
//             return $http.get(serviceBase + q).then(function (results) {
//                 return results.data;
//             });
//         };
//         obj.post = function (q, object) {
//             return $http.post(serviceBase + q, object).then(function (results) {
//                 return results.data;
//             });
//         };
//         obj.put = function (q, object) {
//             return $http.put(serviceBase + q, object).then(function (results) {
//                 return results.data;
//             });
//         };
//         obj.delete = function (q) {
//             return $http.delete(serviceBase + q).then(function (results) {
//                 return results.data;
//             });
//         };
//
//         return obj;
// }]);
