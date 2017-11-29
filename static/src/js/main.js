/* main Controllers */
angular.module('app')
  .controller('AppCtrl', ['$scope', '$rootScope', '$localStorage', '$window',  '$ocLazyLoad', '$timeout', 'shareParam', '$interval','ModalService','$location', '$transitions', '$state','createAjax',
    function ($scope, $rootScope, $localStorage, $window, $ocLazyLoad, $timeout, shareParam, $interval,ModalService, $location, $transitions, $state,createAjax) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
      // i18nService.setCurrentLang('zh-cn');
      // config
      $scope.app = {
        name: '管理系统',
        version: '1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      };

      $scope.logout = function () {
        createAjax('/sys/logout', {}, function (data) {
          console.log(data)
            delete $localStorage.currentUser;
            console.log('del currentUser logout ok');
        }, false, false);
      };
      $scope.modifyPwd = function () {
        var loginname = $localStorage.currentUser.loginname;
        var title = "密码修改";
        async.waterfall([function (cb) {
          ModalService.baseModal({
            htmlId: 'html/blocks/pwd.html',
            openCtrl: 'ModalCtrl',
            param: {title: title, loginname: loginname}
          }, function (val) {
            cb(null, val);
          });
        }, function (val, cb) {
          val.key = 'userlist_editpwd';
          createAjax(null, val, function (data) {
            showNotice(data.code);
            $timeout(function () {
              delete $localStorage.currentUser;
              $state.go('access.signin');
            },2000);

          });
        }], function (err) {
          if (err) {
            console.log(err);
          }
        });
      };

      function loadContent(key, refresh) {
        if ($.isEmptyObject(currentUser) && !!$localStorage.currentUser) {
          currentUser = $localStorage.currentUser;
        }
        if (!$.isEmptyObject(currentUser) && !!currentUser.paths[key]) {
          var loadJs = currentUser.paths[key].load_js;
          if (loadJs) {
            if (Array.isArray(loadJs)) {
              $ocLazyLoad.load(loadJs[0]).then(
                function () {
                  if (loadJs[1] && Array.isArray(loadJs)) {
                    $ocLazyLoad.load(loadJs[1]).then(function () {
                      selectTab(key, refresh);
                    });
                  } else {
                    selectTab(key, refresh);
                  }
                });
            } else {
              $ocLazyLoad.load(loadJs).then(
                function () {
                  selectTab(key, refresh);
                });
            }
          }
        }
      };
      $scope.loadContent = loadContent;
      $scope.tabs = [];
      $scope.counter = 1;
      $scope.selectedTab = 0; //set selected tab to the 1st by default.
      /** Function to add a new tab **/
      function addTab(key) {
        $timeout(function () {
          $scope.counter++;
          if ($scope.tabs[$scope.selectedTab]) {
            $scope.tabs[$scope.selectedTab].active = '';
          }
          var tab = {
            id: $scope.counter,
            key: key,
            active: 'active',
            title: currentUser.paths[key].text,
            html: currentUser.paths[key].html,
            content: currentUser.paths[key].html + '?now=' + new Date().getTime()
          };
          $scope.tabs.push(tab);
          $scope.selectedTab = $scope.tabs.length - 1; //set the newly added tab active.
        });
      }

      /** Function to delete a tab **/
      function deleteTab(key) {
        var tabsObj = $scope.tabs.toObject('key'), obj = tabsObj[key];
        $timeout(function () {
          if (obj.hasOwnProperty(key)) {
            $('#' + obj.key).remove();
          }
          $scope.tabs.splice(obj.index, 1);
          $scope.selectedTab = $scope.tabs.length - 1;
          if ($scope.tabs.length > 0) {
            $scope.tabs[$scope.selectedTab].active = 'active';
          }
        });
      }

      $scope.deleteTab = deleteTab;
      /** Function to set selectedTab **/
      function selectTab(key, refresh) {
        var tabsObj = $scope.tabs.toObject('key'), obj = tabsObj[key], url_key = getUrlParam('key');
        if ($scope.tabs.length >= 10) {
          showNotice('标签页不能超过' + $scope.tabs.length + '页');
          return;
        }
        $location.search("key", key);
        if (obj) {
          if ($scope.selectedTab != obj.index) {
            $timeout(function () {
              $scope.tabs[$scope.selectedTab].active = '';
              $scope.tabs[obj.index].active = 'active';
              if (refresh) {
                $scope.tabs[obj.index].content = $scope.tabs[obj.index].html + '?now=' + new Date().getTime();
              }
              $scope.selectedTab = obj.index;
              return;
            });
          }
        } else {
          return addTab(key);
        }
        $scope.app.promise = true;
      }

      $scope.selectTab = selectTab;
      // save settings to local storage
      if (angular.isDefined($localStorage.settings)) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function () {
        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      $scope.new_orders = [];
      var showToaster = function (info, toastId) {
        if (info.counts > 0) {
          $scope.new_orders.push(info);
          shareParam.setParam({new_orders: $scope.new_orders});
          return toaster.pop({
            toastId: toastId,
            type: info.toasterType || 'info',
            title: info.category + '订单',
            preventDuplicates: true,
            body: 'toaste-html',
            bodyOutputType: 'directive',
            directiveData: {
              category: info.category,
              categoryKey: info.categoryKey,
              categoryno: info.categoryno,
              counts: info.counts
            }
          });
        } else {
          return;
        }
      };

      function toasterTimer() {
        $interval(function () {
          if ($localStorage.hasOwnProperty('currentUser')) {
            createAjax(null, {key: 'new_orders'}, function (data) {
              toaster.clear();
              $scope.new_orders = [];
              for (var i = 0, len = data.length; i < len; ++i) {
                showToaster(data[i], i + 1);
              }
            });
          }
        }, 1000 * 60);
      }

      $scope.menuOptions = [
        ['重新加载', function ($itemScope, event, modelValue, text, $li) {
          modelValue.content = modelValue.html + '?now=' + new Date().getTime();
        }], null, ['关闭标签页', function ($itemScope, event, modelValue, text, $li) {
          deleteTab(modelValue.key);
        }], null, ['关闭其他标签页', function ($itemScope, event, modelValue, text, $li) {
          $scope.tabs = [modelValue];
          $scope.selectedTab = 0;
          $scope.tabs[$scope.selectedTab].active = '';
          $scope.tabs[0].active = 'active';
        }], null, ['关闭右侧标签页', function ($itemScope, event, modelValue, text, $li) {
          if ($itemScope.$index < $scope.tabs.length - 1) {
            $scope.tabs.length = $itemScope.$index + 1;
            var keyArray = [];
            for (var i = $itemScope.$index + 1, len = $scope.tabs.length; i < len; i++) {
              keyArray.push($scope.tabs[i].key);
            }
            for (var i = 0, len = keyArray.length; i < len; i++) {
              deleteTab(keyArray[i]);
            }
          }
        }]
      ];
      /**
       * 初始化
       */
      function init() {
        var key = getUrlParam('key');
        if (!$localStorage.currentUser) {
          $timeout(function () {
            $state.go('access.signin');
          });
          //处理回退问题
          $transitions.onBefore({
            to: function (state) {
              return state.name !== 'access.signin';
            }
          }, function (trans) {
            return trans.router.stateService.target('access.signin');
          });

        }
        //定时查询新订单
        // toasterTimer();
        //打开对应标签页
        if (key) {
          $timeout(function () {
            $('#menu_' + key).parent().parent().parent().addClass('auto active')
          }, 1000);
          loadContent(key);
        }

      }

      init();
      //关闭
      $scope.closeToaste = function (obj) {
        toaster.clear(obj);
      }

      $scope.clearAllToaste = function () {
        toaster.clear();
      };
      function isSmartDevice($window) {
        // Adapted from http://www.detectmobilebrowsers.com
        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
    }
  ])
;
