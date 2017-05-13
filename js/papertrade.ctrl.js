app.controller("PapertradeCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  if (Auth.getUserInfo().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  }
  $scope.selectedFile = JSON.parse($window.sessionStorage["selectedFile"]);
  if ($scope.selectedFile===undefined || $scope.selectedFile===null){
    $location.path('/file');
  }
  $scope.togglePapertrade=function (ev) {
    if($scope.selectedFile.is_active===true){
      var confirm = $mdDialog.confirm()
          .title('Stop Papertrade')
          .textContent('Are you sure you want to stop Papertrade?')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.selectedFile.is_active='ko';
        var url=URL_PREFIX+'api/p/eng/'+$scope.selectedFile.pk+'/';
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
            //  console.log(response);
             $mdToast.show(
               $mdToast.simple()
               .textContent('Papertrade Stopped!')
               .position('bottom right')
               .hideDelay(3000)
             );
             $scope.selectedFile.is_active=false;
             $rootScope.getUserFiles();
             $window.sessionStorage["selectedFile"]=JSON.stringify($scope.selectedFile);
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
        $scope.selectedFile.is_active='ok';
        var url=URL_PREFIX+'api/p/eng/'+$scope.selectedFile.pk+'/';
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
             $scope.selectedFile.is_active=true;
             $rootScope.getUserFiles();
             $window.sessionStorage["selectedFile"]=JSON.stringify($scope.selectedFile);
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
  };
});
