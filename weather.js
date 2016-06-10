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
  2193733,
  5037649,
  1819729,
  1796236,
  1850147,
  1816670,
  1275339,
  524901,
  993800,
  360630,
  2643741,
  184745,
  2332459,
  2988507,
  3173435,
  3067696,
  756135,
  2925533,
  3117735,
  2542997,
  745044,
  178202,
  2210247,
  112931,
  1138958,
  1566083,
  1735161,
  1642911,
  1701668,
  1835848,
  5872126,
  3413829,
  2650225,
  2964574,
  3143244,
  2673730,
  2267057
];

var app = angular.module('weatherApp', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: 'main.html'
    })
    .when('/:cityId', {
      controller: 'ForecastController',
      templateUrl: 'forecast.html'
    })
});

app.factory('weather', function($http) {
  var APPID = 'bfbabc609e268422c40bfea2b03323c6';
  return {
    getWeatherById: function(cityIds, callback) {
      $http({
        url: "http://api.openweathermap.org/data/2.5/group",
        params: {
          id: cityIds.join(','),
          units: 'imperial',
          APPID: APPID
        }
      }).success(function(data) {
        callback(data);
      });
    },
    getForecastForCity: function(cityId, callback) {
      $http({
        url: 'http://api.openweathermap.org/data/2.5/forecast',
        params: {
          id: cityId,
          units: 'imperial',
          APPID: APPID
        }
      }).success(callback);
    }
  };
});

app.factory('googleMap', function() {
  var mapElement = document.getElementById('map');
  var map = new google.maps.Map(mapElement, {
    center: { lat: 39.099727, lng: -94.578567 },
    zoom: 3
  });
  var infoWindow = new google.maps.InfoWindow();

  function openInfoWindow(result) {
    var content = "<ul style='list-style: none;'><li><h3>" + result.name + "</h3></li><li> Temperature: " + result.main.temp + "°</li><li>Humidity: " + result.main.humidity + "%</li><li>High: " + result.main.temp_max + "°</li><li>Low: " + result.main.temp_min + "°</li></ul>" +
    "<a href='#/'" + result.id + "'>Detailed Forecast</a";
    infoWindow.setContent(content);
    var marker = markerDictionary[result.id];
    infoWindow.open(map, marker);
  }

  return {
    openInfoWindow: openInfoWindow,
    plotData: function(results) {
      var markers = results.map(function(result) {
        var position = {lat: result.coord.lat, lng: result.coord.lon};
        var icon = {
          url: "http://openweathermap.org/img/w/" + result.weather[0].icon + ".png",
          size: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(25, 25),
        };
        var marker = new google.maps.Marker({
          anchorPoint: new google.maps.Point(0, -5),
          position: position,
          map: map,
          animation: google.maps.Animation.DROP,
          icon: icon
        });
        markerDictionary[result.id] = marker;
        marker.addListener('click', function() {
          openInfoWindow(result);
        });
        return marker;
      });
    }
  };
});


var markerDictionary = {};

app.controller('MainController', function($scope, weather, googleMap) {

  $scope.openInfoWindow = function(result) {
    googleMap.openInfoWindow(result);
  };

  weather.getWeatherById(cityIds, function callback(data) {
    $scope.weather = data.results;
    console.log(data);
    var results = data.list;
    $scope.results = results;
    googleMap.plotData(results);
  });
});

app.controller('ForecastController', function($scope, googleMap, $routeParams, weatherService) {
  var cityId = $routeParams.cityId;
  weatherService.getForecastForCity(cityId, function(data) {
    $scope.forecastList = data.list;
    console.log($scope.forecastList);
  });
});
