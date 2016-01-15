var app = require('../app.js');

app.controller('FITController', ['$scope', function($scope) {

  console.log("\n\n######## js/controllers/FITController");
  refreshBindings = function() {
    $scope.monthName = c.getMonthName();
    $scope.year = c.currentYear;    
  }

  $scope.debugz = function() {
    console.log("someDebug");
    var t = $scope.statType;
    alert(t);
  }

  $scope.drawPreviousMonth = function() {
    c.drawPreviousMonth();
    refreshBindings();
  }

  $scope.drawNextMonth = function() {
    c.drawNextMonth();
    refreshBindings();
  }

  // console.log("\n\n#### c:");
  // console.log(c);

  $scope.foo = "Welcome. Under Construction.";

  $scope.stats = {
    "datetime": null,
    "bmi": null,
    "bfp1": null,
    "bfp2": null,
    "lbs": null,
    "bicep": null,
    "belly": null
  }

  // $scope.statTypes = [
  //   {"type": "datetime"},
  //   {"type": "bmi"},
  //   {"type": "bfp1"},
  //   {"type": "bfp2"},
  //   {"type": "lbs"},
  //   {"type": "bicep"},
  //   {"type": "belly"}
  // ]


  $scope.statTypes = Object.keys($scope.stats);
  $scope.statType = null;

  var d = new Date();


  // console.log("\n\n#### d:");
  // console.log(d);

  var c = new Calendar("month", function (year, month, day) {console.log("calendar year:"+year+", month:"+month+", day:"+day)});
  c.drawCurrent();

  refreshBindings();


}]);
