app.controller("TextEditorCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  $scope.hideterm2=true;
  try {
    var selectedFile = JSON.parse($window.sessionStorage["selectedFile"]);
  } catch (e) {
    console.log("Error occured");
    $location.path('/file');
  } finally {
    $location.path('/file');
  }
  $scope.strategy=[];
  $scope.userFiles=[];
  $scope.frequencies=['Minute', 'Hourly','Daily','Weekly'];
  $scope.selectedFile='untitled';
  var file=selectedFile;
  $scope.setSelectedFile= function(file){
    // console.log(file);
    $scope.aceSession.setValue(file.strategy);
    $scope.strategy.shares=file.shares;
    $scope.strategy.loss=file.stop_loss;
    $scope.strategy.profit=file.profit_booking;
    $scope.selectedItem=file.ticker;
    $scope.strategyPk=file.pk;
    $scope.selectedFile=file.name;
    $scope.strategy.frequency=file.trade_frequency;
  };
  $timeout(function() {
    if (file!==undefined){
      $scope.setSelectedFile(file);
    }
  }, 100);
  $rootScope.selectedItemChange = selectedItemChange;
  function selectedItemChange(item) {
    $rootScope.selectedItem=item;
  }
  $scope.fetchTickers= function(){
    var url=URL_PREFIX+'api/p/tickers/';
    $http({
         method: "GET",
         headers: {
            'Content-Type': CONTENT_TYPE
          },
         url: url
       }).then(function successCallback(response) {
         $scope.tickersArray=response.data;
       }, function errorCallback(error) {
     });
  };
  if ($scope.tickersArray===null || $scope.tickersArray===undefined){
    $scope.fetchTickers();
  }
  $scope.getTickers = function(searchText) {
    var deferred = $q.defer();
    $timeout(function() {
        var tickers = $scope.tickersArray.filter(function(ticker) {
            return (ticker.symbol.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
        });
        deferred.resolve(tickers);
    }, 0);
    return deferred.promise;
  };

  $scope.addTerminal=function () {
    $scope.hideterm2=!$scope.hideterm2;
  };
  $scope.aceChanged=function () {
    $rootScope.editor1code = $scope.aceSession.getDocument().getValue();
  };
  $scope.backTest=function(){
    $location.path("/backtest");
    selectedFile=file;
  };

  $scope.saveUntitled=function (us) {
    $mdDialog.cancel();
    // TODO: check if file already exists

    var confirm = $mdDialog.prompt()
      .title('What would you name your File?')
     //  .textContent('Bowser is a common name.')
      .placeholder('File Name')
      .ariaLabel('File Name')
      .initialValue('untitled')
      .ok('Okay!')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function(result) {
      var url=URL_PREFIX+'api/p/eng/';
      $http({
           method: "POST",
           data:{
             name:result,
             strategy:$rootScope.editor1code,
             ticker:$rootScope.selectedItem.symbol,
             shares:us.shares,
             profit_booking:us.profit,
             stop_loss:us.loss,
             trade_frequency:us.frequency
           },
           headers: {
              'Content-Type': CONTENT_TYPE,
              'Authorization':'Bearer '+Auth.getUserInfo().accessToken
            },
           url: url
         }).then(function successCallback(response) {
           $mdToast.show(
             $mdToast.simple()
             .textContent('File sucessfully saved!')
             .position('bottom right')
             .hideDelay(3000)
           );
           window.location.reload();
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
  $scope.logInUser=function (user) {
    Auth.login(user).then(function(response) {
        $scope.userInfo = response;
        $rootScope.isUserLoggedIn=true;
        var AUTHORIZATION='Bearer '+response.accessToken;
        $mdToast.show(
          $mdToast.simple()
          .textContent('User sucessfully logged in!')
          .position('bottom right')
          .hideDelay(3000)
        );
        $scope.saveUntitled();
      });
  };
  $scope.saveStrategy= function(ev,us){
    // console.log(file);
    $rootScope.pendingStrategy=us;
    file.stop_loss=us.loss;
    file.ticker=$rootScope.selectedItem;
    file.profit_booking=us.profit;
    file.shares=us.shares;
    file.trade_frequency=us.frequency;
    $window.sessionStorage["selectedFile"]=JSON.stringify(file);
    if($rootScope.editor1code==null || $rootScope.selectedItem.symbol==null || $rootScope.pendingStrategy.shares==null || $rootScope.pendingStrategy.frequency==null){
      $mdToast.show(
        $mdToast.simple()
        .textContent('Please check all the input field')
        .position('bottom right')
        .hideDelay(3000)
      );
    }
    else{
      if($rootScope.isUserLoggedIn===null || $rootScope.isUserLoggedIn===undefined){
        var confirm = $mdDialog.confirm()
            .title('You are not Logged In')
            .textContent('Please login first to save your important file')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Please do it!')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
          $mdDialog.show({
            controller:'TextEditorCtrl',
            templateUrl: 'templates/login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          })
          .then(function(answer) {
              }, function() {
            });
          }, function() {

          });
      }
      else{
        if (selectedFile == 'untitled') {
          $scope.saveUntitled(us);
        }
        else{
          var url=URL_PREFIX+'api/p/eng/'+$scope.strategyPk+'/';
          $http({
               method: "PUT",
               data:{
                 strategy:$rootScope.editor1code,
                 ticker:$rootScope.selectedItem.symbol,
                 shares:us.shares,
                 profit_booking:us.profit,
                 stop_loss:us.loss,
                 trade_frequency:us.frequency
               },
               headers: {
                  'Content-Type': CONTENT_TYPE,
                  'Authorization':'Bearer '+Auth.getUserInfo().accessToken
                },
               url: url
             }).then(function successCallback(response) {
               $window.sessionStorage["selectedFile"]=JSON.stringify(file);
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
      }
    }
  };
  window.onbeforeunload = function() {
     return "Did you save your stuff?";
   };
  $scope.aceLoaded = function(_editor) {
    $scope.aceSession = _editor.getSession();
    $scope.aceSession.setUseWrapMode(true);
    $scope.aceSession.setWrapLimitRange(80, 80);
  };
  $scope.aceLoaded2 = function(_editor) {
    $scope.aceSession2 = _editor.getSession();
  };
});
