var app = angular.module('helium', ['ngMaterial']);


app.controller('tdata', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    var vm = this;
    vm.messages = $scope.vm.messages || [];


    $scope.ask = function () {
      window.location.reload();
    };

            var answer = [];
            var id = "";
            var sensorname = "";
            var lastseen = "";
            var msg = [];

            var getinitial  = $http.get('/query');
            getinitial.success(
                function(payload) {
                  answer = payload.data;
                  //console.log(answer);
                  if(answer!="No Answer Found."){
                  angular.forEach(answer, function (value, key) {
                    id = String(value.id);
                   var promise = $http.get('/timeseries/' + id).then(function successCallback(response) {
                     sensorname = String(value.attributes.name);
                     lastseen = String(value.meta.updated);
                     id = String(value.id);
                     var msg = response.data;
                     var i = 0;
                     var temperature = [];
                     angular.forEach(msg.data, function (value, key) {
                       sensordata  = { "lastseen" : value.attributes.timestamp,
                                       "temp" :value.attributes.value };
                        temperature.push(sensordata);
                      });
                       params = {
                          "Name" : sensorname,
                          "id" : id,
                          "lastseen" : msg.data[0].attributes.timestamp,
                          "message" : msg.data[0].attributes.value,
                          "temperature": temperature
                          };
                          $scope.vm.messages.push(params);

                    }, function errorCallback(response) {
                       $scope.status = "Error";
                   });

                     });
                    }
                    else {
                      params = {
                          "name" : "No relevant response found"
                      };
                      $scope.vm.messages.push(params);
                    }

                },
                function(errorPayload) {
              console.log('failure loading data', errorPayload);
                });

}]);

app.filter('fromNow', function ($filter) {
    return function (value) {
      var now = moment(value).fromNow();
        return now;
    };
});
