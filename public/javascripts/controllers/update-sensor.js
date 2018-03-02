
module.exports = ['$scope', '$http', '$rootScope', '$location', '$translate', 'notie', '$routeParams', function ($scope, $http, $rootScope, $location, $translate, notie, $routeParams) {
    $scope.sensor = {};

    $http.get('/api/sensors/' + $routeParams.ip).success(function (data) {
        $scope.sensor = data;
    }).error($rootScope.$error);

    $scope.defineSensor = function () {
        $http.put('/api/sensors/' + $routeParams.ip, $scope.sensor).success(function (data) {
            $location.path('/');
            $rootScope.sensors.forEach(function(el, k) {
                if (el.id == data.id) {
                    $rootScope.sensors[k] = data;
                }
            });
            $translate('sensor_updated').then(function (translation) {
                notie.alert(1, translation, 3);
            });
        }).error($rootScope.$error);
    };
}];