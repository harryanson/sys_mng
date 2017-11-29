/**
 * Created by Harry on 2016/4/28.
 */
app.controller('ModalCtrl', ['$scope', '$uibModalInstance','$timeout','info', function ($scope, $uibModalInstance,$timeout,info) {
    $scope.info = info;
    $scope.ok = function () {
        $uibModalInstance.close($scope.info);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

