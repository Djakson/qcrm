(function() {
  angular.module('qcrm').controller('ACLCtrl', [
    '$scope', '$location', '$rootScope', 'dacl', 'User', function($scope, $location, $rootScope, dacl, User) {
      $scope.roles = dacl.getRoles();
      $scope.permissions = dacl.getPermissions();
      $scope.users = User.find();
      $scope.allow = function() {};
      return $scope.can = function(role, model, action) {};
    }
  ]);

}).call(this);
