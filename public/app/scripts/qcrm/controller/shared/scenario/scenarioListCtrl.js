// Generated by CoffeeScript 1.6.3
(function() {
  angular.module("qcrm").controller("ScenarioListCtrl", [
    "$scope", "$rootScope", "$filter", "$modal", "Scenario", function($scope, $rootScope, $filter, $modal, Scenario) {
      var ModalScenarioCtrl, init, load_scenarios;
      $scope.filteredScenarios = [];
      $scope.numPerPageOpt = [3, 5, 10, 20];
      $scope.numPerPage = $scope.numPerPageOpt[2];
      $scope.currentPage = 1;
      $scope.currentPageScenarios = [];
      $scope.row = '';
      $scope.scenarios = [];
      $scope.select = function(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        if ('undefined' !== typeof $scope.filteredScenarios) {
          return $scope.currentPageScenarios = $scope.filteredScenarios.slice(start, end);
        }
      };
      $scope.onFilterChange = function() {
        $scope.select(1);
        $scope.currentPage = 1;
        return $scope.row = '';
      };
      $scope.onNumPerPageChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.onOrderChange = function() {
        $scope.select(1);
        return $scope.currentPage = 1;
      };
      $scope.search = function() {
        $scope.filteredScenarios = $filter('filter')($scope.scenarios, $scope.searchKeywords);
        return $scope.onFilterChange();
      };
      $scope.order = function(rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredScenarios = $filter('orderBy')($scope.scenarios, rowName);
        return $scope.onOrderChange();
        /*@TODO Редактирование scenario*/

      };
      $scope.edit = function(scenario) {
        $scope.scenario = scenario;
        return $scope.openDialog();
      };
      $scope.remove = function(scenario) {
        return angular.forEach($scope.scenarios, function(sc, index) {
          var old_sort;
          if (sc.id === scenario.id) {
            Scenario.destroyById({
              id: sc.id
            });
            $scope.scenarios.splice(index, 1);
            old_sort = $scope.row;
            $scope.search();
            $scope.order(old_sort);
            return $scope.onOrderChange();
          }
        });
      };
      $scope.add = function() {
        $scope.scenario = {};
        return $scope.openDialog();
      };
      $scope.openDialog = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'views/qcrm/shared/scenario/form.html',
          controller: ModalScenarioCtrl,
          size: 'lg',
          resolve: {
            scenario: function() {
              return $scope.scenario;
            }
          }
        });
        return modalInstance.result.then(function(scenario) {
          return load_scenarios();
        });
      };
      ModalScenarioCtrl = function($scope, $modalInstance, scenario) {
        $scope.scenario = scenario || {};
        $scope.uploader = $rootScope.uploader;
        $scope.canSubmit = function() {
          return true;
        };
        $scope.submitForm = function() {
          $scope.scenario.image_id = $scope.scenario.image.id;
          delete $scope.scenario.image;
          $scope.scenario = Scenario.upsert($scope.scenario);
          return $modalInstance.close($scope.scenario);
        };
        return $scope.cancel = function() {
          return $modalInstance.dismiss('cancel');
        };
      };
      init = function() {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      load_scenarios = function() {
        return Scenario.find({
          filter: {
            include: "image"
          }
        }, function(scenarios) {
          $scope.scenarios = scenarios;
          $scope.select(1);
          $scope.currentPage = 1;
          return init();
        });
      };
      return load_scenarios();
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=scenarioListCtrl.map
*/