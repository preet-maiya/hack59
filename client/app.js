var app = angular.module("userApp", ['ngResource', 'ngRoute']);


app.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'loginController'
  })
  .when('/LandingPage', {
    templateUrl: '/views/LandingPage.html',
    controller: 'userdashboardController'
  })
  .when('/register', {
    templateUrl: '/views/register.html',
    controller: 'registerController'
  })
  .otherwise({
    redirectTo: '/login'
  })
});

app.factory('ActiveUser', function() {
  var who = {
    user: null
  }
  return {
    getuser: function() {
      return who.user;
    },
    setuser: function(val) {
      who.user = val
    }
  }
})


app.controller("mainController", function($scope, $location) {
  $scope.page = "home";
});
