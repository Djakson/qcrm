'use strict';

angular.module('app.controllers', [])

# overall control
.controller('AppCtrl', [
    '$scope', '$location', '$rootScope', 'User', '$fileUploader'
    ($scope, $location, $rootScope, User, $fileUploader) ->
        $rootScope.user = User.getCurrent()
        $scope.isSpecificPage = ->
            path = $location.path()
            return _.contains( ['/404', '/pages/500', '/pages/login', '/pages/signin', '/pages/signin1', '/pages/signin2', '/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/lock-screen'], path )

        $scope.main =
            brand: 'Flatify'
            name: 'Lisa Doe' # those which uses i18n can not be replaced with two way binding var for now.

        uploader = $rootScope.uploader = $fileUploader.create(
          scope: $rootScope,
          url: '/api/storages/images/upload'
          formData: [
            { key: 'value' }
          ]
          filters: [
            (item) ->
              console.info('filter1')
              return true
          ]
          autoUpload: true
        )

        uploader.bind('afteraddingfile', (event, item) ->
          console.info('After adding a file', item)
          uploader.upload
        )

        uploader.bind('whenaddingfilefailed', (event, item) ->
          console.info('When adding a file failed', item)
        )

        uploader.bind('afteraddingall', (event, items) ->
          console.info('After adding all files', items)
        )

        uploader.bind('beforeupload', (event, item) ->
          console.info('Before upload', item)
        )

        uploader.bind('progress', (event, item, progress) ->
          console.info('Progress: ' + progress, item)
        )

        uploader.bind('success', (event, xhr, item, response) ->
          console.info('Success', xhr, item, response)
          $scope.$broadcast('uploadCompleted', item)
        )

        uploader.bind('cancel', (event, xhr, item) ->
          console.info('Cancel', xhr, item)
        )

        uploader.bind('error', (event, xhr, item, response) ->
          console.info('Error', xhr, item, response)
        )

        uploader.bind('complete', (event, xhr, item, response) ->
          console.info('Complete', xhr, item, response)
        )

        uploader.bind('progressall', (event, progress) ->
          console.info('Total progress: ' + progress)
        )

        uploader.bind('completeall', (event, items) ->
          console.info('Complete all', items)
        )


])

.controller('NavCtrl', [
    '$scope', 'taskStorage', 'filterFilter'
    ($scope, taskStorage, filterFilter) ->
        # init
        tasks = $scope.tasks = taskStorage.get()
        $scope.taskRemainingCount = filterFilter(tasks, {completed: false}).length

        $scope.$on('taskRemaining:changed', (event, count) ->
            $scope.taskRemainingCount = count
        )
])

.controller('DashboardCtrl', [
    '$scope'
    ($scope) ->

        $scope.comboChartData = [
            ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average']
            ['2014/05',  165,      938,         522,             998,           450,      614.6]
            ['2014/06',  135,      1120,        599,             1268,          288,      682]
            ['2014/07',  157,      1167,        587,             807,           397,      623]
            ['2014/08',  139,      1110,        615,             968,           215,      609.4]
            ['2014/09',  136,      691,         629,             1026,          366,      569.6]
        ]

        $scope.salesData = [
            ['Year', 'Sales', 'Expenses']
            ['2010',  1000,      400]
            ['2011',  1170,      460]
            ['2012',  660,       1120]
            ['2013',  1030,      540]
        ]

])


.controller 'FilesCtrl', ($scope, $http) ->
  $scope.load = ->
    $http.get('/api/containers/images/files').success(
      (data) ->
        console.log(data)
        $scope.files = data
    )
  $scope.delete = (index, id) ->
    $http.delete('/api/containers/images/files/' + encodeURIComponent(id)).success(
      (data, status, headers) ->
        $scope.files.splice(index, 1)
    )
  $scope.$on('uploadCompleted', (event) ->
    console.log('uploadCompleted event received');
    $scope.load()
  )