
app.controller("TextEditorCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  // http://192.168.0.107:8080/api/p/tickers
  // /api/p/eng POST name(statergy), strategy, ticker, no. of share
  $scope.selectedItem=null;
  $scope.strategies=[];
  $scope.userFiles=[];
  $scope.selectedFile='untitled';
  var file=$rootScope.selectedFile;
  $scope.selectedItemChange = selectedItemChange;
  function selectedItemChange(item) {
    $scope.selectedItem=item;
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
         $rootScope.tickersArray=response.data;
         console.log(response);
       }, function errorCallback(error) {
     });
  };
  if ($rootScope.tickersArray==null){
    $scope.fetchTickers();
  }
  $scope.getTickers = function(searchText) {
    var deferred = $q.defer();
    $timeout(function() {
        var tickers = $rootScope.tickersArray.filter(function(ticker) {
            return (ticker.symbol.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
        });
        deferred.resolve(tickers);
    }, 0);
    return deferred.promise;
  };
  $scope.setSelectedFile= function(file){
    $scope.aceSession.setValue(file.strategy);
    $scope.strategies.shares=file.shares;
    $scope.selectedItem=file.ticker;
    $scope.strategyPk=file.pk;
    $scope.selectedFile=file.name;
    $rootScope.selectedFile=null;
  };
  $timeout(function() {
    $scope.setSelectedFile(file);
  }, 100);
  $scope.saveStrategy= function(ev,us){
    console.log(us);
    if ($scope.selectedFile == 'untitled') {
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
            $scope.selectedFile=result;
           }, function errorCallback(error) {
             $mdToast.show(
               $mdToast.simple()
               .textContent('Something went wrong, Please check all the input field')
               .position('bottom right')
               .hideDelay(3000)
             );
         });
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

  window.onbeforeunload = function() {
     return "Did you save your stuff?"
   }
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
