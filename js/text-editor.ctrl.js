
app.controller("TextEditorCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  // http://192.168.0.107:8080/api/p/tickers
  // /api/p/eng POST name(statergy), strategy, ticker, no. of share
  $scope.tickers=[];
  $scope.selectedItem=null;
  $scope.strategies=[];
  $scope.userFiles=[];
  $scope.filename='untitled';
  $scope.selectedItemChange = selectedItemChange;
  function selectedItemChange(item) {
    $scope.selectedItem=item;
  };
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
         $scope.userFiles=response.data;
       }, function errorCallback(error) {
         console.log(error);
     });
  };
  $scope.fetchTickers= function(){
    var url=URL_PREFIX+'api/p/tickers/';
    $http({
         method: "GET",
         headers: {
            'Content-Type': CONTENT_TYPE,
            'Authorization':AUTHORIZATION
          },
         url: url
       }).then(function successCallback(response) {
         $scope.tickers=response.data;
         console.log(response);
       }, function errorCallback(error) {
     });
  };
  getUserFiles();
  $scope.fetchTickers();
  $scope.getTickers = function(searchText) {
    var deferred = $q.defer();
    $timeout(function() {
        var tickers = $scope.tickers.filter(function(ticker) {
            return (ticker.symbol.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
        });
        deferred.resolve(tickers);
    }, 0);
    return deferred.promise;
  };
  $scope.setSelectedFile= function(file){
    if ($scope.selectedFile !== undefined) {
      for (i=0;i<$scope.userFiles.length; i++) {
        if ($scope.selectedFile==$scope.userFiles[i].name){
          $scope.aceSession.setValue($scope.userFiles[i].strategy);
          $scope.strategies.shares=$scope.userFiles[i].shares;
          $scope.selectedItem=$scope.userFiles[i].ticker;
          $scope.strategyPk=$scope.userFiles[i].pk;
        }
      };
      return $scope.selectedFile;
    } else {
      return "Please select an item";
    }
  };
  $scope.editFile=function (file) {
    console.log(file);
    $scope.selectedFile=file.name;
    $scope.aceSession.setValue(file.strategy);
    $scope.strategies.shares=file.shares;
    $scope.selectedItem=file.ticker;
    $scope.strategyPk=file.pk;
  };
  $scope.fetchIndicator= function(){
    var url=URL_PREFIX+'api/p/indicators/';
    $http({
         method: "GET",
         headers: {
            'Content-Type': CONTENT_TYPE,
            'Authorization':AUTHORIZATION
          },
         url: url
       }).then(function successCallback(response) {
        //  $scope.tickers=response.data;
         console.log(response);
       }, function errorCallback(error) {
     });
  };
  $scope.fetchUserFile
  // $scope.saveFileName = function(ev) {
  //    // Appending dialog to document.body to cover sidenav in docs app
  //
  //  };
  $scope.saveStrategy= function(ev,us){
    console.log(us);
    if ($scope.selectedFile == undefined) {
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
        var url=URL_PREFIX+'api/p/eng/';
        console.log($scope.selectedItem);
        $http({
             method: "POST",
             data:{
               name:result,
               strategy:code,
               ticker:$scope.selectedItem.symbol,
               shares:us.shares
             },
             headers: {
                'Content-Type': CONTENT_TYPE,
                'Authorization':AUTHORIZATION
              },
             url: url
           }).then(function successCallback(response) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('File sucessfully saved!')
               .position('bottom right')
               .hideDelay(3000)
             );
           }, function errorCallback(error) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('Something went wrong, Please check all the input field')
               .position('bottom right')
               .hideDelay(3000)
             );
         });
        $scope.selectedFile=result;
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    }
    else{
      var code = $scope.aceSession.getDocument().getValue();
      var url=URL_PREFIX+'api/p/eng/'+$scope.strategyPk+'/';
      console.log($scope.selectedItem);
      $http({
           method: "PUT",
           data:{
             strategy:code,
             ticker:$scope.selectedItem.symbol,
             shares:us.shares
           },
           headers: {
              'Content-Type': CONTENT_TYPE,
              'Authorization':AUTHORIZATION
            },
           url: url
         }).then(function successCallback(response) {
           $mdToast.show(
             $mdToast.simple()
             .textContent('File sucessfully saved!')
             .position('bottom right')
             .hideDelay(3000)
           );
         }, function errorCallback(error) {
           $mdToast.show(
             $mdToast.simple()
             .textContent('Something went wrong, Please check all the input field')
             .position('bottom right')
             .hideDelay(3000)
           );
       });
    }
  };
  // $scope.fetchIndicator();


  $scope.aceLoaded = function(_editor) {
    $scope.aceSession = _editor.getSession();
  };
  $scope.createObj=function(text){
    console.log(text);
    text=nlp(text).replace('is greater than','>').all().out();
    text=nlp(text).replace('is less than','<').all().out();
    text=nlp(text).replace('is lower than','<').all().out();
    text=nlp(text).replace('is equal to','=').all().out();
    text=nlp(text).replace('is greater than equal to','=>').all().out();
    text=nlp(text).replace('is less than equal to','<=').all().out();
    text=nlp(text).replace('is lower than equal to','<=').all().out();
    text=nlp(text).replace('open interest','openInterest').all().out();
    $scope.codeObj.side=nlp(text).terms().slice(0,1).out();
    $scope.codeObj.condstate=[];
    $scope.codeObj.condstate[0]=nlp(text).terms().slice(3,6).out();
    // $scope.texttoCode.push({security:'icici'});
    $scope.texttoCode.security='icici';
    return nlp(text).terms().slice(6).out()
  };
  $scope.updateObj=function(text){
    console.log(text);

  }
  $scope.aceChanged = function () {

  };
  $scope.textExecute=function() {
    var text = $scope.aceSession.getDocument().getValue();
    $scope.texttoCode=[];
    var textLength=(nlp(text).match('and').length)+(nlp(text).match('or').length);
    text=$scope.createObj(text);
    $scope.codeObj.condition=[];
    console.log(text);
    if (textLength=>2) {
      var count=1;
      for (var i=1; i<=textLength;i++){
        if(0<nlp(text).match('and sell').length||0<nlp(text).match('and buy').length){
          $scope.texttoCode.push({side:nlp(text).terms().slice(1,2).out(),cond_state:[nlp(text).terms().slice(3,6).out()]});
          text=nlp(text).terms().slice(6).out();
          console.log(text);
        }
        else{
          $scope.codeObj.condition[count-1]=nlp(text).terms().slice(0,1).out();
          $scope.codeObj.condstate[count]=nlp(text).terms().slice(1,4).out();
          text=nlp(text).terms().slice(4).out();
          count=count+1;
        }
      }
      $scope.texttoCode.push($scope.codeObj);
    }
    console.log($scope.texttoCode);
  };
});
