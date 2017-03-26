app.controller("CodeEditorCtrl", function($scope, $rootScope, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $window, $log, $document, nlp) {

  $scope.selectedFile=null;
  $scope.aceLoaded = function(_editor,userDetails) {
    $scope.aceSession = _editor.getSession();
  };
  $scope.aceChanged = function () {
    var code = $scope.aceSession.getDocument().getValue();
  };
  $scope.getSelectedFile = function(file) {
  };
  $scope.saveExecute=function(){
    var code = $scope.aceSession.getDocument().getValue();
  };

  $scope.deleteFile = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.confirm()
     .title('would you really want to delete file?')
     .targetEvent(ev)
     .ok('Okay!')
     .cancel('Cancel');

   $mdDialog.show(confirm).then(function(result) {

   }, function(error) {
     console.log("something went wrong");
   });
 };

 $scope.testRequest=function () {
   var url=URL_PREFIX+'/admin'
   $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
        console.log(response);
      }, function errorCallback(error) {
          console.log(error);
    });

 };
 $scope.testRequest();
  $scope.saveFileName = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.prompt()
     .title('What would you name your File?')
    //  .textContent('Bowser is a common name.')
     .placeholder('File Name')
     .ariaLabel('File Name')
     .initialValue('untitled')
     .targetEvent(ev)
     .ok('Okay!')
     .cancel('Cancel');

   $mdDialog.show(confirm).then(function(result) {
     var code = $scope.aceSession.getDocument().getValue();
   }, function() {
     $scope.status = 'You didn\'t name your dog.';
   });
 };


});
