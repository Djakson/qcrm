(function() {
  angular.module('qcrm').controller("AuthCtrl", function($scope, User) {
    $scope.user = {};
    return $scope.login = function() {
      var email, password;
      email = $scope.user.email;
      password = $scope.user.password;
      console.log(email, password);
      if ($scope.user.$valid) {
        return User.login({
          email: email,
          password: password
        }, function(err, res) {
          return console.log(res);
        });
      }
    };
  });

}).call(this);
