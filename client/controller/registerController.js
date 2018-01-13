var app = angular.module("userApp");
app.controller("registerController", function($scope, $location, $rootScope, $resource, $http, ActiveUser) {
  $scope.userid="";
  $scope.password="";
  $scope.email="";

	$scope.openlogin = function() {
	$location.path('/login').replace();
}
  $scope.validate = function() {
    $http({
      url: '/register',
      method: 'post',
      data: {"userid": $scope.userid, "email": $scope.email,"password": $scope.password}
    }).then(function(data){
    if(data.data.success==true){
        $location.path('/login').replace();
    }
    else
      alert(data.data.reason);
  }, function(err){})
  }
});
