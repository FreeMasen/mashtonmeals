var newUser = angular.module('newUser, []');

newUser.controller('newUserController', ['$scope', function() {
    log("start new user call")
    $http.get('/users').success(function(res) {
        $scope.posts = res
    });
}]);