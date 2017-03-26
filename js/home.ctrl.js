app.controller('HomeCtrl', function($scope, $location, $mdDialog, $mdToast, $rootScope, $routeParams, $http, $window, $log, $document, $mdSidenav, $mdToast, $timeout, nlp) {
  $scope.signUpCard = function(ev) {
    $mdDialog.show({
      controller:'HomeCtrl',
      templateUrl: 'templates/signup.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
      }, function() {
      });
  };
  $scope.createUser=function (user) {
    var url=URL_PREFIX+'api/register/'
    $http({
         method: "POST",
         data:{
           'email':user.email,
           'password':user.password
         },
         headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
         url: url
       }).then(function successCallback(response) {
         if (response.status=200){
           $mdDialog.cancel();
           $mdToast.show(
             $mdToast.simple()
             .textContent('User created sucessfully!')
             .position('bottom right')
             .hideDelay(3000)
           );
         };
       }, function errorCallback(error) {
         if (error.status=302){
           $mdDialog.cancel();
           $mdToast.show(
             $mdToast.simple()
             .textContent('User already exist!')
             .position('bottom right')
             .hideDelay(3000)
           );
         };
     });
  };
  $scope.logInCard = function(ev) {
    $mdDialog.show({
      controller:'HomeCtrl',
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
  $scope.logInUser=function (user) {
    console.log(user);
    var url=URL_PREFIX+'login/'
    $http({
         method: "POST",
         data:{
           'email':user.email,
           'password':user.password
         },
         headers: {
            'client_id':CLIENT_ID,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
         url: url
       }).then(function successCallback(response) {
       }, function errorCallback(error) {
     });
  };

});






















// $scope.getOrders=function(){
//   $scope.orders=[];
//   $scope.graphdata=[];
//   $http.post('php/orderQueries.php').then(function(data) {
//       var ln=data.data.length;
//       for (i= 0;i<ln; i++) {
//         $scope.orders.push(data.data[i]);
//         // if(ln-30<=i){
//         //   $scope.graphdata.push({x:ln-i-1,y:data.data[i].price});
//         // }
//         $scope.graphdata.push({x:i+1,y:data.data[i].price});
//         // console.log($scope.graphdata);
//         // console.log(data.data[i]);
//       };
//     // console.log(data.data);
//   }, function() {
//
//   });
// };
// $scope.getOrders();
//   $scope.series = ['Series A', 'Series B'];
//   $scope.data=[]
//   $scope.data.push($scope.graphdata);
//   console.log($scope.data);
//   $scope.onClick = function (points, evt) {
//     console.log(points, evt);
//   };
//   $scope.options = {
//     scales: {
//       yAxes: [
//         {
//           id: 'y-axis-1',
//           type: 'linear',
//           display: true,
//           position: 'left'
//         }
//       ],
//       xAxes: [{
//                type: 'linear',
//                position: 'bottom'
//            }]
//     },
//     pan: {
//             // Boolean to enable panning
//             enabled: true,
//
//             // Panning directions. Remove the appropriate direction to disable
//             // Eg. 'y' would only allow panning in the y direction
//             mode: 'xy'
//         },
//
//         // Container for zoom options
//         zoom: {
//             // Boolean to enable zooming
//             enabled: true,
//
//             // Zooming directions. Remove the appropriate direction to disable
//             // Eg. 'y' would only allow zooming in the y direction
//             mode: 'xy',
//         }
//   };
// });
