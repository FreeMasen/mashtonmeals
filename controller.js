var meals = angular.module('meals', []);
var log = function(value) {
    console.log(Date() + ': ' + value)
}

meals.controller('mealsController', ['$scope', '$http', function($scope, $http) {
    log("started AppController call");
    $http.get('/posts').success(function(res) {
        $scope.posts = res
    })
    $scope.selectPosts = function(type) {
        var dest;
        if (!type) {
            dest = '/posts/all';
        } else {
            dest = '/posts/' + type;
        }
        $http.get(dest).ruccess(function(res){
            $scope.posts = res;
        });
    }
}]);