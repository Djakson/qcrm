angular.module('qcrm')
.controller('ACLCtrl', ['$scope', '$location', '$rootScope', 'dacl', 'User', ($scope, $location, $rootScope, dacl, User) ->

    $scope.roles = dacl.getRoles()
    $scope.permissions = dacl.getPermissions()
    $scope.users = User.find()

    $scope.allow = () ->


    $scope.can = (role, model, action) ->



])