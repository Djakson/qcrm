app = angular.module("qcrm")

app.directive 'userTag', ['User', (User) ->
    restrict: 'AEC'
    templateUrl: '/app/views/qcrm/shared/partials/user_tag.html'
    replace: false
    scope:
        model: '='
    link: (scope, element, attributes) ->
        scope.user = scope.model
        # scope.popoverText = element.find('.hidden_data').html()

]


app.directive 'gamelead', ['Game', 'User', '$modal', (Game, User, $modal) ->
    restrict: 'AEC'
    templateUrl: '/app/views/qcrm/shared/partials/gamelead.html',
    scope:
        user: '=model'
    link: (scope, element, attributes) ->
        User.findOne({filter:{where:{id:scope.user.id}, include:"image"}}, (user) ->
            scope.user = user
        )

        scope.select = () ->
            modalInstance = $modal.open
                templateUrl: '/app/views/qcrm/shared/partials/user_dialog_list.html'
                controller: ModalUserListCtrl
                resolve:
                    selected: () -> scope.user

            modalInstance.result.then (user) ->
                scope.user = user

        ModalUserListCtrl = ($scope, $modalInstance, selected) ->
            User.find({filter:{include:"image"}}, (users) ->
                $scope.users = users
                angular.forEach $scope.users, (user, index) ->
                    if user.id == selected.id
                        $scope.users[index].selected = true
                    else
                        $scope.users[index].selected = false
            )

            $scope.selected = selected

            $scope.choose = (u) ->
                if u.selected
                    angular.forEach $scope.users, (user, index) ->
                        if user.id != u.id
                            $scope.users[index].selected = false
                $scope.selected = u

            $scope.select = () ->
                $modalInstance.close $scope.selected

            $scope.cancel = () ->
                $modalInstance.dismiss 'cancel'

]

###
QCRM Media Object Directive
@example <qmo data-entity="user" data-model="game.lead"></qmo>
@example <qmo data-entity="game" data-model="game" data-include="['lead', 'scenario', {'scenario':'image'}, {'lead':'image'}]"></qmo>
@return to template  [entity, media_object]
###
app.directive "qmo", ["$compile", "$http", "$templateCache", '$timeout', 'User', 'Game', 'Scenario', 'Order',
    ($compile, $http, $templateCache, $timeout, User, Game, Scenario, Order) ->
        getTemplate = (entity) ->
            baseUrl = "/app/views/qcrm/shared/partials/media_object/"
            templateUrl = baseUrl + entity + ".html"
            templateLoader = $http.get(templateUrl, {cache: $templateCache})
            return templateLoader;

        linker = (scope, element, attrs) ->
            loader = getTemplate(scope.entity)
            promise = loader.success((html) ->
                element.html html
            ).then((response) ->
                if "object" == typeof scope.include
                    model = (eval ucfirst(scope.entity))
                    model.findOne({filter:{include:scope.include, where:{id:scope.media_object.id}}}, (media_object) ->
                            scope.media_object = media_object
                            element.replaceWith($compile(element.html())(scope))
                    )
                else
                    element.replaceWith($compile(element.html())(scope))
            )

        return {
            restrict: "AEC"
            scope:
                entity: "@"
                media_object: "=model"
                include: "="
            link: linker
        }


]
