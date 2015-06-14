angular.module('LEDApp',[])
.controller('LEDController', ['$scope', 'LEDFactory', function($scope, LEDFactory) {
  $scope.controller = "Active";
  $scope.factory = LEDFactory().isActive();
}])
.factory('LEDFactory', [], function(){
  return {
    isActive: function () {
      return true
    }
  }
});