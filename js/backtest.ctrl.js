
app.controller("BacktestCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  if (Auth.getUserInfo().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getUserInfo().accessToken;
  }
  if ($rootScope.selectedFile===undefined || $rootScope.selectedFile===null){
    $location.path('/file');
  }
    $scope.orders=[
      {time: '2017-01-01 14:00', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:01', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:02', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:03', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:04', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:05', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:06', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:07', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:08', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:09', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:10', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:11', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:12', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:13', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:14', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:15', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:16', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:17', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:18', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:19', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:20', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:21', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:22', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:23', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:24', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:25', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:26', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:27', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:28', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:29', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:30', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:31', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:32', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:33', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:34', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:35', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:36', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:37', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:38', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:39', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:40', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:41', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:42', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:43', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:44', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:45', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:46', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:47', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:48', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:49', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:50', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:51', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:52', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:53', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:54', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:55', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:56', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:57', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:58', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5},
      {time: '2017-01-01 14:59', pnl: Math.floor(Math.random() * 50) + 50, order: Math.floor(Math.random() *10) + 5}
    ];
    $scope.pnldata=[];
    $scope.orderdata=[];
    for (i= 0;i<60; i++) {
      // if(ln-30<=i){
      //   $scope.pnldata.push({x:ln-i-1,y:data.data[i].price});
      // }
      $scope.pnldata.push({x:$scope.orders[i].time,y:$scope.orders[i].pnl});
      $scope.orderdata.push({x:$scope.orders[i].time,y:$scope.orders[i].order});
      // console.log($scope.pnldata);
      // console.log(data.data[i]);
    }
    $scope.series = ['Series A', 'Series B'];
    $scope.pnlGraphData=[];
    $scope.pnlGraphData.push($scope.pnldata);
    $scope.orderGraphData=[];

    $scope.orderGraphData.push($scope.orderdata);
    console.log($scope.pnlGraphData);
    console.log($scope.orderGraphData);
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.pnldatasetOverride = [
      {
        label: "Order",
        fill: false,
        lineTension: 0,
        backgroundColor: "#fff",
        borderColor: "rgba(255,88,20,0.4)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(255,88,20,0.4)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,88,20,0.4)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
      }
    ];
    $scope.pnloptions = {
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
                    display:false
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
      },
      pan: {
              // Boolean to enable panning
              enabled: true,
              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              mode: 'xy'
          },
          // Container for zoom options
          zoom: {
              // Boolean to enable zooming
              enabled: false,
              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: 'xy',
          }
    };
    $scope.orderdatasetOverride = [
      {
        label: "PnL",
        fill: false,
        lineTension: 0,
        backgroundColor: "#fff",
        borderColor: "rgba(255,88,20,0.4)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(255,88,20,0.4)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,88,20,0.4)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
      }
    ];
    $scope.orderoptions = {
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
                    display:false
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
});
