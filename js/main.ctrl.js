app.controller('MainCtrl', function($scope, $location, $mdDialog, $mdToast, $rootScope, $routeParams, $http, $window, $log, $document, $mdSidenav, $mdToast, $timeout, nlp, Auth) {
  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };
  $scope.isUserLoggedIn=Auth.getUserInfo();
  $scope.playVisible=false;
  $scope.userInfo = null;
  $scope.signUpCard = function(ev) {
    $mdDialog.show({
      controller:'MainCtrl',
      templateUrl: 'templates/signup.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
      }, function() {
      });
  };
  $scope.createUser=function (user) {
    var url=URL_PREFIX+'api/register/'
    $http({
         method: "POST",
         data:{
           'email':user.email,
           'password':user.password
         },
         headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
         url: url
       }).then(function successCallback(response) {
         if (response.status=200){
           $mdDialog.cancel();
           $mdToast.show(
             $mdToast.simple()
             .textContent('User created sucessfully!')
             .position('bottom right')
             .hideDelay(3000)
           );
         };
       }, function errorCallback(error) {
         if (error.status=302){
           $mdDialog.cancel();
           $mdToast.show(
             $mdToast.simple()
             .textContent('User already exist!')
             .position('bottom right')
             .hideDelay(3000)
           );
         };
     });
  };
  $scope.logInCard = function(ev) {
    $mdDialog.show({
      controller:'MainCtrl',
      templateUrl: 'templates/login.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    }, function() {
    });
  };
  $scope.logInUser=function (user) {
    console.log(user);
    Auth.login(user).then(function(response) {
        $scope.userInfo = response;
        $location.path("/file");
        $mdDialog.cancel();
      });
  };
  $scope.logOut = function () {
      Auth.logout().then(function (result) {
          $scope.userInfo = null;
          $location.path("/");
          $mdToast.show(
            $mdToast.simple()
            .textContent('User logout sucessfully!')
            .position('bottom right')
            .hideDelay(3000)
          );
      }, function (error) {
          console.log(error);
      });
  };

$scope.playVideo=function () {
  $scope.playVisible=true;

};

  // 
  //
  // var svg = d3.select("svg").on("touchmove mousemove", moved),
  //     width = +svg.attr("width"),
  //     height = +svg.attr("height");
  //
  // var sites = d3.range(50)
  //     .map(function(d) { return [Math.random() * width, Math.random() * height]; });
  //
  // var voronoi = d3.voronoi()
  //     .extent([[-1, -1], [width + 1, height + 1]]);
  //
  // // var polygon = svg.append("g")
  // //     .attr("class", "polygons")
  // //   .selectAll("path")
  // //   .data(voronoi.polygons(sites))
  // //   .enter().append("path")
  // //     .call(redrawPolygon);
  //
  // var link = svg.append("g")
  //     .attr("class", "links")
  //   .selectAll("line")
  //   .data(voronoi.links(sites))
  //   .enter().append("line")
  //     .call(redrawLink);
  //
  // var site = svg.append("g")
  //     .attr("class", "sites")
  //   .selectAll("circle")
  //   .data(sites)
  //   .enter().append("circle")
  //     .attr("r", 3)
  //     .call(redrawSite);
  //
  // function moved() {
  //   sites[0] = d3.mouse(this);
  //   redraw();
  // }
  //
  // function redraw() {
  //   var diagram = voronoi(sites);
  //   // polygon = polygon.data(diagram.polygons()).call(redrawPolygon);
  //   link = link.data(diagram.links()), link.exit().remove();
  //   link = link.enter().append("line").merge(link).call(redrawLink);
  //   site = site.data(sites).call(redrawSite);
  // }
  //
  // // function redrawPolygon(polygon) {
  // //   polygon
  // //       .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
  // // }
  //
  // function redrawLink(link) {
  //   link
  //       .attr("x1", function(d) { return d.source[0]; })
  //       .attr("y1", function(d) { return d.source[1]; })
  //       .attr("x2", function(d) { return d.target[0]; })
  //       .attr("y2", function(d) { return d.target[1]; });
  // }
  //
  // function redrawSite(site) {
  //   site
  //       .attr("cx", function(d) { return d[0]; })
  //       .attr("cy", function(d) { return d[1]; });
  // }
  $scope.loadingComp=true;
  $timeout(function() {
  }, 500);

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

});
