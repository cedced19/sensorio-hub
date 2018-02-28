module.exports = ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $http.get('/api/weather-data').success(function(data) {
        $scope.weatherData = data;
      })
      .error($rootScope.$error);
}];