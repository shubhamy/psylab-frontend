app.controller("FileCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  function getUserFiles(){
    var url=URL_PREFIX+'api/p/eng/';
    console.log($scope.selectedItem);
    $http({
         method: "GET",
         headers: {
            'Content-Type': CONTENT_TYPE,
            'Authorization':AUTHORIZATION
          },
         url: url
       }).then(function successCallback(response) {
         console.log(response);
         $rootScope.userFiles=response.data;
         $rootScope.fileLoading=response.status;
       }, function errorCallback(error) {
         if(error.status==401){
           userInfo = null;
           $window.sessionStorage.userInfo= null;
         }
     });
  }
  if ($rootScope.userFiles===null || $rootScope.userFiles===undefined){
    getUserFiles();
  }
  $scope.createStrategy=function(){
    $location.path("/trader");
    $rootScope.selectedFile=null;
  };
  $scope.editFile=function (file) {
    $location.path("/trader");
    $rootScope.selectedFile=file;
  };
  $scope.backTest=function(file){
    $location.path("/backtest");
    $rootScope.selectedFile=file;
  };
  $scope.paperTrade=function(file){
    $location.path("/papertrade");
    $rootScope.selectedFile=file;
  };
});
