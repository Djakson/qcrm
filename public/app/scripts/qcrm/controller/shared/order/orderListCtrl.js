// Generated by CoffeeScript 1.6.3
(function() {
  angular.module("qcrm").controller("OrderListCtrl", [
    "$scope", "$rootScope", "$filter", "$modal", "Order", function($scope, $rootScope, $filter, $modal, Order) {
      var ModalOrderCtrl, init, load_orders;
      $scope.filteredOrders = [];
      $scope.numPerPageOpt = [3, 5, 10, 20];
      $scope.numPerPage = $scope.numPerPageOpt[2];
      $scope.currentPage = 1;
      $scope.currentPageOrders = [];
      $scope.row = '';
      $scope.orders = [];
      $scope.select = function(page) {
        var end, start;
        start = (page - 1) * $scope.numPerPage;
        end = start + $scope.numPerPage;
        if ('undefined' !== typeof $scope.filteredOrders) {
          return $scope.currentPageOrders = $scope.filteredOrders.slice(start, end);
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
        $scope.filteredOrders = $filter('filter')($scope.orders, $scope.searchKeywords);
        return $scope.onFilterChange();
      };
      $scope.order = function(rowName) {
        if ($scope.row === rowName) {
          return;
        }
        $scope.row = rowName;
        $scope.filteredOrders = $filter('orderBy')($scope.orders, rowName);
        return $scope.onOrderChange();
        /*@TODO Редактирование заказа*/

      };
      $scope.edit = function(order) {
        $scope.orderObj = order;
        return $scope.openDialog();
      };
      $scope.add = function() {
        $scope.orderObj = {};
        return $scope.openDialog();
      };
      $scope.openDialog = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'views/qcrm/shared/order/form.html',
          controller: ModalOrderCtrl,
          size: 'lg',
          resolve: {
            order: function() {
              return $scope.orderObj;
            }
          }
        });
        return modalInstance.result.then(function(order) {
          return load_orders();
        });
      };
      ModalOrderCtrl = function($scope, $modalInstance, order) {
        $scope.order = order || {};
        $scope.canSubmit = function() {
          return true;
        };
        $scope.today = function() {
          return $scope.dt = order.order_date;
        };
        $scope.today();
        $scope.showWeeks = true;
        $scope.toggleWeeks = function() {
          return $scope.showWeeks = !$scope.showWeeks;
        };
        $scope.disabled = function(date, mode) {
          return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };
        $scope.toggleMin = function() {
          var _ref;
          return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
            "null": new Date()
          };
        };
        $scope.dateOptions = {
          'year-format': "'yy'",
          'starting-day': 1
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.order = order || {};
        $scope.disabled = function(date, mode) {
          return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };
        $scope.submitForm = function() {
          return $modalInstance.close($scope.order);
        };
        return $scope.cancel = function() {
          return $modalInstance.dismiss('cancel');
        };
      };
      init = function() {
        $scope.search();
        return $scope.select($scope.currentPage);
      };
      load_orders = function() {
        return Order.find().$promise.then(function(orders) {
          $scope.orders = orders;
          return init();
        });
      };
      return load_orders();
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=orderListCtrl.map
*/
