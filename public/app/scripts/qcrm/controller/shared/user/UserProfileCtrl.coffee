angular.module("qcrm")
    .controller "UserProfileCtrl", [
        "$scope",
        "$rootScope",
        "$routeParams"
        "User",
        ($scope, $rootScope, $routeParams, User) ->
            if $routeParams.id
                User.findOne({filter:{where:{id:$routeParams.id}, include:"image"}}, (user) ->
                    $scope.user = user
                    User.prototype$leading_games({id:user.id}, (games) ->
                        $scope.user.leading_games = games
                    )
                )
            else
                $scope.user = User.getCurrent()

]
