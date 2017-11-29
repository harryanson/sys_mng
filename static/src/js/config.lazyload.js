// lazyload config
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
    angular.module('app')
      .constant('JQ_CONFIG', {
      easyPieChart:   [   root_dir+'bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'],
      sparkline:      [   root_dir+'bower_components/jquery.sparkline/dist/jquery.sparkline.retina.js'],
      plot:           [   root_dir+'bower_components/flot/jquery.flot.js',
                          root_dir+'bower_components/flot/jquery.flot.pie.js',
                          root_dir+'bower_components/flot/jquery.flot.resize.js',
                          root_dir+'bower_components/flot.tooltip/js/jquery.flot.tooltip.js',
                          root_dir+'bower_components/flot.orderbars/js/jquery.flot.orderBars.js',
                          root_dir+'bower_components/flot-spline/js/jquery.flot.spline.js'],
      moment:         [   root_dir+'bower_components/moment/min/moment.min.js'],
      screenfull:     [   root_dir+'bower_components/screenfull/dist/screenfull.min.js'],
      slimScroll:     [   root_dir+'bower_components/slimscroll/jquery.slimscroll.min.js'],
      sortable:       [   root_dir+'bower_components/html5sortable/jquery.sortable.js'],
      nestable:       [   root_dir+'bower_components/nestable/jquery.nestable.js',
                          root_dir+'bower_components/nestable/jquery.nestable.css'],
      filestyle:      [   root_dir+'bower_components/bootstrap-filestyle/src/bootstrap-filestyle.js'],
      slider:         [   root_dir+'bower_components/bootstrap-slider/bootstrap-slider.js',
                          root_dir+'bower_components/bootstrap-slider/bootstrap-slider.css'],

      chosen:         [   root_dir+'plugins/chosen/chosen.jquery.min.js',
            root_dir+'plugins/chosen/chosen.min.css'],
      TouchSpin:      [   root_dir+'bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                          root_dir+'bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
      wysiwyg:        [   root_dir+'bower_components/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                          root_dir+'bower_components/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
      vectorMap:      [   root_dir+'bower_components/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
                          root_dir+'bower_components/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
                          root_dir+'bower_components/bower-jvectormap/jquery-jvectormap-us-aea-en.js',
                          root_dir+'bower_components/bower-jvectormap/jquery-jvectormap-1.2.2.css'],
      footable:       [   root_dir+'bower_components/footable/dist/footable.all.min.js',
                          root_dir+'bower_components/footable/css/footable.core.css'],
      fullcalendar:   [   root_dir+'bower_components/moment/moment.js',
                          root_dir+'bower_components/fullcalendar/dist/fullcalendar.min.js',
                          root_dir+'bower_components/fullcalendar/dist/fullcalendar.css',
                          root_dir+'bower_components/fullcalendar/dist/fullcalendar.theme.css'],
      daterangepicker:[   root_dir+'bower_components/moment/moment.js',
                          root_dir+'bower_components/bootstrap-daterangepicker/daterangepicker.js',
                          root_dir+'bower_components/bootstrap-daterangepicker/daterangepicker-bs3.css'],
      tagsinput:      [   root_dir+'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
                          root_dir+'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css']

    }
  )
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
      // We configure ocLazyLoad to use the lib script.js as the async loader
      $ocLazyLoadProvider.config({
          debug:  false,
          events: true,
          modules: [
            {
              name: 'ui.bootstrap',
              files: [
                root_dir+'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
              ]
            },
            {
              name: 'cgBusy',
              files: [
                root_dir+'bower_components/angular-busy/dist/angular-busy.min.js',
                root_dir+'bower_components/angular-busy/dist/angular-busy.min.css'
              ]
            },
              {
                  name: 'ngMessages',
                  files: [
                      root_dir+'bower_components/angular-messages/angular-messages.min.js'
                  ]
              },
            {
              name: 'ui.grid',
              files: [
                root_dir+'bower_components/angular-ui-grid/ui-grid.min.js',
                root_dir+'bower_components/angular-ui-grid/ui-grid.min.css'
              ]
            },
            {
              name: 'ui.select',
              files: [
                root_dir+'bower_components/angular-ui-select/dist/select.min.js',
                root_dir+'bower_components/angular-ui-select/dist/select.min.css'
              ]
            },
            {
              name:'ngImgCrop',//图片预览
              files: [
                root_dir+'bower_components/ng-img-crop/compile/minified/ng-img-crop.js',
                root_dir+'bower_components/ng-img-crop/compile/minified/ng-img-crop.css'

              ]
            },
            {
              name:'bootstrapLightbox',//angular-loading-bar
              files: [
                root_dir+'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.js',
                root_dir+'bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.css'
              ]
            },
            {
              name: 'toaster',//提示
              files: [
                root_dir+'bower_components/AngularJS-Toaster/toaster.min.js',
                root_dir+'bower_components/AngularJS-Toaster/toaster.min.css'
              ]
            },
            {
              name:'ui.bootstrap.contextMenu',//右键浮层组件
              files: [
                root_dir+'plugins/contextMenu.js'
              ]
            },
              {
                  name:'ngStorage',//angular localStorage
                  files: [
                      root_dir+'bower_components/ngstorage/ngStorage.min.js'
                  ]
              },
              {
                  name:'bootstrapTreeview',//angular localStorage
                  files: [
                      root_dir+'bower_components/bootstrap-treeview/dist/bootstrap-treeview.min.js',
                      root_dir+'bower_components/bootstrap-treeview/dist/bootstrap-treeview.min.css'

                  ]
              },
            {
              name:'ngFileUpload',
              files: [
                root_dir+'bower_components/ng-file-upload/ng-file-upload.min.js'
              ]
            },
              {
                  name:'ui.calendar',
                  files: [root_dir+'bower_components/angular-ui-calendar/src/calendar.js']
              },
              {
                  name: 'angularBootstrapNavTree',
                  files: [
                      root_dir+'bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                      root_dir+'bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css'
                  ]
              },
              {
                  name: 'textAngular',
                  files: [
                      root_dir+'bower_components/textAngular/dist/textAngular-sanitize.min.js',
                      root_dir+'bower_components/textAngular/dist/textAngular.min.js'
                  ],
                  serie: true
              },
              {
                  name: 'vr.directives.slider',
                  files: [
                      root_dir+'bower_components/venturocket-angular-slider/build/angular-slider.min.js',
                      root_dir+'bower_components/venturocket-angular-slider/build/angular-slider.css'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular',
                  files: [
                      root_dir+'bower_components/videogular/videogular.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.controls',
                  files: [
                      root_dir+'bower_components/videogular-controls/controls.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.buffering',
                  files: [
                      root_dir+'bower_components/videogular-buffering/buffering.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.overlayplay',
                  files: [
                      root_dir+'bower_components/videogular-overlay-play/overlay-play.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.poster',
                  files: [
                      root_dir+'bower_components/videogular-poster/poster.min.js'
                  ]
              },
              {
                  name: 'com.2fdevs.videogular.plugins.imaads',
                  files: [
                      root_dir+'bower_components/videogular-ima-ads/ima-ads.min.js'
                  ]
              },
              {
                  name: 'xeditable',
                  files: [
                      root_dir+'bower_components/angular-xeditable/dist/js/xeditable.min.js',
                      root_dir+'bower_components/angular-xeditable/dist/css/xeditable.css'
                  ]
              },
              {
                  name: 'ui.tree',
                  files: [
                      root_dir+'bower_components/angular-ui-tree/dist/angular-ui-tree.min.js',
                      root_dir+'bower_components/angular-ui-tree/dist/angular-ui-tree.min.css'
                  ]
              }
          ]
      });
  }]);
