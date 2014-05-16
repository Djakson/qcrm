// Generated by CoffeeScript 1.6.3
(function() {
  var directives;

  directives = angular.module('app.directives', []).directive('imgHolder', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return Holder.run({
            images: ele[0]
          });
        }
      };
    }
  ]).directive('customBackground', function() {
    return {
      restrict: "A",
      controller: [
        '$scope', '$element', '$location', function($scope, $element, $location) {
          var addBg, path;
          path = function() {
            return $location.path();
          };
          addBg = function(path) {
            $element.removeClass('body-home body-special body-tasks body-lock');
            switch (path) {
              case '/':
                return $element.addClass('body-home');
              case '/404':
              case '/pages/500':
              case '/pages/signin':
              case '/pages/signup':
                return $element.addClass('body-special');
              case '/pages/lock-screen':
                return $element.addClass('body-special body-lock');
              case '/tasks':
                return $element.addClass('body-tasks');
            }
          };
          addBg($location.path());
          return $scope.$watch(path, function(newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            return addBg($location.path());
          });
        }
      ]
    };
  }).directive('uiColorSwitch', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.find('.color-option').on('click', function(event) {
            var $this, hrefUrl, style;
            $this = $(this);
            hrefUrl = void 0;
            style = $this.data('style');
            if (style === 'loulou') {
              hrefUrl = 'styles/main.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else if (style) {
              style = '-' + style;
              hrefUrl = 'styles/main' + style + '.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else {
              return false;
            }
            return event.preventDefault();
          });
        }
      };
    }
  ]).directive('toggleMinNav', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $window, Timer, app, updateClass;
          app = $('#app');
          $window = $(window);
          ele.on('click', function(e) {
            if (app.hasClass('nav-min')) {
              app.removeClass('nav-min');
            } else {
              app.addClass('nav-min');
              $rootScope.$broadcast('minNav:enabled');
            }
            return e.preventDefault();
          });
          Timer = void 0;
          updateClass = function() {
            var width;
            width = $window.width();
            if (width < 768) {
              return app.removeClass('nav-min');
            }
          };
          return $window.resize(function() {
            var t;
            clearTimeout(t);
            return t = setTimeout(updateClass, 300);
          });
        }
      };
    }
  ]).directive('collapseNav', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $a, $aRest, $lists, $listsRest, app;
          $lists = ele.find('ul').parent('li');
          $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
          $a = $lists.children('a');
          $listsRest = ele.children('li').not($lists);
          $aRest = $listsRest.children('a');
          app = $('#app');
          $a.on('click', function(event) {
            var $parent, $this;
            if (app.hasClass('nav-min')) {
              return false;
            }
            $this = $(this);
            $parent = $this.parent('li');
            $lists.not($parent).removeClass('open').find('ul').slideUp();
            $parent.toggleClass('open').find('ul').slideToggle();
            return event.preventDefault();
          });
          $aRest.on('click', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
          return scope.$on('minNav:enabled', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
        }
      };
    }
  ]).directive('highlightActive', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
            var highlightActive, links, path;
            links = $element.find('a');
            path = function() {
              return $location.path();
            };
            highlightActive = function(links, path) {
              path = '#' + path;
              return angular.forEach(links, function(link) {
                var $li, $link, href;
                $link = angular.element(link);
                $li = $link.parent('li');
                href = $link.attr('href');
                if ($li.hasClass('active')) {
                  $li.removeClass('active');
                }
                if (path.indexOf(href) === 0) {
                  return $li.addClass('active');
                }
              });
            };
            highlightActive(links, $location.path());
            return $scope.$watch(path, function(newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              return highlightActive(links, $location.path());
            });
          }
        ]
      };
    }
  ]).directive('toggleOffCanvas', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.on('click', function() {
            return $('#app').toggleClass('on-canvas');
          });
        }
      };
    }
  ]).directive('slimScroll', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.slimScroll({
            height: '100%'
          });
        }
      };
    }
  ]).directive('goBack', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$window', function($scope, $element, $window) {
            return $element.on('click', function() {
              return $window.history.back();
            });
          }
        ]
      };
    }
  ]);

  directives.directive('ngThumb', '$window', function($window) {
    var helper;
    helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type;
        type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };
    return [
      {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
          var canvas, onLoadFile, onLoadImage, params, reader;
          if (!helper.support) {
            return;
          }
          params = scope.$eval(attributes.ngThumb);
          if (!helper.isFile(params.file)) {
            return;
          }
          if (!helper.isImage(params.file)) {
            return;
          }
          canvas = element.find('canvas');
          reader = new FileReader();
          reader.onload = onLoadFile;
          reader.readAsDataURL(params.file);
          onLoadFile = function(event) {
            var img;
            img = new Image();
            img.onload = onLoadImage;
            return img.src = event.target.result;
          };
          return onLoadImage = function() {
            var height, width;
            width = params.width || this.width / this.height * params.height;
            height = params.height || this.height / this.width * params.width;
            canvas.attr({
              width: width,
              height: height
            });
            return canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
          };
        }
      }
    ];
  });

  /*Создание thumbnail по указанной модели Image*/


  directives.directive('qcthumb', [
    'Image', '$rootScope', function(Image, $rootScope) {
      return {
        restrict: 'AE',
        template: '<div><img ng-src="{{thumb.url}}" alt=""/><input ng-hide="!show_uploader" ng-file-select type="file" /></div>',
        replace: true,
        scope: {
          model: '=',
          size: '='
        },
        link: function(scope, element, attributes) {
          var get_image_data;
          scope.thumb = [];
          scope.show_uploader = attributes.uploader;
          get_image_data = function(image) {
            var expr, ext, name;
            expr = /([^\.]+)\.(\w+)$/.exec(image);
            if (expr) {
              name = expr[1];
              ext = expr[2];
            } else {
              name = '';
              expr = '';
            }
            return {
              name: name,
              ext: ext
            };
          };
          if (scope.show_uploader) {
            scope.uploader = $rootScope.uploader;
            scope.uploader.bind('complete', function(event, xhr, item, response) {
              var image_data;
              image_data = get_image_data(item.file.name);
              return Image.findOne({
                filter: {
                  where: {
                    name: image_data.name
                  }
                }
              }, function(image) {
                return Image.prototype$createThumb({
                  id: image.id
                }, scope.size, function(thumb_image) {
                  scope.model = image;
                  console.log(element.find('img'));
                  return element.find('img').attr('src', thumb_image.path);
                });
              });
            });
          }
          return scope.$watch('model', function(v) {
            if (v && v.url) {
              return Image.prototype$createThumb({
                id: v.id
              }, scope.size, function(image) {
                return scope.thumb.url = image.path;
              });
            }
          });
        }
      };
    }
  ]);

  directives.directive("ngReallyClick", [
    "bootbox", function(bootbox) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          return element.bind('click', function() {
            var message;
            message = attrs.ngReallyMessage;
            if (message) {
              return bootbox.confirm(message, function(result) {
                if (result) {
                  return scope.$apply(attrs.ngReallyClick);
                }
              });
            }
          });
        }
      };
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=directives.map
*/