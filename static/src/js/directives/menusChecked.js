angular.module('app')
  .directive('menusChecked', [function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function (scope, elem, attrs, ngModel) {
        if (!ngModel) return;
        scope.$watch(attrs.ngModel, function () {
          validate();
        }, true);
        function getListids(menus) {
          return menus.some(function (m) {
            if (!!m.children) {
              return getListids(m.children);
            }
            return !!m.checked;
          });
        }

        var validate = function () {
          var isChecked = false, menus = ngModel.$viewValue;
          if (Array.isArray(menus) && menus.length > 0) {
            isChecked = getListids(menus);
          }
          console.log('menusChecked;', isChecked)
          // set validity
          ngModel.$setValidity('menusChecked', isChecked);
        };
      }
    }
  }]);