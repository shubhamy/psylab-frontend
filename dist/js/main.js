var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute','chart.js','firebase','ui.ace']);
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

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

// for ngRoute
app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
}]);
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    // the rest is the same for ui-router and ngRoute...
    controller: "myCtrl",
    templateUrl: "templates/home.html",
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).when("/details", {
    // the rest is the same for ui-router and ngRoute...
    controller: "detailCtrl",
    templateUrl: "templates/details.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  }).when("/editor", {
    // the rest is the same for ui-router and ngRoute...
    controller: "EditorCtrl",
    templateUrl: "templates/editor.html",
    resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return Auth.$requireSignIn();
      }]
    }
  });
}]);


app.controller('myCtrl', function($scope,$location,$mdDialog,$mdToast,$rootScope, $routeParams,$http,$window,$log,$document,Auth,$firebaseAuth, $mdSidenav,$timeout) {
  $scope.loadingComp=false;
  if(Auth.$getAuth()){
    $location.path("/editor");
    $timeout(function(){$scope.loadingComp=true}, 2500);
  }
  else if(Auth.$getAuth()==null){
    $scope.loadingComp=true;
    $location.path("/");
  }
  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };
  $scope.createUser = function(user) {
    console.log(user);
    $scope.message = null;
    $scope.error = null;
    // Create a new user
    Auth.$createUserWithEmailAndPassword(user.email, user.password)
      .then(function(firebaseUser) {
        $scope.message = "User created with uid: " + firebaseUser.uid;
        firebase.database().ref('users/'+firebaseUser.uid+'/details/').set({
            username: user.name
          });
          $mdDialog.cancel();
        $location.path("/editor");
      }).catch(function(error) {
        $scope.error = error;
      });
  };

  $scope.signUpCard = function(ev) {
    $mdDialog.show({
      controller:'myCtrl',
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

  $scope.signIn = function(user){
    Auth.$signInWithEmailAndPassword(user.email,user.password).then(function(firebaseUser){
      console.log(firebaseUser.uid);
      $mdDialog.cancel();
      $location.path("/editor");
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  };
  $scope.signInWithGoogle=function () {
    Auth.$signInWithPopup("google").then(function(result) {
      console.log("Signed in as:", result.user.uid);
      firebase.database().ref('users/'+result.user.uid+'/details/').set({
          username: result.user.displayName,
          photoURL:result.user.photoURL
      });
      $mdDialog.cancel();
      console.log(result);
      $location.path("/editor");
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  };
  $scope.signInWithGithub=function () {
    Auth.$signInWithPopup("github").then(function(result) {
      console.log("Signed in as:", result.user.uid);
      console.log(result);
      $mdDialog.cancel();
      $location.path("/editor");
    }).catch(function(error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Google credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        Auth.$signInWithRedirect("google").then(function(result) {
          console.log("Signed in as:", result.user.uid);
          console.log(result);
          Auth.result.user.uid.link(pendingCred)
              .then(function(user) {
                console.log("Account linking success", user);
                $mdDialog.cancel();
                $location.path("/editor");
              }, function(error) {
                console.log("Account linking error", error);
            });
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
      }
    });
  };
  $scope.logInCard = function(ev) {
    $mdDialog.show({
      controller:'myCtrl',
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
  $scope.passwordReset = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.prompt()
     .title('Please Enter your email?')
    //  .textContent('Bowser is a common name.')
     .placeholder('example@example.com')
     .ariaLabel('example@example.com')
     .initialValue('example@example.com')
     .targetEvent(ev)
     .ok('Reset')
     .cancel('Cancel');
   $mdDialog.show(confirm).then(function(result) {
     Auth.$sendPasswordResetEmail(result).then(function() {
      console.log("Password reset email sent successfully!");
    }).catch(function(error) {
      console.error("Error: ", error);
    });
   }, function() {
     console.log("cancel");
   });
 };

});









// editor controller starts from here
app.controller("EditorCtrl", ['currentAuth','$scope','$rootScope','$timeout', '$routeParams', '$location','$http','$sce','$mdDialog','$window','$http', '$log','$document','Auth','$firebaseArray','$firebaseObject',
function(currentAuth,$scope,$rootScope, $timeout,$routeParams, $location,$http,$sce,$mdDialog,$window,$http, $log,$document,Auth,$firebaseArray,$firebaseObject) {
  $scope.selectedFile=null;
  $timeout(function(){$scope.loadingComp=true}, 2500);
  $scope.isPath= function(viewLocation) {
    return viewLocation === $location.path();
  };
  $scope.logOut=function () {
    Auth.$signOut();
    Auth.$onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser==null){
          $location.path("/");
      }
    });
  };
  var userDetails = firebase.database().ref('/users/'+currentAuth.uid+'/details');
  $scope.userDetails = new $firebaseObject(userDetails);
  $scope.userDetails.$loaded().then(function(userDetails){
    // console.log($scope.userDetails);
  });
  $scope.aceLoaded = function(_editor,userDetails) {
    $scope.aceSession = _editor.getSession();
    if ($scope.selectedFile==null){
      var userCode = firebase.database().ref('/users/'+currentAuth.uid+'/codefile/untitled');
      $scope.userCode = new $firebaseObject(userCode);
      $scope.userCode.$loaded().then(function(userCode){
        $scope.aceSession.setValue($scope.userCode.code, -1);
      });
    }
    else{
      var userCode = firebase.database().ref('/users/'+currentAuth.uid+'/codefile/'+$scope.selectedFile);
      $scope.userCode = new $firebaseObject(userCode);
      $scope.userCode.$loaded().then(function(userCode){
        $scope.aceSession.setValue($scope.userCode.code, -1);
      });
    }
  };
  $scope.aceChanged = function () {
    var code = $scope.aceSession.getDocument().getValue();
    console.log(code);
    var sudocode=$scope.aceSession.Search.find('"',{regExp:false})
    console.log(sudocode);
    var filename=  $scope.selectedFile;
    if (filename==null){
      firebase.database().ref('users/'+currentAuth.uid+'/codefile/untitled').set({
        code:code,
        filename:'untitled'
      });
    }
    else{
      firebase.database().ref('/users/'+currentAuth.uid+'/codefile/'+filename).update({
        code:code,
        timestamp:Date.now()
      });
    }
  };
  var userFiles = firebase.database().ref('/users/'+currentAuth.uid+'/codefile');
  $scope.userFiles = new $firebaseObject(userFiles);
  $scope.userFiles.$loaded().then(function(userFiles){
    // console.log($scope.userFiles);
  });
  $scope.getSelectedFile = function(file) {
    if ($scope.selectedFile !== null) {
      var codeFile = firebase.database().ref('/users/'+currentAuth.uid+'/codefile/'+$scope.selectedFile);
      $scope.codeFile = new $firebaseObject(codeFile);

      $scope.codeFile.$loaded().then(function(codeFile){
        // console.log($scope.codeFile);
        $scope.aceSession.setValue($scope.codeFile.code);
        // console.log($scope.codeFile.code);
      });
      return $scope.selectedFile;
    } else {
      return "untitled";
    }
  };
  $scope.saveExecute=function(){
    var code = $scope.aceSession.getDocument().getValue();
    firebase.database().ref('/users/'+currentAuth.uid+'/executeCode/').set({
      code:code
    });
  };

  $scope.deleteFile = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.confirm()
     .title('would you really want to delete file?')
     .targetEvent(ev)
     .ok('Okay!')
     .cancel('Cancel');

   $mdDialog.show(confirm).then(function(result) {
     console.log("delete calling");
       if ($scope.selectedFile !== null) {
         var file=$scope.selectedFile;
         console.log("something calling"+file);
         $scope.selectedFile=null;
         firebase.database().ref('/users/'+currentAuth.uid+'/codefile/'+file).remove().then(function(success) {
           console.log("file deleted successfully");
           $scope.selectedFile=null;
           // TODO: repeated process create a function with lest use of firebase bandwidth
           var userCode = firebase.database().ref('/users/'+currentAuth.uid+'/codefile/untitled');
           $scope.userCode = new $firebaseObject(userCode);
           $scope.userCode.$loaded().then(function(userCode){
             $scope.aceSession.setValue($scope.userCode.code, -1);
           });
         }, function(error) {
           console.log("Error:", error);
         });
       }
   }, function(error) {
     console.log("something went wrong");
   });
 };
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
     firebase.database().ref('/users/'+currentAuth.uid+'/codefile/'+result).set({
       code:code,
       filename:result,
       created:Date.now(),
       timestamp:Date.now()
     });
     $scope.selectedFile=result;
   }, function() {
     $scope.status = 'You didn\'t name your dog.';
   });
 };


}]);
































// $scope.getOrders=function(){
//   $scope.orders=[];
//   $scope.graphdata=[];
//   $http.post('php/orderQueries.php').then(function(data) {
//       var ln=data.data.length;
//       for (i= 0;i<ln; i++) {
//         $scope.orders.push(data.data[i]);
//         // if(ln-30<=i){
//         //   $scope.graphdata.push({x:ln-i-1,y:data.data[i].price});
//         // }
//         $scope.graphdata.push({x:i+1,y:data.data[i].price});
//         // console.log($scope.graphdata);
//         // console.log(data.data[i]);
//       };
//     // console.log(data.data);
//   }, function() {
//
//   });
// };
// $scope.getOrders();
//   $scope.series = ['Series A', 'Series B'];
//   $scope.data=[]
//   $scope.data.push($scope.graphdata);
//   console.log($scope.data);
//   $scope.onClick = function (points, evt) {
//     console.log(points, evt);
//   };
//   $scope.options = {
//     scales: {
//       yAxes: [
//         {
//           id: 'y-axis-1',
//           type: 'linear',
//           display: true,
//           position: 'left'
//         }
//       ],
//       xAxes: [{
//                type: 'linear',
//                position: 'bottom'
//            }]
//     },
//     pan: {
//             // Boolean to enable panning
//             enabled: true,
//
//             // Panning directions. Remove the appropriate direction to disable
//             // Eg. 'y' would only allow panning in the y direction
//             mode: 'xy'
//         },
//
//         // Container for zoom options
//         zoom: {
//             // Boolean to enable zooming
//             enabled: true,
//
//             // Zooming directions. Remove the appropriate direction to disable
//             // Eg. 'y' would only allow zooming in the y direction
//             mode: 'xy',
//         }
//   };
// });
