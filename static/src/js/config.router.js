/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
            function ($stateProvider, $urlRouterProvider, JQ_CONFIG) {

                $urlRouterProvider
                    .otherwise('/app/home');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'html/app.html',
                        resolve: {
                            deps: ['$$animateJs','$ocLazyLoad',
                                function ($$animateJs,$ocLazyLoad) {
                                    return $ocLazyLoad.load(['cgBusy','ui.grid']);
                                }
                            ]
                        }
                    })
                    .state('app.home', {
                        url: '/home',
                        templateUrl: 'html/home.html',
                        controller: 'HomeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    // ['ui.bootstrap', 'ui.bootstrap.contextMenu', 'toaster', 'ui.grid', 'ngImgCrop', 'ngFileUpload']
                                    return $ocLazyLoad.load(['ngMessages','js/controllers/home.js', 'js/directives/passwordRight.js', 'js/directives/passwordEqually.js',
                                        'js/directives/passwordDifferent.js', 'js/directives/menusChecked.js','js/services/gridTool.js']);

                                }
                            ]
                        }
                    })
                    // 系统管理
                    .state('app.sys', {
                        url: '/sys',
                        template: '<div ui-view></div>'
                    })
                    //错误码
                    .state('app.sys.errcode', {
                        url: '/errcode',
                        templateUrl: 'html/sys/errcode/list.html',
                        controller: 'ErrCodeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/directives/sys/select-errrange.js', 'js/controllers/sys/errcode.js']);
                                }]
                        }
                    })
                    .state('app.sys.errcoderange', {
                        url: '/errcode_range',
                        templateUrl: 'html/sys/errcode_range/list.html',
                        controller: 'ErrCodeRangeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/sys/errcode_range.js']);
                                }]
                        }
                    })
                    //错误码
                    .state('app.order', {
                        url: '/order',
                        templateUrl: 'html/order/orderlist.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/order/orderlist.js']);
                                }]
                        }
                    })
                    .state('access', {
                        url: '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signin', {
                        url: '/signin',
                        templateUrl: 'html/page_signin.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/signin.js']);
                                }]
                        }
                    })
                    .state('access.forgotpwd', {
                        url: '/forgotpwd',
                        templateUrl: 'html/page_forgotpwd.html'
                    })
                    .state('access.404', {
                        url: '/404',
                        templateUrl: 'html/page_404.html'
                    });
            }
        ]
    );