angular.module('app')
  .directive('passwordDifferent',[function() {
      return {
          restrict: 'A',
          require: '?ngModel',
          link: function(scope, elem, attrs, ngModel) {
              if (!ngModel) return;

              scope.$watch(attrs.ngModel, function() {
                  validate();
              });

              // observe the other value and re-validate on change
              attrs.$observe('passwordDifferent', function(val) {
                  validate();
              });

              var validate = function() {
                  // values
                  var val1 = ngModel.$viewValue;
                  var val2 = attrs.passwordDifferent;

                  // set validity
                  ngModel.$setValidity('passwordDifferent', val1 != val2);
              };
          }
      }
  }]);