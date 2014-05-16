// Generated by CoffeeScript 1.6.3
(function() {
  angular.module("qcrm").controller("UserProfileCtrl", [
    "$scope", "$rootScope", "$routeParams", "User", function($scope, $rootScope, $routeParams, User) {
      if ($routeParams.id) {
        return User.findOne({
          filter: {
            where: {
              id: $routeParams.id
            },
            include: "image"
          }
        }, function(user) {
          $scope.user = user;
          return User.prototype$leading_games({
            id: user.id
          }, function(games) {
            return $scope.user.leading_games = games;
          });
        });
      } else {
        return $scope.user = User.getCurrent();
      }
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=UserProfileCtrl.map
*/