angular.module("qcrm")
.controller "userListCtrl",
[
  '$scope',
  'User',
  'Franchisee',
  'City',
  'Image',
  'Scenario',
  '$rootScope',
  '$filter',
  '$modal',
  ($scope, User, Franchisee, City, Image, Scenario, $rootScope, $filter, $modal) ->

      $scope.filteredUsers = []

      # pagination
      $scope.numPerPageOpt = [3, 5, 10, 20]
      $scope.numPerPage = $scope.numPerPageOpt[2]
      $scope.currentPage = 1
      $scope.currentPageUsers = []

      $scope.row = ''
      $scope.users = []
      $scope.cities = City.find()

      $scope.select = (page) ->
        start = (page - 1) * $scope.numPerPage
        end = start + $scope.numPerPage
        if 'undefined' != typeof $scope.filteredUsers
          $scope.currentPageUsers = $scope.filteredUsers.slice(start, end)

      # on page change: change numPerPage, filtering string
      $scope.onFilterChange = ->
        $scope.select(1)
        $scope.currentPage = 1
        $scope.row = ''

      $scope.onNumPerPageChange = ->
        $scope.select(1)
        $scope.currentPage = 1

      $scope.onOrderChange = ->
        $scope.select(1)
        $scope.currentPage = 1


      $scope.search = ->
        $scope.filteredUsers = $filter('filter')($scope.users, $scope.searchKeywords)
        $scope.onFilterChange()

      $scope.$watch 'onlyFranchisee', (value) ->
        if true == value
          $scope.filteredUsers = $filter('filter')(
            $scope.users,
            (v) ->
              try
                uid = v.franchisee.user_id
                return "franchisee"
              catch
                return false
          )
        else
          $scope.filteredUsers = $scope.users
        $scope.onFilterChange()



      # orderBy
      $scope.order = (rowName)->
        if $scope.row == rowName
          return
        $scope.row = rowName
        $scope.filteredUsers = $filter('orderBy')($scope.users, rowName)
        $scope.onOrderChange()

      ### Редактирование пользователя ###
      $scope.edit = (user) ->
        $scope.user = user
        $scope.openDialog()

      $scope.remove = (user) ->
        angular.forEach $scope.users, (u, index) ->
          if u.id == user.id
            User.destroyById(id:u.id)
            $scope.users.splice index, 1
            old_sort = $scope.row
            $scope.search()
            $scope.order(old_sort)
            $scope.onOrderChange()


      $scope.add = () ->
        $scope.user = {}
        $scope.openDialog()

      $scope.openDialog = () ->
        modalInstance = $modal.open
                          templateUrl: 'views/qcrm/admin/user/form.html'
                          controller: ModalUserCtrl
                          size: 'lg',
                          resolve: {
                            user: () -> $scope.user
                            cities: () -> $scope.cities
                          }
        modalInstance.result.then (user) ->
          load_users()

      # Modal Controller
      ModalUserCtrl = ($scope, $modalInstance, user, cities) ->
        $scope.user = user || {};
        $scope.cities = cities
        $scope.city = cities[0]
        $scope.uploader = $rootScope.uploader
        $scope.canSubmit = () -> true

        if user.franchisee
          $scope.city = cities.filter((v) -> parseInt(v.id) == parseInt(user.franchisee.city_id))[0]
          $scope.franchisee = Franchisee.findOne({filter:{where:{id:user.franchisee.id},include:"scenarios"}}, (franchisee) ->
              angular.forEach $scope.franchisee.scenarios, (scenario, index) ->
                Scenario.findOne({filter:{where:{id:scenario.id}, include:"image"}}, (scenario) ->
                    $scope.franchisee.scenarios[index] = scenario
                  )
            )

        else
          $scope.city = {}


        $scope.citySelected = (city) ->
          if $scope.franchisee
             $scope.franchisee.city_id = city.id.toString()

        $scope.submitForm = () ->
          $scope.user.image_id = $scope.user.image.id
          delete $scope.user.image
          delete $scope.user.franchisee
          $scope.user = User.upsert($scope.user)
          $scope.user.franchisee = Franchisee.upsert $scope.franchisee
          $modalInstance.close $scope.user

        $scope.cancel = () ->
          $modalInstance.dismiss 'cancel'

        $scope.scenariosModal = () ->
          $modal.open
              templateUrl: 'views/qcrm/shared/scenario/list__modal.html'
              controller: ModalScenarioListCtrl
              size: 'lg',
              resolve: {
                selected_scenarios: () -> $scope.franchisee.scenarios
                franchisee: () -> $scope.franchisee
              }
        ModalScenarioListCtrl = ($scope, $modalInstance, selected_scenarios, franchisee) ->
            load_scenarios = () ->
              Scenario.find({filter:include:"image"}, (scenarios) ->
                $scope.scenarios = scenarios
                angular.forEach(scenarios,  (scenario, index) ->
                  angular.forEach selected_scenarios, do (scenario, index) -> (selected) ->
                      if selected.id == scenario.id
                        scenario.selected = true
                        $scope.scenarios[index] = scenario
                  )
                )
            load_scenarios()
            $scope.addTo = (scenario) ->
              selected_scenarios.push(scenario)
              Franchisee.prototype$addScenario({id:franchisee.id}, scenario, (scenarios)-> load_scenarios())
            $scope.removeFrom = (scenario) ->
              Franchisee.prototype$removeScenario({id:franchisee.id}, scenario, (scenarios)-> load_scenarios())
              angular.forEach(selected_scenarios, (selected, index) ->
                if selected.id == scenario.id
                  selected_scenarios.splice index,1
              )
      # END Modal Controller

      # init
      init = ->
        $scope.search()
        $scope.select($scope.currentPage)

      load_users = () ->
        User.find({filter:include:'image'}).$promise.then(
          (users) ->
            $scope.users = users
            init()
            $scope.franchisees = Franchisee.find().$promise.then(
              (franchisees)->
                for user, id in $scope.users
                  for franchisee in franchisees
                    Franchisee.user
                      id:franchisee.id,
                      do (user, id, franchisee) -> (u) ->
                        if u.id == user.id
                          user.franchisee = franchisee
                          $scope.users[id] = user
            )
        )

      load_users()

]
