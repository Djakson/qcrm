angular.module("qcrm")
.controller "ScenarioListCtrl", [
    "$scope",
    "$rootScope",
    "$filter",
    "$modal",
    "Scenario",
    ($scope, $rootScope, $filter, $modal, Scenario) ->
        $scope.filteredScenarios = []
        # pagination
        $scope.numPerPageOpt = [3, 5, 10, 20]
        $scope.numPerPage = $scope.numPerPageOpt[2]
        $scope.currentPage = 1
        $scope.currentPageScenarios = []

        $scope.row = ''
        $scope.scenarios = []

        $scope.select = (page) ->
          start = (page - 1) * $scope.numPerPage
          end = start + $scope.numPerPage
          if 'undefined' != typeof $scope.filteredScenarios
            $scope.currentPageScenarios = $scope.filteredScenarios.slice(start, end)

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
          $scope.filteredScenarios = $filter('filter')($scope.scenarios, $scope.searchKeywords)
          $scope.onFilterChange()


        # orderBy
        $scope.order = (rowName)->
          if $scope.row == rowName
            return
          $scope.row = rowName
          $scope.filteredScenarios = $filter('orderBy')($scope.scenarios, rowName)
          $scope.onOrderChange()

          ###@TODO Редактирование scenario ###
        $scope.edit = (scenario) ->
          $scope.scenario = scenario
          $scope.openDialog()

        $scope.remove = (scenario) ->
          angular.forEach $scope.scenarios, (sc, index) ->
            if sc.id == scenario.id
              Scenario.destroyById(id:sc.id)
              $scope.scenarios.splice index, 1
              old_sort = $scope.row
              $scope.search()
              $scope.order(old_sort)
              $scope.onOrderChange()

        $scope.add = () ->
          $scope.scenario = {}
          $scope.openDialog()

        $scope.openDialog = () ->
          modalInstance = $modal.open
                            templateUrl: 'views/qcrm/shared/scenario/form.html'
                            controller: ModalScenarioCtrl
                            size: 'lg',
                            resolve: {
                              scenario: () -> $scope.scenario
                            }
          modalInstance.result.then (scenario) ->
            load_scenarios()

        # Modal Controller
        ModalScenarioCtrl = ($scope, $modalInstance, scenario) ->
          $scope.scenario = scenario || {};
          $scope.uploader = $rootScope.uploader
          $scope.canSubmit = () -> true



          $scope.submitForm = () ->
            $scope.scenario.image_id = $scope.scenario.image.id
            delete $scope.scenario.image
            $scope.scenario = Scenario.upsert($scope.scenario)
            $modalInstance.close $scope.scenario

          $scope.cancel = () ->
            $modalInstance.dismiss 'cancel'



  # END Modal Controller

        # init
        init = ->
          $scope.search()
          $scope.select($scope.currentPage)

        load_scenarios = () ->
                Scenario.find({filter:include:"image"}, (scenarios) ->
                  $scope.scenarios = scenarios
                  $scope.select(1)
                  $scope.currentPage = 1
                  init()
                )

        load_scenarios()
  ]
