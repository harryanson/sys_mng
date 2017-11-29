angular.module('app')
    .directive('passwordRight', ['$timeout','createAjax', function ($timeout,createAjax) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return;

                /*                scope.$watch(attrs.ngModel, function () {
                 validate();
                 });*/
                elem.bind('blur', function (e) {
                    if (!$.isEmptyObject(currentUser) && ngModel.$viewValue) {
                        createAjax(null, {
                            key: 'user_checkpwd',
                            loginname: currentUser.loginname,
                            password: ngModel.$viewValue
                        }, function (data) {
                            var flag = false;
                            if (data.code == 0) {
                                flag = true;
                            }
                            $timeout(function () {
                                ngModel.$setValidity('passwordRight', flag);
                            });
                        },false, false);
                    }
                });
            }
        }
    }]);