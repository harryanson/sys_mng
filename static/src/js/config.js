// config
var app = angular.module('app')
  .config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
      function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
      }
    ]).factory('createAjax', ['$localStorage', '$http','$state', '$timeout', function ($localStorage, $http,$state, $timeout) {
    /**
     * 封装Ajax请求
     * @param url
     * @param data
     * @param sucFun
     * @param async 是否异步 默认 true
     * isShowError 是否封装数据 默认 true
     * isChangeData 是否封装数据 默认 true
     */
    return function (url, data, sucFun, isShowError, isChangeData) {
      var method = 'post', dataType = 'json', async = true;
      if ($.isEmptyObject(currentUser)) {
        currentUser = $localStorage.currentUser || {};
      }
      if (!url && currentUser && currentUser.paths[data.key]) {
        url = currentUser.paths[data.key].path;
        method = currentUser.paths[data.key].method;
        if (!url) {
          console.log('not found url', data.key)
          return;
        }
        delete data.key;
      } else {
        if (!url) {
          location.href = '#/access/signin';
          return;
        }
      }
      if (typeof data === 'function') {
        sucFun = data;
        data = {};
      }
      if (isChangeData == undefined || typeof isChangeData != 'boolean') {
        isChangeData = true;
      }
      if (isShowError == undefined || typeof isShowError != 'boolean') {
        isShowError = true;
      }
      var json = {
        method: method,
        url: mng_uri + url,
        headers: {
          "x-access-token": currentUser.accessToken
        },
        timeout: 30000
      };
      if (method.toLowerCase() == 'post') {
        json.data = data
      } else {
        json.params = data;
      }
      return $http(json).then(function (ret) {
        var data = ret.data;
        if (data != null || data.code != undefined) {
          if (isChangeData == true && data.data) {
            data = data.data;
          }
          if (sucFun !== null && sucFun !== undefined) {
            return sucFun(data);
          }
        }
      }, function (ret) {
        console.log('error', ret);
        var data = ret.data;
        if (typeof data != 'object') {
          data = {code: errors.internal_server_error};
        }
        if (isShowError) {
          if (!!data) {
            if (data.code == errors.accesstoken_expired || data.code == errors.unauthorized) {
              delete $localStorage.currentUser;
              $timeout(function () {
                $state.go('access.signin')
              });
              return;
            } else {
              return showNotice(data.code);
            }
          } else {
            showNotice(errors.internal_server_error);
          }
        } else {
          if (sucFun !== null && sucFun !== undefined) {
            if (!!data) {
              return sucFun({code: data.code});
            } else {
              return sucFun({code: errors.internal_server_error});
            }
          }
        }
      });
      // return defer.promise

    };
  }]);