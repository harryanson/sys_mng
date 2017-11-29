'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$localStorage', '$timeout','createAjax', function ($scope, $localStorage, $timeout,createAjax) {
    $scope.user = {};
    $scope.authError = null;
    $scope.$watch('user', function () {
        $timeout(function(){
            $scope.user;
        });
    });
    $scope.login = function () {
        $scope.authError = null;
        //判断某个对象是不是数组
        function isArray(obj) {
            return obj && ( typeof obj === 'object') && (obj.constructor == Array);
        }

        //eleNum变量初始值为0，用来统计数组元素个数
        var eleNum = 0;
        //递归计算某个数组元素是不是下一维数组，如果是，则继续递归下去；如果不是，统计元素个数。
        function recursion(obj) {
            if (isArray(obj)) {
                for (var j = 0; j < obj.length; j++) {
                    if (!isArray(obj[j])) {
                        if (obj[j].indexOf('.js') > 0) {
                            obj[j] = obj[j];
                        }
                        eleNum++;
                        continue;
                    }
                    recursion(obj[j]);
                }
            } else {
                eleNum++;
            }
        }

        function getArrNElementNum(arr) {
            eleNum = 0;
            if (!!arr && Array.isArray(arr)) {
                recursion(arr);
            }
            return eleNum;
        }

        // Try to login
        createAjax('/sys/login', {loginname: $scope.user.loginname, password: $scope.user.password}, function (data) {
            if (data.code == 0) {
              var paths = {},menus=[],limits=data.data.limits,tree= JSON.parse(JSON.stringify(menuTree));
              for (var i = 0; i < tree.length; i++) {
                if (tree[i].id.length == 2 &&limits.includes(tree[i].id)) {
                  var leaftree = [];
                  if (tree[i].children != undefined) {
                    for (var j = 0; j < tree[i].children.length; j++) {
                      if (limits.includes(tree[i].children[j].id)) {
                        if (tree[i].children[j].path) {
                          paths[tree[i].children[j].key] = {
                            text: tree[i].children[j].text,
                            method: tree[i].children[j].method,
                            path: tree[i].children[j].path,
                            html: tree[i].children[j].html,
                            load_js: tree[i].children[j].load_js
                          };
                        }
                        var leaftree2 = [];
                        if (tree[i].children[j].children != undefined) {
                          for (var k = 0; k < tree[i].children[j].children.length; k++) {
                            if (limits.includes(tree[i].children[j].children[k].id)) {
                              if (tree[i].children[j].children[k].path) {
                                paths[tree[i].children[j].children[k].key] = {
                                  text: tree[i].children[j].children[k].text,
                                  method: tree[i].children[j].children[k].method,
                                  path: tree[i].children[j].children[k].path,
                                  html: tree[i].children[j].children[k].html,
                                  load_js: tree[i].children[j].children[k].load_js
                                };
                              }
                              leaftree2.push(tree[i].children[j].children[k]);
                            }
                          }
                        }
                        tree[i].children[j].children = leaftree2;
                        leaftree.push(tree[i].children[j]);
                      }
                    }
                  }
                  tree[i].children = leaftree;
                  menus.push(tree[i]);
                }
              }
              data.data.menus = menus;
              $scope.app.menus = menus;
              data.data.paths = paths;
              $localStorage.currentUser = currentUser = data.data;
              $timeout(function () {
              window.location.href = '#/app/home';
              location.reload();
              });
            } else {
                $timeout(function () {
                    $scope.authError = errcode[data.code]['message'];
                });
            }
        }, false,false);
    };
}])
;