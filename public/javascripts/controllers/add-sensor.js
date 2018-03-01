module.exports = ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {
      $scope.newSensor = {};
      
      $scope.addSensor = function() {
        $http.post('/api/sensors',  $scope.newSensor).success(function (data) {
                $location.path('/');
                $translate('sensor_added').then(function (translation) {
                  notie.alert(1, translation, 3);
                });
        }).error($rootScope.$error);
      };
}];