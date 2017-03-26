
var CONTENT_TYPE='application/json; charset=UTF-8';
var AUTHORIZATION='Bearer oW2NAC3ScKwLLS35bh8wokcdJxlEzP'
app.controller("TextEditorCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $window, $log, $document, nlp) {
  // http://192.168.0.107:8080/api/p/tickers
  // /api/p/eng POST name(statergy), stratergy, ticker, no. of share
  $scope.tickers=[];
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
