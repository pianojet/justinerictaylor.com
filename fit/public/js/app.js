//= require lib/lodash/dist/lodash

angular.module('FITApp',[])
.controller('FITController', ['$scope', '$timeout', 'fitDataService', function($scope, $timeout, fitDataService) {
  console.log("######## app.js/FITController");

  var jsonIndex = {};
  var c = null;

  refreshBindings = function() {
    $scope.monthName = c.getMonthName();
    $scope.year = c.currentYear;    
  }

  $scope.drawPreviousMonth = function() {
    c.drawPreviousMonth();
    refreshBindings();
  }

  $scope.drawNextMonth = function() {
    c.drawNextMonth();
    refreshBindings();
  }

  objectifyData = function(data) {
    var newData = {};
    for (var i = 0; i < data.length; i++) {
      var year = data[i].year;
      var month = data[i].month;
      var day = data[i].day;
      if (!newData.hasOwnProperty(year)) newData[year] = {};
      if (!newData[year].hasOwnProperty(month)) newData[year][month] = {};
      if (!newData[year][month].hasOwnProperty(day)) newData[year][month][day] = {};
      newData[year][month][day] = data[i];
    }
    return newData;
  }

  $scope.foo = "Welcome. Under Construction.";

  getData = fitDataService.getJsonIndex().then(function(data) {
    console.log("\n#### jsonIndex data via service fitDataService:");
    console.log(data);
    jsonIndex = data;
  })

  var d = new Date();
  var calOpts = {
    "callback": function(year, month, day) {console.log("calendar year:"+year+", month:"+month+", day:"+day)},
  }

  refreshData = function() {
    console.log("calling getData...");
    getData.then(function(){
      console.log("then of getData...");
      c = new Calendar("month", calOpts);
      c.drawCurrent();
      refreshBindings();      
    })
  }
  refreshData();
}])
.service('fitDataService', ['$http', function($http) {
  return {
    getJsonIndex: function() {
      return $http.get("http://justinerictaylor.com/cal-pics/data.json", {
        cache: false
      })
    }

  }
}]);