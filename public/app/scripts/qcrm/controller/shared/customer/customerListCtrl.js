(function() {
  angular.module("qcrm").controller("customerListCtrl", [
    '$scope', 'Customer', '$rootScope', '$filter', function($scope, Customer, $rootScope, $filter) {
      var init;
      $scope.customers = Customer.find();
      $scope.filteredCustomers = [];
      $scope.row = '';
      $scope.select = function(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        return $scope.currentPageCustomers = $scope.filteredCustomers.slice(start, end);
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
        $scope.filteredCustomers = $filter('filter')($scope.customers, $scope.searchKeywords);
        return $scope.onFilterChange();
      };
      $scope.order = function(rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredCustomers = $filter('orderBy')($scope.customers, rowName);
        return $scope.onOrderChange();

        /*@TODO Редактирование пользователя */
      };
      $scope.edit = function(user) {
        return console.log(user);
      };
      $scope.numPerPageOpt = [3, 5, 10, 20];
      $scope.numPerPage = $scope.numPerPageOpt[2];
      $scope.currentPage = 1;
      $scope.currentPageCustomers = [];
      init = function() {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      init();
      return $scope.$watchCollection('customers', function(value) {
        return init();
      });
    }
  ]);

}).call(this);
