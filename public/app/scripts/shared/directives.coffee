
directives = angular.module('app.directives', [])

.directive('imgHolder', [ ->
    return {
        restrict: 'A'
        link: (scope, ele, attrs) ->
            Holder.run(
                images: ele[0]
            )
    }
])

# add background and some style just for specific page
.directive('customBackground', () ->
    return {
        restrict: "A"
        controller: [
            '$scope', '$element', '$location'
            ($scope, $element, $location) ->
                path = ->
                    return $location.path()

                addBg = (path) ->
                    # remove all the classes
                    $element.removeClass('body-home body-special body-tasks body-lock')

                    # add certain class based on path
                    switch path
                        when '/' then $element.addClass('body-home')
                        when '/404', '/pages/500', '/pages/signin', '/pages/signup' then $element.addClass('body-special')
                        when '/pages/lock-screen' then $element.addClass('body-special body-lock')
                        when '/tasks' then $element.addClass('body-tasks')

                addBg( $location.path() )

                $scope.$watch(path, (newVal, oldVal) ->
                    if newVal is oldVal
                        return
                    addBg($location.path())
                )
        ]
    }
)

# switch stylesheet file
.directive('uiColorSwitch', [ ->
    return {
        restrict: 'A'
        link: (scope, ele, attrs) ->
            ele.find('.color-option').on('click', (event)->
                $this = $(this)
                hrefUrl = undefined

                style = $this.data('style')
                if style is 'loulou'
                    hrefUrl = 'styles/main.css'
                    $('link[href^="styles/main"]').attr('href',hrefUrl)
                else if style
                    style = '-' + style
                    hrefUrl = 'styles/main' + style + '.css'
                    $('link[href^="styles/main"]').attr('href',hrefUrl)
                else
                    return false

                event.preventDefault()
            )
    }
])

# for mini style NAV
.directive('toggleMinNav', [
    '$rootScope'
    ($rootScope) ->
        return {
            restrict: 'A'
            link: (scope, ele, attrs) ->
                app = $('#app')
                $window = $(window)
                # nav = $('#nav ul') # failt to get it

                ele.on('click', (e) ->
                    if app.hasClass('nav-min')
                        app.removeClass('nav-min')
                    else
                        app.addClass('nav-min')
                        $rootScope.$broadcast('minNav:enabled')

                    e.preventDefault()
                )

                # removeClass('nav-min') when size < $screen-sm
                Timer = undefined
                updateClass = ->
                    width = $window.width()
                    # console.log(width)
                    if width < 768 then app.removeClass('nav-min')
                $window.resize( () ->
                    clearTimeout(t)
                    t = setTimeout(updateClass, 300)
                )
        }
])
# for accordion/collapse style NAV
.directive('collapseNav', [ ->
    return {
        restrict: 'A'
        link: (scope, ele, attrs) ->
            $lists = ele.find('ul').parent('li') # only target li that has sub ul
            $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>')
            $a = $lists.children('a')
            $listsRest = ele.children('li').not($lists)
            $aRest = $listsRest.children('a')

            app = $('#app')

            $a.on('click', (event) ->

                # disable click event when Nav is in mini style
                if ( app.hasClass('nav-min') ) then return false

                $this = $(this)
                $parent = $this.parent('li')
                $lists.not( $parent ).removeClass('open').find('ul').slideUp()
                $parent.toggleClass('open').find('ul').slideToggle()

                event.preventDefault()
            )

            $aRest.on('click', (event) ->
                $lists.removeClass('open').find('ul').slideUp()
            )

            # reset collapse NAV, sub Ul should slideUp
            scope.$on('minNav:enabled', (event) ->
                $lists.removeClass('open').find('ul').slideUp()
            )

    }
])
# Add 'active' class to li based on url, muli-level supported, jquery free
.directive('highlightActive', [ ->
    return {
        restrict: "A"
        controller: [
            '$scope', '$element', '$attrs', '$location'
            ($scope, $element, $attrs, $location) ->
                links = $element.find('a')
                path = () ->
                    return $location.path()

                highlightActive = (links, path) ->
                    path = '#' + path

                    angular.forEach(links, (link) ->
                        $link = angular.element(link)
                        $li = $link.parent('li')
                        href = $link.attr('href')

                        if ($li.hasClass('active'))
                            $li.removeClass('active')
                        if path.indexOf(href) is 0
                            $li.addClass('active')
                    )

                highlightActive(links, $location.path())

                $scope.$watch(path, (newVal, oldVal) ->
                    if newVal is oldVal
                        return
                    highlightActive(links, $location.path())
                )
        ]

    }
])
# toggle on-canvas for small screen, with CSS
.directive('toggleOffCanvas', [ ->
    return {
        restrict: 'A'
        link: (scope, ele, attrs) ->
            ele.on('click', ->
                $('#app').toggleClass('on-canvas')
            )
    }
])
.directive('slimScroll', [ ->
    return {
        restrict: 'A'
        link: (scope, ele, attrs) ->
            ele.slimScroll({
                height: '100%'
            })
    }
])


# history back button
.directive('goBack', [ ->
    return {
        restrict: "A"
        controller: [
            '$scope', '$element', '$window'
            ($scope, $element, $window) ->
                $element.on('click', ->
                    $window.history.back()
                )
        ]
    }
])

directives.directive('ngThumb',
    '$window',
    ($window) ->
      helper =
        support: !!($window.FileReader && $window.CanvasRenderingContext2D)
        isFile: (item) ->
          angular.isObject(item) && item instanceof $window.File
        isImage: (file) ->
          type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|'
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) != -1
      return [
        restrict: 'A'
        template: '<canvas/>'
        link: (scope, element, attributes) ->
          if !helper.support then return
          params = scope.$eval(attributes.ngThumb)
          if !helper.isFile(params.file) then return
          if !helper.isImage(params.file) then return
          canvas = element.find('canvas')
          reader = new FileReader()
          reader.onload = onLoadFile
          reader.readAsDataURL(params.file)

          onLoadFile = (event) ->
            img = new Image()
            img.onload = onLoadImage
            img.src = event.target.result

          onLoadImage = () ->
            width = params.width || this.width / this.height * params.height
            height = params.height || this.height / this.width * params.width
            canvas.attr({ width: width, height: height })
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height)
      ])



###Создание thumbnail по указанной модели Image###
directives.directive 'qcthumb',
  ['Image', '$rootScope',
    (Image, $rootScope) ->
      restrict: 'AE'
      template: '<div><img ng-src="{{thumb.url}}" alt=""/><input ng-hide="!show_uploader" ng-file-select type="file" /></div>'
      replace: true
      scope:
        model: '='
        size: '='
      link: (scope, element, attributes) ->
        scope.thumb = []
        scope.show_uploader = attributes.uploader
        get_image_data = (image) ->
          expr = /([^\.]+)\.(\w+)$/.exec(image)
          if expr
            name = expr[1]
            ext = expr[2]
          else
            name = ''
            expr = ''
          name: name
          ext: ext
        if scope.show_uploader
          scope.uploader = $rootScope.uploader
          scope.uploader.bind('complete', (event, xhr, item, response) ->
            image_data = get_image_data(item.file.name)
            Image.findOne({filter:where:name: image_data.name}, (image) ->
              Image.prototype$createThumb({id: image.id}, scope.size, (thumb_image) ->
                scope.model = image
                console.log element.find('img')
                element.find('img').attr('src', thumb_image.path)
              )
            )
          )
        scope.$watch 'model', (v) ->
          if v && v.url
            Image.prototype$createThumb({id: v.id}, scope.size, (image) ->
              scope.thumb.url = image.path
            )
  ]
directives.directive "ngReallyClick", ["bootbox", (bootbox) ->
    restrict: 'A',
    link: (scope, element, attrs) ->
        element.bind 'click', () ->
            message = attrs.ngReallyMessage
            if message
                bootbox.confirm message, (result) ->
                    if result
                        scope.$apply attrs.ngReallyClick
]
