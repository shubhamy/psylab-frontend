
var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute','chart.js','ui.ace','nlpCompromise']);

var URL_PREFIX = 'http://localhost:8000/';
var CLIENT_ID='6IHW13vUvCYWrSQLTMaXPW1Sd1BICxgeWSOwQWmw';
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
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.when("/", {
    controller: "myCtrl",
    templateUrl: "templates/home.html"
  }).when("/details", {
    controller: "detailCtrl",
    templateUrl: "templates/details.html"
  }).when("/trader", {
    controller: "TextEditorCtrl",
    templateUrl: "templates/trader.editor.html"
  }).when("/editor", {
    controller: "CodeEditorCtrl",
    templateUrl: "templates/editor.html"
  });
}]);
