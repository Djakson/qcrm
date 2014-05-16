angular.module("qcrm")
.controller "GameListCtrl", [
    "$scope",
    "$rootScope",
    "$filter",
    "$modal",
    "Game",
    "Scenario",
    ($scope, $rootScope, $filter, $modal, Game, Scenario) ->
        $scope.filteredGames = []
        # pagination
        $scope.numPerPageOpt = [3, 5, 10, 20]
        $scope.numPerPage = $scope.numPerPageOpt[2]
        $scope.currentPage = 1
        $scope.currentPageGames = []

        $scope.row = ''
        $scope.games = []


        $scope.select = (page) ->
          start = (page - 1) * $scope.numPerPage
          end = start + $scope.numPerPage
          if 'undefined' != typeof $scope.filteredGames
            $scope.currentPageGames = $scope.filteredGames.slice(start, end)

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
          $scope.filteredGames = $filter('filter')($scope.games, $scope.searchKeywords)
          $scope.onFilterChange()

        # orderBy
        $scope.order = (rowName)->
          if $scope.row == rowName
            return
          $scope.row = rowName
          $scope.filteredGames = $filter('orderBy')($scope.games, rowName)
          # console.log $scope.filteredStores
          $scope.onOrderChange()

          ###@TODO Редактирование game ###
        $scope.edit = (game) ->
          $scope.game = game
          $scope.openDialog()

        $scope.add = () ->
          $scope.game = {}
          $scope.openDialog()

        $scope.remove = (game) ->
          angular.forEach $scope.games, (g, index) ->
            if g.id == game.id
              Game.destroyById(id:g.id)
              $scope.games.splice(index, 1)
              old_sort = $scope.row
              $scope.search()
              $scope.order(old_sort)
              $scope.onOrderChange()

        $scope.openDialog = () ->
          modalInstance = $modal.open
                            templateUrl: 'views/qcrm/shared/game/form.html'
                            controller: ModalGameCtrl
                            size: 'lg',
                            resolve: {
                              game: () -> $scope.game
                            }
          modalInstance.result.then (game) ->
            load_games()

        # Modal Controller
        ModalGameCtrl = ($scope, $modalInstance, game) ->

          $scope.scenario = game.scenario

          $scope.mytime = new Date()

          $scope.hstep = 1
          $scope.mstep = 15

          $scope.options =
              hstep: [1, 2, 3]
              mstep: [1, 5, 10, 15, 25, 30]

          $scope.ismeridian = true
          $scope.toggleMode = ->
              $scope.ismeridian = ! $scope.ismeridian

          $scope.update = ->
              d = new Date()
              d.setHours( 14 )
              d.setMinutes( 0 )
              $scope.mytime = d

          $scope.changed = ->
              console.log('Time changed to: ' + $scope.game.time_begin)

          $scope.today = ->
            $scope.dt = game.item_date
          $scope.today()

          $scope.showWeeks = true
          $scope.toggleWeeks = ->
              $scope.showWeeks = ! $scope.showWeeks

          # Disable weekend selection
          $scope.disabled = (date, mode) ->
              return ( mode is 'day' && ( date.getDay() is 0 || date.getDay() is 6 ) )

          $scope.toggleMin = ->
              $scope.minDate = ( $scope.minDate ) ? null : new Date()
          $scope.toggleMin()

          $scope.open = ($event) ->
              $event.preventDefault()
              $event.stopPropagation()

              $scope.opened = true

          $scope.dateOptions = {
              'year-format': "'yy'"
              'starting-day': 1
          }

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate']
          $scope.format = $scope.formats[0]


          $scope.game = game || {};
          $scope.uploader = $rootScope.uploader
          $scope.canSubmit = () -> true


          $scope.scenariosModal = () ->
                    modalInstance = $modal.open
                        templateUrl: 'views/qcrm/shared/scenario/list__modal.html'
                        controller: ModalScenarioListCtrl
                        size: 'lg',
                        resolve: {
                          game: () -> $scope.game
                        }
                    modalInstance.result.then (game) ->
                      $scope.game.scenario = game.scenario
                      $scope.scenario = game.scenario

          ModalScenarioListCtrl = ($scope, $modalInstance, game) ->
              load_scenarios = () ->
                Scenario.find({filter:include:"image"}, (scenarios) ->
                  $scope.scenarios = scenarios
                  angular.forEach scenarios,  (scenario, index) ->
                    if game.scenario.id == scenario.id
                      scenario.selected = true
                      $scope.scenarios[index] = scenario
                )
              load_scenarios()
              $scope.addTo = (scenario) ->
                game.scenario = scenario
                angular.forEach($scope.scenarios, (scn, index) ->
                  if scn.id != scenario.id
                    $scope.scenarios[index].selected = false
                )
                scenario.selected = true
              $scope.removeFrom = (scenario) ->
                scenario.selected = false
                game.scenario = null
              $scope.cancel = () ->
                $modalInstance.dismiss 'cancel'

              $scope.submitForm = () ->
                $modalInstance.close game


          $scope.submitForm = () ->
            try
              $scope.game.scenario_id = $scope.game.scenario.id
            catch e
              console.log e

            Game.upsert(
              $scope.game,
              (g) ->
                console.log g,
              (err) ->
                console.info err
            )
            $modalInstance.close $scope.game

          $scope.cancel = () ->
            $modalInstance.dismiss 'cancel'




  # END Modal Controller

        # init
        init = ->
          $scope.search()
          $scope.select($scope.currentPage)

        load_games = () ->
                Game.find({}, (games) ->
                  # angular.forEach games, (game, index) ->
                  #   Scenario.findOne({filter:{where:{id:game.scenario.id}, include:"image"}}, (scenario) ->
                  #     game.scenario = scenario
                  #   )
                  #   game.editable = true
                  $scope.games = games
                  $scope.select(1)
                  $scope.currentPage = 1
                  init()
                )

        load_games()
  ]
