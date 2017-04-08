app.controller("PapertradeCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  if (Auth.getUserInfo().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  }
  if ($rootScope.selectedFile===undefined || $rootScope.selectedFile===null){
    $location.path('/file')
  }
  $scope.togglePapertrade=function (ev) {
    if($rootScope.selectedFile.is_active===true){
      var confirm = $mdDialog.confirm()
          .title('Stop Papertrade')
          .textContent('Are you sure you want to stop Papertrade?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        var url=URL_PREFIX+'api/p/eng/'+$rootScope.selectedFile.pk+'/';
        $http({
             method: "PUT",
             data:{
               is_active:false
             },
             headers: {
                'Content-Type': CONTENT_TYPE,
                'Authorization':AUTHORIZATION
              },
             url: url
           }).then(function successCallback(response) {
             console.log(response);
             $mdToast.show(
               $mdToast.simple()
               .textContent('Papertrade Stopped!')
               .position('bottom right')
               .hideDelay(3000)
             );
             $rootScope.selectedFile.is_active=false;
           }, function errorCallback(error) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('Something went wrong,Please Try again')
               .position('bottom right')
               .hideDelay(3000)
             );
           });
      }, function() {

      });
    }
    else{
      $scope.isPapertradeRunning=false;
      for(var i=0;i<$rootScope.userFiles.length;i++){
        if($rootScope.userFiles[i].is_active){
          $scope.isPapertradeRunning=true;
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Papertrade Running')
              .textContent($rootScope.userFiles[i].name+' already running, please stop first')
              .ariaLabel('Alert Dialog Demo')
              .ok('Got it!')
              .targetEvent(ev)
          );
          break;
        }
      }
      if(!$scope.isPapertradeRunning){
        console.log(AUTHORIZATION);
        var url=URL_PREFIX+'api/p/eng/'+$rootScope.selectedFile.pk+'/';
        $http({
             method: "PUT",
             data:{
               is_active:true
             },
             headers: {
                'Content-Type': CONTENT_TYPE,
                'Authorization':AUTHORIZATION
              },
             url: url
           }).then(function successCallback(response) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('Papertrade Strated!')
               .position('bottom right')
               .hideDelay(3000)
             );
             $rootScope.selectedFile.is_active=true;
           }, function errorCallback(error) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('Something went wrong,Please Try again')
               .position('bottom right')
               .hideDelay(3000)
             );
           });
      }
    }
  }
});
