angular.module('qcrm')
.controller "AuthCtrl", ($scope, User) ->
  $scope.user = {}
  $scope.login = () ->
    email = $scope.user.email
    password = $scope.user.password
    console.log email, password
    if $scope.user.$valid
      User.login {email:email, password:password}, (err, res) ->
        console.log res