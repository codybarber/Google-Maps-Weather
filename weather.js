var infoWindows = [];

var cityIds = [
  4180439,
  5128638,
  4560349,
  4726206,
  4671654,
  5809844,
  5368361,
  5391811,
  5308655,
  4684888,
  4887398,
  5391959,
  5392171,
  4164138,
  4273837,
  5746545,
  4699066,
  5419384,
  4990729,
  5640350,
  5856195,
  5879400,
  4853828,
  5586437,
  5506956,
  5454711,
  4434283,
  4275586,
  5074472,
  5780993,
  4544349,
  6167865,
  6077243,
  6173331,
  3530597,
  3531673,
  4335045,
  3646738,
  3451190,
  3435910,
  3936456,
  2147714,
  2063523,
  2193733

];

var app = angular.module('weatherApp', ['ngRoute']);

app.factory('weather', function($http) {
  var APPID = 'eac2948bfca65b78a8c5564ecf91d00e';
  return {
    getWeatherById: function(cityIds, callback) {
      $http({
        url: "http://api.openweathermap.org/data/2.5/group",
        params: {
          id: cityIds.join(','),
          units: 'imperial',
          APPID: APPID
        }
      }).success(callback);
    }
  };
});

app.controller('MainController', function($scope, $http, weather) {
  weather.getWeatherById(cityIds, function callback(data) {
    $scope.weather = data.results;
    console.log(data);
    var result = data.list;
    $scope.results = result;

    var markers = result.map(function(result) {
      var position = {lat: result.coord.lat, lng: result.coord.lon};

      var image = {
        url: "http://openweathermap.org/img/w/" + result.weather[0].icon + ".png",
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25),
      };

      var marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image,
        anchorPoint: new google.maps.Point(0, -5)
      });
      marker.addListener('click', function() {
        hideAllInfoWindows();
        infoWindow.open(map, marker);
      });

      var contentString = "<ul style='list-style: none;'><li><h3>" + result.name + "</h3></li><li> Temperature: " + result.main.temp + "°</li><li>Humidity: " + result.main.humidity + "%</li><li>High: " + result.main.temp_max + "°</li><li>Low: " + result.main.temp_min + "°</li></ul>";

      var infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infoWindows.push(infoWindow);

      function hideAllInfoWindows() {
        infoWindows.forEach(function(infoWindow) {
          infoWindow.close();
        });
      }

      function openWindow (){
      }

      return marker;
    });
  });

  var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 4,
  center: {lat: 41, lng: -98}
  });

});
