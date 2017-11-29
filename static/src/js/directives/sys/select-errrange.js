angular.module('app').directive('selectErrrange', ['$localStorage', function ($localStorage) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            ngModel: '='
        },
        template: function (element, attrs) {
            var ret = '<select class="form-control" ng-options="item as item.name for item in range"></select>';
            return ret;
        },
        link: function (scope, element, attrs) {
            var info = scope.ngModel;
            async.waterfall([function(cb) {
                cb(null,$localStorage.errcode_range);
            },function (val,cb) {
                if(!val){
                    createAjax(null, {key:'errcoderange_all'}, function (data) {
                        data=data.map(function(item){
                            item.name=item.name+'【'+item.min+'——'+item.max+'】';
                            return item;
                        });
                        $localStorage.errcode_range=data;
                        cb(null,data);
                    });
                }else{
                    cb(null,val);
                }
            },function(data,cb){
                scope.range = data;
            }], function (err) {
                if (err) {
                    showNotice(errors.internal_server_error);
                }
            });
        }
    }
}]);