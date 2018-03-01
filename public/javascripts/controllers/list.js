module.exports = ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    $http.get('/api/weather-data').success(function (data) {
        data.forEach(function (el) {
            for (var k in $rootScope.sensors) {
                if ($rootScope.sensors[k].ip == el.ip) {
                    el.name = $rootScope.sensors[k].name;
                }
            }           
        });
        $scope.weatherData = data;
    }).error($rootScope.$error);
}];