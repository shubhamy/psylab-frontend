
var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute','chart.js','ui.ace','nlpCompromise','ngMessages']);

var URL_PREFIX = 'http://localhost:8080/';
var CLIENT_ID='6IHW13vUvCYWrSQLTMaXPW1Sd1BICxgeWSOwQWmw';
var CLIENT_SECRET='r8QNKCvIahutSDKq6Jj8s0fnJ9tvnlgUyS6ESEgLLRLCAVNiQozkp7hCKQIlpdBg8YgsBtraQQnS0dahgeJeMcJb7zrQglKwQdLAgpNGbITofStCRd8C6CNVo6Qcou6X';
// using angular material without any default theme
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('teal', {
   'default': '400', // by default use shade 400 from the pink palette for primary intentions
   'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
   'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
   'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
  })
  .accentPalette('orange');
});
app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "templates/home.html"
  }).when("/data", {
    controller: "DataCtrl",
    templateUrl: "templates/data.html"
  }).when("/details", {
    controller: "detailCtrl",
    templateUrl: "templates/details.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).when("/trader", {
    controller: "TextEditorCtrl",
    templateUrl: "templates/trader.editor.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).when("/editor", {
    controller: "CodeEditorCtrl",
    templateUrl: "templates/editor.html"
  }).when("/file", {
    controller: "FileCtrl",
    templateUrl: "templates/file.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).when("/backtest", {
    controller: "BacktestCtrl",
    templateUrl: "templates/backtest.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).when("/papertrade", {
    controller: "PapertradeCtrl",
    templateUrl: "templates/papertrade.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        // console.log(userInfo);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/");
        }
    });
}]);
app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;
    function login(user) {
        var url=URL_PREFIX+'login/';
        var deferred = $q.defer();
        $http({
             method: "POST",
             transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
             },
             data: {
                'email':user.email,
                'password':user.password,
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'grant_type': 'client_credentials'
             },
             headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
             url: url
           }).then(function successCallback(response) {
            //  console.log(response);.
             userInfo = {
                 accessToken: response.data.access_token,
                 email: response.data.email
             };
             $window.localStorage["userInfo"] = JSON.stringify(userInfo);
             deferred.resolve(userInfo);
           }, function errorCallback(error) {
             deferred.reject(error);
         });
         return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL_PREFIX+"logout/",
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization':'Bearer '+userInfo.accessToken
            }
        }).then(function (result) {
            // console.log(result);
            userInfo = null;
            $window.localStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.localStorage["userInfo"]) {
            userInfo = JSON.parse($window.localStorage["userInfo"]);
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);
app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});
