module.exports = ['$scope', '$http', '$rootScope', '$location', '$translate', 'notie', function ($scope, $http, $rootScope, $location, $translate, notie) {
  $scope.newSensor = {};

  $scope.addSensor = function () {
    $http.post('/api/sensors', $scope.newSensor).success(function (data) {
      $location.path('/');
      $translate('sensor_added').then(function (translation) {
        notie.alert(1, translation, 3);
      });
    }).error($rootScope.$error);
  };
}];