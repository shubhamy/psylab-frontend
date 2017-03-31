
app.controller("DataCtrl", function($scope, $rootScope, $q, $timeout, $routeParams, $location, $http, $sce, $mdDialog, $mdToast, $window, $log, $document, nlp, Auth) {

    $scope.orders=[
      {time: Date.parse('2017-01-01 14:00'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:01'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:02'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:03'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:04'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:05'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:06'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:07'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:08'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:09'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:10'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:11'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:12'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:13'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:14'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:15'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:16'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:17'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:18'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:19'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:20'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:21'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:22'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:23'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:24'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:25'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:26'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:27'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:28'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:29'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:30'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:31'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:32'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:33'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:34'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:35'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:36'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:37'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:38'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:39'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:40'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:41'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:42'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:43'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:44'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:45'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:46'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:47'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:48'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:49'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:50'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:51'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:52'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:53'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:54'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:55'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:56'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:57'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:58'), pnl: Math.floor(Math.random() * 50) + 50},
      {time: Date.parse('2017-01-01 14:59'), pnl: Math.floor(Math.random() * 50) + 50}
    ];
    $scope.graphdata=[];
    for (i= 0;i<60; i++) {
      // if(ln-30<=i){
      //   $scope.graphdata.push({x:ln-i-1,y:data.data[i].price});
      // }
      $scope.graphdata.push({x:$scope.orders[i].time,y:$scope.orders[i].pnl});
      // console.log($scope.graphdata);
      // console.log(data.data[i]);
    };
    $scope.series = ['Series A', 'Series B'];
    $scope.data=[]
    $scope.data.push($scope.graphdata);
    console.log($scope.data);
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ],
        xAxes: [{
                 type: 'time',
                 position: 'bottom',
                  time: {
                      displayFormats: {
                          quarter: 'MMM YYYY'
                      }
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
              enabled: true,
              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              mode: 'xy',
          }
    };
});
