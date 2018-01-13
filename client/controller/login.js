var app = angular.module("userApp");
app.controller("loginController", function($scope, $location, $rootScope, $resource, $http, ActiveUser) {
  $scope.page = "Login";
  $scope.userid="";
  $scope.password="";
  $scope.openregister = function () {
    $location.path('/register').replace();
  };
  $scope.validate = function() {
    $http({
      url: '/login',
      method: 'post',
      data: {"userid": $scope.userid, "password": $scope.password}

    }).then(function(data){
    if(data.data.success==true){
        ActiveUser.setuser($scope.userid);
        $location.path('/LandingPage').replace();
    }
    else
    $scope.errmessage += data.data.reason;
  }, function(err){})
  }
});
