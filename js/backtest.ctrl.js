
app.controller("BacktestCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  if (Auth.getUserInfo().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  }
  $scope.selectedFile = JSON.parse($window.sessionStorage["selectedFile"]);
  // console.log($scope.selectedFile);
  if ($scope.selectedFile===undefined || $scope.selectedFile===null){
    $location.path('/file');
  }
  function dateBetween(from, to) {
    var day;
    var between = [moment(from).format('YYYY-MM-DD')];
    while(from < to) {
        day = from.getDate()
        from = new Date(from.setDate(++day));
        between.push(moment(from).format('YYYY-MM-DD'));
    }
    return between;
  }

  $scope.frequencies=['Minute', 'Hourly','Daily','Weekly'];
  $scope.performance=[];
  $scope.performance.anual_volume=0;
  $scope.performance.anualized_downside_standard=0;
  $scope.performance.anualized_return=0;
  $scope.performance.anualized_standard=0;
  $scope.performance.sharpe_ratio=0;
  $scope.performance.sortino_ratio=0;
  $scope.performance.max_drawdown=0;
  $scope.backtestRun=function(file) {
    $window.sessionStorage["selectedFile"]=JSON.stringify(file);
    var url=URL_PREFIX+'api/p/backtest/';
    $http({
         method: "POST",
         data:{
           strategy_id:file.pk,
           ticker:file.ticker.symbol,
           quantity:file.shares,
           frequency:file.trade_frequency,
           start_time: moment(file.from).format('YYYY-MM-DD'),
           end_time: moment(file.to).format('YYYY-MM-DD')
         },
         headers: {
            'Content-Type': CONTENT_TYPE,
            'Authorization':'Bearer '+Auth.getUserInfo().accessToken
          },
         url: url
       }).then(function successCallback(response) {
         response=response.data;
        $scope.performance.anual_volume=response.anual_volume;
        $scope.performance.anualized_downside_standard=response.anualized_downside_standard;
        $scope.performance.anualized_return=response.anualized_return;
        $scope.performance.anualized_standard=response.anualized_return;
        $scope.performance.sharpe_ratio=response.sharpe_ratio;
        $scope.performance.sortino_ratio=response.sortino_ratio;
        $scope.performance.max_drawdown=response.max_drawdown;
        $scope.performance.pnl=response.realized_profit[response.realized_profit.length-1];
        $scope.performance.realized_profit=response.realized_profit;
        $scope.performance.unrealized_profit=response.unrealized_profit;
        $scope.performance.order_history=response.order_history;
        $scope.performance.dateArr=dateBetween(file.from, file.to);
        console.log($scope.performance);
        $scope.plotChart($scope.performance);
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
    $scope.plotChart=function (performance) {
      $scope.pnldata=[];
      $scope.pnllabels=[];
      $scope.orderdata=[];
      $scope.orderlabels=[];
      for (i= 0;i<performance.dateArr.length; i++) {
        $scope.pnldata.push(performance.unrealized_profit[i]+performance.realized_profit[i]);
        $scope.pnllabels.push(performance.dateArr[i]);
        console.log($scope.pnl);
        $scope.orderlabels.push(performance.dateArr[i]);
        $scope.orderdata.push(performance.order_history[i]);
      }
      $scope.series = ['Series A', 'Series B'];
      $scope.pnlGraphData=[];
      $scope.pnlGraphData.push($scope.pnldata);
      $scope.orderGraphData=[];
      $scope.orderGraphData.push($scope.orderdata);
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.pnldatasetOverride = [
        {
          label: "Order"
        }
      ];
      $scope.orderoptions = {
        tooltips: {
          // X Value of the tooltip as a string
             xLabel: 'time',
             time: {
                 displayFormats: {
                     quarter: 'MMM YYYY'
                 }
             },

             // Y value of the tooltip as a string
             yLabel: 'time'

              },
        scales: {
          yAxes: [
            {
              gridLines: {
                      display:true
                  }
            }
          ],
          xAxes: [{
                    gridLines: {
                      display:false
                  }
               }]
        }
      };
      $scope.orderdatasetOverride = [
        {
          label: "PnL",
          backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)'
           ],
           borderColor: [
               'rgba(255,99,132,1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)'
           ]
        }
      ];
      $scope.pnloptions = {
        legend: { display: true },
        tooltips: {
          // X Value of the tooltip as a string
             xLabel: 'time',
             time: {
                 displayFormats: {
                     quarter: 'MMM YYYY'
                 }
             },

             // Y value of the tooltip as a string
             yLabel: 'time'

              },
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
              gridLines: {
                      display:true
                  }
            }
          ],
          xAxes: [{
                   type: 'time',
                   display: true,
                   position: 'bottom',
                    time: {
                        displayFormats: {
                            quarter: 'MMM YYYY'
                        }
                    },
                    gridLines: {
                      display:false
                  }
               }]
        }
      };
    }
    // performance.realized_profit=response.realized_profit;
    // $scope.performance.unrealized_profit=response.unrealized_profit;
    // $scope.performance.order_history=response.order_history;

});
