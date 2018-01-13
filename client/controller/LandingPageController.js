var app = angular.module("userApp");
app.controller("userdashboardController", function($scope, $route, $location, $http, $resource, ActiveUser) {

  $scope.places= []
  $scope.details= []
  $scope.rating=null;
  $scope.srating=null;
  $scope.comment = {
    newcomment: null
  }
  $scope.complaint = {
    newcomplaint: null
  }
  $scope.coordinates = {
    latitude:null,
    longitude:null
  };
  var nearby = $resource('/api/nearby');
  var myplace= $resource('/api/myplace');
  //$scope.user = ActiveUser.getuser();

  var latlong = function() {
    var geocoder = new google.maps.Geocoder();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function successFunction(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.coordinates.latitude=lat.toFixed(4);
        $scope.coordinates.longitude=lng.toFixed(4);

        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results)
            if (results[1]) {
              var	txt = document.createTextNode(results[0].formatted_address);
              $scope.address = txt.textContent;
              nearby.query({latitude:$scope.coordinates.latitude,longitude:$scope.coordinates.longitude,address:txt.textContent},function(result){
                $scope.places = result;
              });
              myplace.query({latitude:$scope.coordinates.latitude,longitude:$scope.coordinates.longitude,address:txt.textContent},function(result){
                $scope.details = result;
              });

            } else {
              alert("No results found");
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });
      },function errorFunction(){
        alert("Geocoder failed");
      });
    }
  }
  var codeLatLng = function(lat, lng) {}
  latlong();


  $scope.addComment = function () {
    var thisdata = {
      latitude: $scope.coordinates.latitude,
      longitude: $scope.coordinates.longitude,
      address: $scope.address,
      comment: $scope.comment.newcomment,
      userid: ActiveUser.getuser()
    }
    $http({
      url: '/api/addcomment',
      method: 'post',
      data: thisdata
    }).then(function(data){
      $route.reload();
    }, function(err){});
  }

  $scope.addrate = function(val) {
    var thisdata = {
      latitude: $scope.coordinates.latitude,
      longitude: $scope.coordinates.longitude,
      address: $scope.address,
      rate: val,
      userid: ActiveUser.getuser()
    }
    $http({
      url: '/api/genrate',
      method: 'post',
      data: thisdata
    }).then(function(data) {
      $route.reload();
    }, function(err){});
  }


$scope.addsafe = function(val) {
  var thisdata = {
    latitude: $scope.coordinates.latitude,
    longitude: $scope.coordinates.longitude,
    address: $scope.address,
    safety: val,
    userid: ActiveUser.getuser()
  }
  $http({
    url: '/api/saferate',
    method: 'post',
    data: thisdata
  }).then(function(data) {
    $route.reload();
  }, function(err){});
}

$scope.addComplaint = function() {
  var thisdata = {
    latitude: $scope.coordinates.latitude,
    longitude: $scope.coordinates.longitude,
    address: $scope.address,
    complaint: $scope.complaint.newcomplaint,
    userid: ActiveUser.getuser()
  }
  $http({
    url: '/api/addcomplaint',
    method: 'post',
    data: thisdata
  }).then(function(data) {
    $route.reload();
  }, function(err){});
}

});
