app.controller("FileCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  $rootScope.getUserFiles=function () {
    var url=URL_PREFIX+'api/p/eng/';
    // console.log($scope.selectedItem);
    $http({
         method: "GET",
         headers: {
            'Content-Type': CONTENT_TYPE,
            'Authorization':AUTHORIZATION
          },
         url: url
       }).then(function successCallback(response) {
        //  console.log(response);
         $rootScope.userFiles=response.data;
         $rootScope.fileLoading=response.status;
       }, function errorCallback(error) {
         if(error.status==401){
           console.log("Unauthorized");
           $window.localStorage.userInfo = null;
           $window.location.reload();
         }
     });
  }
  if ($rootScope.userFiles===null || $rootScope.userFiles===undefined){
      $rootScope.getUserFiles();
  }
  $scope.createStrategy=function(){
    $location.path("/trader");
    var file='untitled'
    $window.sessionStorage.selectedFile=JSON.stringify(file);
  };
  $scope.editFile=function (file) {
    $location.path("/trader");
    $window.sessionStorage.selectedFile=JSON.stringify(file);
  };
  $scope.backTest=function(file){
    $location.path("/backtest");
    $window.sessionStorage.selectedFile=JSON.stringify(file);
  };
  $scope.paperTrade=function(file){
    $location.path("/papertrade");
    $window.sessionStorage.selectedFile=JSON.stringify(file);
    $rootScope.selectedFile=file;
  };
});
