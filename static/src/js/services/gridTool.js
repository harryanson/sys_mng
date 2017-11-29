/**
 * Created by Harry on 2016/10/17.
 */
angular.module('app')
    .service('gridTool', ['$timeout','createAjax', function ($timeout,createAjax) {
        var self = this, ret;
        self.addRow = function (val, $scope) {
            $timeout(function () {
                $scope.gridOptions.data.unshift(val);
            });
        }
        self.editRow = function (val, $scope) {
            $scope.gridOptions.data = $scope.gridOptions.data.map(function (v) {
                if (v.$$hashKey== val.$$hashKey) {
                    console.log('======change row========',v.$$hashKey);
                    return val;
                } else {
                    return v;
                }
            });
        }
        self.delRow = function (val, $scope) {
            var index;
            $scope.gridOptions.data.forEach(function (item, i) {
                if (item.code == val.code) {
                    index = i;
                    return;
                }
                $timeout(function () {
                    $scope.gridOptions.data.splice(index, 1);
                });
            });
        }
        /**
         * 刷新页面
         * @param data
         */
        self.refresh=function(data,$scope) {
            if ($scope.app) {
                $scope.app.promise = createAjax(null, data, function (data) {
                    $timeout(function () {
                        if(data.total){
                            $scope.gridOptions.totalItems = parseInt(data.total);
                            $scope.gridOptions.data = data.list;
                        }else{
                            $scope.gridOptions.data = data;
                        }
                    });
                });
            }

        }
    }]);