(function() {
  'use strict';
  angular.module('app.controllers', []).controller('AppCtrl', [
    '$scope', '$location', '$rootScope', 'User', '$fileUploader', function($scope, $location, $rootScope, User, $fileUploader) {
      var uploader;
      $rootScope.user = User.getCurrent();
      $scope.isSpecificPage = function() {
        var path;
        path = $location.path();
        return _.contains(['/404', '/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/lock-screen'], path);
      };
      $scope.main = {
        brand: 'Flatify',
        name: 'Lisa Doe'
      };
      uploader = $rootScope.uploader = $fileUploader.create({
        scope: $rootScope,
        url: '/api/storages/images/upload',
        formData: [
          {
            key: 'value'
          }
        ],
        filters: [
          function(item) {
            console.info('filter1');
            return true;
          }
        ],
        autoUpload: true
      });
      uploader.bind('afteraddingfile', function(event, item) {
        console.info('After adding a file', item);
        return uploader.upload;
      });
      uploader.bind('whenaddingfilefailed', function(event, item) {
        return console.info('When adding a file failed', item);
      });
      uploader.bind('afteraddingall', function(event, items) {
        return console.info('After adding all files', items);
      });
      uploader.bind('beforeupload', function(event, item) {
        return console.info('Before upload', item);
      });
      uploader.bind('progress', function(event, item, progress) {
        return console.info('Progress: ' + progress, item);
      });
      uploader.bind('success', function(event, xhr, item, response) {
        console.info('Success', xhr, item, response);
        return $scope.$broadcast('uploadCompleted', item);
      });
      uploader.bind('cancel', function(event, xhr, item) {
        return console.info('Cancel', xhr, item);
      });
      uploader.bind('error', function(event, xhr, item, response) {
        return console.info('Error', xhr, item, response);
      });
      uploader.bind('complete', function(event, xhr, item, response) {
        return console.info('Complete', xhr, item, response);
      });
      uploader.bind('progressall', function(event, progress) {
        return console.info('Total progress: ' + progress);
      });
      return uploader.bind('completeall', function(event, items) {
        return console.info('Complete all', items);
      });
    }
  ]).controller('NavCtrl', [
    '$scope', 'taskStorage', 'filterFilter', function($scope, taskStorage, filterFilter) {
      var tasks;
      tasks = $scope.tasks = taskStorage.get();
      $scope.taskRemainingCount = filterFilter(tasks, {
        completed: false
      }).length;
      return $scope.$on('taskRemaining:changed', function(event, count) {
        return $scope.taskRemainingCount = count;
      });
    }
  ]).controller('DashboardCtrl', [
    '$scope', function($scope) {
      $scope.comboChartData = [['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'], ['2014/05', 165, 938, 522, 998, 450, 614.6], ['2014/06', 135, 1120, 599, 1268, 288, 682], ['2014/07', 157, 1167, 587, 807, 397, 623], ['2014/08', 139, 1110, 615, 968, 215, 609.4], ['2014/09', 136, 691, 629, 1026, 366, 569.6]];
      return $scope.salesData = [['Year', 'Sales', 'Expenses'], ['2010', 1000, 400], ['2011', 1170, 460], ['2012', 660, 1120], ['2013', 1030, 540]];
    }
  ]).controller('FilesCtrl', function($scope, $http) {
    $scope.load = function() {
      return $http.get('/api/containers/images/files').success(function(data) {
        console.log(data);
        return $scope.files = data;
      });
    };
    $scope["delete"] = function(index, id) {
      return $http["delete"]('/api/containers/images/files/' + encodeURIComponent(id)).success(function(data, status, headers) {
        return $scope.files.splice(index, 1);
      });
    };
    return $scope.$on('uploadCompleted', function(event) {
      console.log('uploadCompleted event received');
      return $scope.load();
    });
  });

}).call(this);
