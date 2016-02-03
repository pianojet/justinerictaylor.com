angular.module('BB8App',[])
.controller('BB8Controller', ['$scope', function($scope) {
  $scope.bb8sounds = [
    {
      "label": "Sound #1",
      "src": "audio/bb8_trial01.wav",
      "origin": "Enhanced R2-D2",
      "notes": "Many of BB-8's sounds appear to seem like some of R2-D2's sounds with added/enhanced effects.  These demos are far from perfect, yet."
    },
    {
      "label": "Sound #2",
      "src": "audio/bb8_trial02.wav",
      "origin": "Enhanced R2-D2",
      "notes": "Many of BB-8's sounds appear to seem like some of R2-D2's sounds with added/enhanced effects.  These demos are far from perfect, yet."
    },
    {
      "label": "Sound #3",
      "src": "audio/bb8_trial03.wav",
      "origin": "Anaheim Expo Footage",
      "notes": "Pulled from video, crowd-noise removal is a difficult type of noise to remove."
    },
    {
      "label": "Sound #4",
      "src": "audio/bb8_trial04.wav",
      "origin": "Anaheim Expo Footage",
      "notes": "Pulled from video, crowd-noise removal is a difficult type of noise to remove."
    },
    {
      "label": "Sound #5",
      "src": "audio/bb8_trial05.wav",
      "origin": "Anaheim Expo Footage",
      "notes": "Pulled from video, crowd-noise removal is a difficult type of noise to remove."
    }
  ];
  $scope.play = function(index) {
    console.log("#### playing sound " + $scope.bb8sounds[index].label);
  }
}]);